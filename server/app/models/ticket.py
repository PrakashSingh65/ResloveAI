import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, Integer, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.briefing import AIBriefing
    from app.models.diagnostic import DiagnosticStep
    from app.models.feedback import CSATFeedback
    from app.models.message import Message


class TicketStatus(str, Enum):
    OPEN = "open"
    AI_TROUBLESHOOTING = "ai_troubleshooting"
    PENDING_USER = "pending_user"
    ESCALATED = "escalated"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Channel(str, Enum):
    WEB_CHAT = "Web Chat"
    WHATSAPP = "WhatsApp"
    EMAIL = "Email"
    MOBILE_APP = "Mobile App"


class CustomerSentiment(str, Enum):
    SATISFIED = "satisfied"
    NEUTRAL = "neutral"
    URGENT = "urgent"
    FRUSTRATED = "frustrated"


class TicketBase(SQLModel):
    ticket_number: str = Field(
        sa_column=Column(String(50), unique=True, index=True, nullable=False)
    )
    customer_name: str = Field(min_length=1, max_length=150, index=True)
    customer_email: str = Field(
        sa_column=Column(String(255), index=True, nullable=False)
    )
    customer_avatar: Optional[str] = Field(default=None, max_length=500)
    order_id: Optional[str] = Field(default=None, max_length=100, index=True)
    order_amount: Optional[str] = Field(default=None, max_length=50)
    channel: Channel = Field(default=Channel.WEB_CHAT, index=True)
    status: TicketStatus = Field(default=TicketStatus.AI_TROUBLESHOOTING, index=True)
    priority: TicketPriority = Field(default=TicketPriority.MEDIUM, index=True)
    intent: Optional[str] = Field(default=None, max_length=100, index=True)
    intent_confidence: Optional[float] = Field(default=0.0)
    sentiment: CustomerSentiment = Field(default=CustomerSentiment.NEUTRAL, index=True)
    sentiment_score: float = Field(default=0.5)
    urgency_score: float = Field(default=0.3)
    assigned_agent_id: Optional[uuid.UUID] = Field(
        default=None,
        foreign_key="users.id",
        nullable=True,
        index=True,
    )
    assigned_agent_name: Optional[str] = Field(default=None, max_length=150)
    resolution_action: Optional[str] = Field(default=None, max_length=255)


class Ticket(TicketBase, table=True):
    __tablename__ = "tickets"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )

    escalated_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    resolved_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False, index=True),
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
    messages: List["Message"] = Relationship(
        back_populates="ticket",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "order_by": "Message.created_at",
            "lazy": "selectin",
        },
    )
    diagnostic_steps: List["DiagnosticStep"] = Relationship(
        back_populates="ticket",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "order_by": "DiagnosticStep.step_number",
            "lazy": "selectin",
        },
    )
    ai_briefing: Optional["AIBriefing"] = Relationship(
        back_populates="ticket",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "uselist": False,
            "lazy": "selectin",
        },
    )
    feedback: Optional["CSATFeedback"] = Relationship(
        back_populates="ticket",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "uselist": False,
            "lazy": "selectin",
        },
    )
