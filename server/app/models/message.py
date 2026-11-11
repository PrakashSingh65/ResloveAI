import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import Column, DateTime, JSON, String, Text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.ticket import Ticket


class MessageSender(str, Enum):
    CUSTOMER = "customer"
    AI = "ai"
    AGENT = "agent"
    SYSTEM = "system"


class MessageBase(SQLModel):
    ticket_id: uuid.UUID = Field(
        foreign_key="tickets.id",
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    sender: MessageSender = Field(default=MessageSender.CUSTOMER, index=True)
    sender_name: Optional[str] = Field(default=None, max_length=150)
    text: str = Field(sa_column=Column(Text, nullable=False))
    thoughts: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    choices: Optional[List[str]] = Field(default=None, sa_column=Column(JSON, nullable=True))
    suggested_replies: Optional[List[str]] = Field(default=None, sa_column=Column(JSON, nullable=True))
    metadata_json: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON, nullable=True))
    is_handoff_notice: bool = Field(default=False)


class Message(MessageBase, table=True):
    __tablename__ = "messages"

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
    ticket: Optional["Ticket"] = Relationship(back_populates="messages")
