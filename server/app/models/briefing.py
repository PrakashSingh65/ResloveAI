import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, Float, JSON, String, Text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.ticket import Ticket


class AIBriefingBase(SQLModel):
    ticket_id: uuid.UUID = Field(
        foreign_key="tickets.id",
        unique=True,
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    core_issue: str = Field(sa_column=Column(Text, nullable=False))
    root_cause: str = Field(sa_column=Column(Text, nullable=False))
    attempted_steps: List[str] = Field(default=[], sa_column=Column(JSON, nullable=False))
    recommended_action: str = Field(sa_column=Column(Text, nullable=False))
    recommended_action_label: str = Field(default="Execute Action", max_length=100)
    confidence: float = Field(default=0.85)
    urgency_score: float = Field(default=0.5)
    sentiment_summary: str = Field(default="Neutral", max_length=100)


class AIBriefing(AIBriefingBase, table=True):
    __tablename__ = "ai_briefings"

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
    ticket: Optional["Ticket"] = Relationship(back_populates="ai_briefing")
