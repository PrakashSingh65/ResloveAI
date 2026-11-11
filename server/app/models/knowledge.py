import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlmodel import Field, Relationship, SQLModel


class DocumentCategory(str, Enum):
    LOGISTICS = "Logistics"
    BILLING = "Billing"
    PRODUCT = "Product"
    SECURITY = "Security"


class KnowledgeDocumentBase(SQLModel):
    title: str = Field(min_length=1, max_length=255, index=True)
    category: DocumentCategory = Field(default=DocumentCategory.LOGISTICS, index=True)
    doc_type: str = Field(default="Carrier SOP", max_length=100)
    clause_number: Optional[str] = Field(default=None, max_length=50)
    source_url: Optional[str] = Field(default=None, max_length=500)
    file_size: Optional[str] = Field(default="12 KB", max_length=50)
    tags: List[str] = Field(default=[], sa_column=Column(JSON, nullable=False))
    sample_snippet: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    chunks_count: int = Field(default=0)


class KnowledgeDocument(KnowledgeDocumentBase, table=True):
    __tablename__ = "knowledge_documents"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=lambda: datetime.now(timezone.utc),
        ),
    )

    # Relationships
    chunks: List["DocumentChunk"] = Relationship(
        back_populates="document",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "order_by": "DocumentChunk.chunk_index",
            "lazy": "selectin",
        },
    )


class DocumentChunkBase(SQLModel):
    document_id: uuid.UUID = Field(
        foreign_key="knowledge_documents.id",
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    chunk_index: int = Field(sa_column=Column(Integer, nullable=False))
    content: str = Field(sa_column=Column(Text, nullable=False))
    metadata_json: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON, nullable=True))


class DocumentChunk(DocumentChunkBase, table=True):
    __tablename__ = "document_chunks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )

    # Vector embedding representation (768 dimensions for Google text-embedding-004)
    embedding: Optional[List[float]] = Field(
        default=None,
        sa_column=Column(Vector(768), nullable=True),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    # Relationships
    document: Optional["KnowledgeDocument"] = Relationship(back_populates="chunks")
