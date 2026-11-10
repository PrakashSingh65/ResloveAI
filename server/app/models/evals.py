import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlmodel import Field, SQLModel


class ConversationEvalBase(SQLModel):
    ticket_id: uuid.UUID = Field(
        foreign_key="tickets.id",
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    turn_index: int = Field(sa_column=Column(Integer, nullable=False))
    context_relevance: Optional[float] = Field(default=None)
    groundedness: Optional[float] = Field(default=None)
    answer_relevance: Optional[float] = Field(default=None)
    toxicity_score: Optional[float] = Field(default=None)
    latency_ms: Optional[int] = Field(default=None)
    model_used: str = Field(default="groq-llama-3.3-70b", max_length=100)
    eval_notes: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))


class ConversationEval(ConversationEvalBase, table=True):
    __tablename__ = "conversation_evals"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False, index=True),
    )
