import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.ticket import Ticket


class StepStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class DiagnosticStepBase(SQLModel):
    ticket_id: uuid.UUID = Field(
        foreign_key="tickets.id",
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    step_number: int = Field(sa_column=Column(Integer, nullable=False))
    title: str = Field(min_length=1, max_length=255)
    instruction: str = Field(sa_column=Column(Text, nullable=False))
    status: StepStatus = Field(default=StepStatus.PENDING, index=True)
    result_note: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))


class DiagnosticStep(DiagnosticStepBase, table=True):
    __tablename__ = "diagnostic_steps"

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
    ticket: Optional["Ticket"] = Relationship(back_populates="diagnostic_steps")
