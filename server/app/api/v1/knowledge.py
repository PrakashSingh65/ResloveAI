import logging
import time
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.api.deps import get_db
from app.models.knowledge import DocumentCategory, KnowledgeDocument
from app.schemas.knowledge import (
    KnowledgeDocumentCreate,
    KnowledgeDocumentSchema,
    RAGQueryRequest,
    RAGQueryResponse,
)
from app.services.rag_service import RAGService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/documents",
    response_model=List[KnowledgeDocumentSchema],
    summary="List indexed knowledge documents",
)
async def list_knowledge_documents(
    category: Optional[DocumentCategory] = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(KnowledgeDocument)
    if category:
        stmt = stmt.where(KnowledgeDocument.category == category)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get(
    "/documents/{document_id}",
    response_model=KnowledgeDocumentSchema,
    summary="Get knowledge document detail",
)
async def get_knowledge_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(KnowledgeDocument).where(KnowledgeDocument.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc


@router.post(
    "/documents",
    response_model=KnowledgeDocumentSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and vectorize a new knowledge document",
)
async def create_knowledge_document(
    payload: KnowledgeDocumentCreate,
    db: AsyncSession = Depends(get_db),
):
    doc = await RAGService.index_document(db, payload)
    return doc


@router.post(
    "/query",
    response_model=RAGQueryResponse,
    summary="Semantic vector retrieval query",
)
async def query_knowledge(
    payload: RAGQueryRequest,
    db: AsyncSession = Depends(get_db),
):
    start_time = time.time()
    citations = await RAGService.query_relevant_chunks(
        db,
        query=payload.query,
        top_k=payload.top_k,
        category=payload.category,
    )
    latency_ms = int((time.time() - start_time) * 1000)

    return RAGQueryResponse(
        query=payload.query,
        citations=citations,
        retrieval_latency_ms=latency_ms,
    )


@router.post(
    "/seed",
    summary="Seed default SOPs, Return Policies & Manuals",
)
async def seed_knowledge_base(db: AsyncSession = Depends(get_db)):
    count = await RAGService.seed_default_knowledge(db)
    return {"message": "Knowledge base seeding complete", "documents_added": count}
