import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.ticket import Ticket


class FeedbackSentiment(str, Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"


class CSATFeedbackBase(SQLModel):
    ticket_id: uuid.UUID = Field(
        foreign_key="tickets.id",
        unique=True,
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    customer_name: str = Field(min_length=1, max_length=150)
    rating: int = Field(sa_column=Column(Integer, nullable=False))  # 1 to 5
    sentiment: FeedbackSentiment = Field(default=FeedbackSentiment.NEUTRAL, index=True)
    comment: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))


class CSATFeedback(CSATFeedbackBase, table=True):
    __tablename__ = "csat_feedbacks"

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

    # Relationships
    ticket: Optional["Ticket"] = Relationship(back_populates="feedback")
