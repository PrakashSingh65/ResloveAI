import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models.knowledge import DocumentCategory


class DocumentChunkSchema(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    chunk_index: int
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class KnowledgeDocumentSchema(BaseModel):
    id: uuid.UUID
    title: str
    category: DocumentCategory
    doc_type: str
    clause_number: Optional[str] = None
    source_url: Optional[str] = None
    file_size: Optional[str] = None
    tags: List[str] = []
    sample_snippet: Optional[str] = None
    chunks_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class KnowledgeDocumentCreate(BaseModel):
    title: str
    category: DocumentCategory = DocumentCategory.LOGISTICS
    doc_type: str = "Carrier SOP"
    clause_number: Optional[str] = None
    source_url: Optional[str] = None
    file_size: Optional[str] = "15 KB"
    tags: List[str] = []
    content: str = Field(description="Full text or markdown content to be chunked and indexed")


class RAGCitation(BaseModel):
    doc_id: uuid.UUID
    doc_name: str
    doc_type: str
    clause_number: Optional[str] = None
    similarity_score: float
    snippet: str
    source_url: Optional[str] = None


class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 4
    category: Optional[DocumentCategory] = None


class RAGQueryResponse(BaseModel):
    query: str
    citations: List[RAGCitation]
    retrieval_latency_ms: int
