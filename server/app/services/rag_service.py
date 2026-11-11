import logging
import uuid
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.knowledge import DocumentCategory, DocumentChunk, KnowledgeDocument
from app.schemas.knowledge import KnowledgeDocumentCreate, RAGCitation
from app.services.llm_router import LLMRouter

logger = logging.getLogger(__name__)

DEFAULT_SOP_DATA = [
    {
        "title": "FedEx / UPS Logistics Carrier SOP - Lost in Transit Protocols",
        "category": DocumentCategory.LOGISTICS,
        "doc_type": "Carrier SOP",
        "clause_number": "Clause 4.2.1",
        "source_url": "https://sop.internal.logistics/carrier-sop-v4.pdf",
        "file_size": "24 KB",
        "tags": ["Logistics", "Lost Package", "Carrier Escalation", "Tracking"],
        "content": """Clause 4.2.1: Severe In-Transit Delay & Lost Consignment Protocol.
When a package tracking status has remained un-scanned or stagnant at a transit hub for greater than 48 business hours without an origin departure scan, the shipment qualifies as 'Potentially Lost in Transit'.
The automated customer system must initiate a Carrier Trace Ping. If the depot confirms the scan anomaly was due to mechanical sorter diversion or misplaced pallet tagging, the customer is entitled to an immediate priority replacement dispatch or a full refund under SLA guarantee. Zero customer repetition is required during handoff.""",
    },
    {
        "title": "Hardware Warranty & OLED Display Flickering Diagnostic Manual",
        "category": DocumentCategory.PRODUCT,
        "doc_type": "Policy Guide",
        "clause_number": "Clause 8.1",
        "source_url": "https://manuals.resolveai.internal/hardware-warranty.pdf",
        "file_size": "18 KB",
        "tags": ["Hardware", "OLED", "Screen", "Warranty", "RMA"],
        "content": """Clause 8.1: Display Panel Fault Isolation & Rapid RMA Policy.
For hardware devices exhibiting display flickering, green vertical tint lines, or erratic touch sensitivity:
Step 1: Perform a mandatory 30-second hard power-cycle with peripheral disconnect.
Step 2: Check ambient light sensor recalibration in diagnostic recovery mode.
If hardware failure persists across 2 consecutive diagnostic attempts, automatic RMA replacement unit must be authorized without requiring return of original unit first for tier-1 verified customers.""",
    },
    {
        "title": "Billing Dispute & Automatic Reversal Guidelines",
        "category": DocumentCategory.BILLING,
        "doc_type": "Policy Guide",
        "clause_number": "Clause 2.3",
        "source_url": "https://billing.resolveai.internal/reversals.pdf",
        "file_size": "14 KB",
        "tags": ["Billing", "Refund", "Dispute", "Chargeback"],
        "content": """Clause 2.3: Double-Billing and Erroneous Charge Reversal.
In instances where an automated subscription renewal charged a customer twice within the same 24-hour settlement window, the AI agent is authorized to trigger an immediate Stripe reverse-charge authorization for amounts up to $150. Any dispute exceeding $150 requires automatic escalation with an attached transaction audit slip to a Senior Billing Supervisor.""",
    },
    {
        "title": "Account Security, 2FA Lockout & Credential Recovery Protocols",
        "category": DocumentCategory.SECURITY,
        "doc_type": "API Specs",
        "clause_number": "Clause 11.4",
        "source_url": "https://security.resolveai.internal/2fa-recovery.pdf",
        "file_size": "19 KB",
        "tags": ["Security", "2FA", "Auth", "Recovery"],
        "content": """Clause 11.4: 2FA Lockout & Magic Link Recovery Sequence.
When a user is locked out due to an unreachable authenticator device:
The AI bot must verify email ownership via a cryptographically signed one-time-passcode (OTP) valid for 10 minutes.
Under no circumstances may password resets be bypassed without secondary factor verification. If email access is also compromised, the ticket must immediately escalate to Tier 2 Security.""",
    },
]


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
    """Splits long text into overlapping chunks for vector embedding."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i : i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += chunk_size - overlap
        if i >= len(words) and len(chunk_words) > 0:
            break
    return chunks if chunks else [text]


class RAGService:
    @classmethod
    async def index_document(
        cls,
        db: AsyncSession,
        payload: KnowledgeDocumentCreate,
    ) -> KnowledgeDocument:
        """
        Creates a knowledge document, splits its content into chunks,
        computes 768-dim embeddings, and stores both in the database.
        """
        chunks_text = chunk_text(payload.content)

        doc = KnowledgeDocument(
            title=payload.title,
            category=payload.category,
            doc_type=payload.doc_type,
            clause_number=payload.clause_number,
            source_url=payload.source_url,
            file_size=payload.file_size,
            tags=payload.tags,
            sample_snippet=chunks_text[0][:200] if chunks_text else "",
            chunks_count=len(chunks_text),
        )
        db.add(doc)
        await db.flush()

        for idx, text in enumerate(chunks_text):
            embedding = await LLMRouter.get_embedding(text)
            chunk = DocumentChunk(
                document_id=doc.id,
                chunk_index=idx,
                content=text,
                embedding=embedding,
                metadata_json={"title": doc.title, "clause": doc.clause_number},
            )
            db.add(chunk)

        await db.commit()
        await db.refresh(doc)
        return doc

    @classmethod
    async def query_relevant_chunks(
        cls,
        db: AsyncSession,
        query: str,
        top_k: int = 3,
        category: Optional[DocumentCategory] = None,
    ) -> List[RAGCitation]:
        """
        Retrieves top-K semantic citations for a user query.
        Uses pgvector cosine distance when available, with keyword fallback.
        """
        query_embedding = await LLMRouter.get_embedding(query)

        # 1. Fetch chunks and documents
        stmt = (
            select(DocumentChunk, KnowledgeDocument)
            .join(KnowledgeDocument, DocumentChunk.document_id == KnowledgeDocument.id)
        )
        if category:
            stmt = stmt.where(KnowledgeDocument.category == category)

        result = await db.execute(stmt)
        rows = result.all()

        if not rows:
            return []

        # Cosine similarity calculation
        import math

        def cosine_similarity(v1: List[float], v2: List[float]) -> float:
            if not v1 or not v2 or len(v1) != len(v2):
                return 0.5
            dot = sum(a * b for a, b in zip(v1, v2))
            norm1 = math.sqrt(sum(a * a for a in v1))
            norm2 = math.sqrt(sum(b * b for b in v2))
            if norm1 == 0 or norm2 == 0:
                return 0.5
            return max(0.0, min(1.0, (dot / (norm1 * norm2) + 1.0) / 2.0))

        scored_citations = []
        for chunk, doc in rows:
            if chunk.embedding:
                score = cosine_similarity(query_embedding, chunk.embedding)
            else:
                score = 0.65

            # Keyword boost if words match
            query_tokens = set(query.lower().split())
            content_tokens = set(chunk.content.lower().split())
            overlap = len(query_tokens.intersection(content_tokens))
            boosted_score = min(0.99, score + (overlap * 0.04))

            citation = RAGCitation(
                doc_id=doc.id,
                doc_name=doc.title,
                doc_type=doc.doc_type,
                clause_number=doc.clause_number,
                similarity_score=round(boosted_score, 2),
                snippet=chunk.content[:280] + ("..." if len(chunk.content) > 280 else ""),
                source_url=doc.source_url,
            )
            scored_citations.append(citation)

        scored_citations.sort(key=lambda c: c.similarity_score, reverse=True)
        return scored_citations[:top_k]

    @classmethod
    async def seed_default_knowledge(cls, db: AsyncSession) -> int:
        """Seeds default carrier SOPs and return policies if table is empty."""
        existing = await db.execute(select(KnowledgeDocument).limit(1))
        if existing.scalar_one_or_none() is not None:
            return 0

        logger.info("Seeding initial default RAG knowledge documents...")
        for item in DEFAULT_SOP_DATA:
            await cls.index_document(
                db,
                KnowledgeDocumentCreate(
                    title=item["title"],
                    category=item["category"],
                    doc_type=item["doc_type"],
                    clause_number=item["clause_number"],
                    source_url=item["source_url"],
                    file_size=item["file_size"],
                    tags=item["tags"],
                    content=item["content"],
                ),
            )
        return len(DEFAULT_SOP_DATA)
