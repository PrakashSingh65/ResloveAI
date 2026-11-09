import uuid
from datetime import date, datetime, timezone
from enum import Enum
from typing import List, Optional

from sqlalchemy import Column, DateTime, String
from sqlmodel import Field, Relationship, SQLModel


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class UserBase(SQLModel):
    first_name: str = Field(min_length=1, max_length=100, index=True)
    last_name: str = Field(min_length=1, max_length=100, index=True)
    email: str = Field(
        sa_column=Column(String(255), unique=True, index=True, nullable=False)
    )
    date_of_birth: Optional[date] = Field(default=None)
    country: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    phone_no: Optional[str] = Field(default=None, max_length=30, index=True)
    gender: Optional[Gender] = Field(default=None)
    is_active: bool = Field(default=True, index=True)
    is_verified: bool = Field(default=False)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    password_hash: str = Field(nullable=False)

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
    refresh_tokens: List["RefreshToken"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "selectin"},
    )


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    token_hash: str = Field(
        sa_column=Column(String(64), unique=True, index=True, nullable=False)
    )
    jti: str = Field(
        sa_column=Column(String(64), unique=True, index=True, nullable=False)
    )
    expires_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), index=True, nullable=False)
    )
    revoked: bool = Field(default=False, index=True)
    revoked_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    replaced_by: Optional[str] = Field(
        default=None,
        sa_column=Column(String(64), nullable=True),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    user_agent: Optional[str] = Field(default=None, max_length=500)
    ip_address: Optional[str] = Field(default=None, max_length=45)

    # Relationship
    user: Optional[User] = Relationship(back_populates="refresh_tokens")
