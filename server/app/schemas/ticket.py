import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models.diagnostic import StepStatus
from app.models.feedback import FeedbackSentiment
from app.models.message import MessageSender
from app.models.ticket import Channel, CustomerSentiment, TicketPriority, TicketStatus


class MessageSchema(BaseModel):
    id: uuid.UUID
    ticket_id: uuid.UUID
    sender: MessageSender
    sender_name: Optional[str] = None
    text: str
    thoughts: Optional[str] = None
    choices: Optional[List[str]] = None
    suggested_replies: Optional[List[str]] = None
    metadata_json: Optional[Dict[str, Any]] = None
    is_handoff_notice: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageCreate(BaseModel):
    text: str = Field(min_length=1)
    sender: MessageSender = Field(default=MessageSender.CUSTOMER)
    sender_name: Optional[str] = None
    choices: Optional[List[str]] = None
    suggested_replies: Optional[List[str]] = None
    metadata_json: Optional[Dict[str, Any]] = None


class DiagnosticStepSchema(BaseModel):
    id: uuid.UUID
    step_number: int
    title: str
    instruction: str
    status: StepStatus
    result_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DiagnosticStepCreate(BaseModel):
    step_number: int
    title: str
    instruction: str
    status: StepStatus = StepStatus.PENDING
    result_note: Optional[str] = None


class DiagnosticStepUpdate(BaseModel):
    status: Optional[StepStatus] = None
    result_note: Optional[str] = None


class AIBriefingSchema(BaseModel):
    id: uuid.UUID
    core_issue: str
    root_cause: str
    attempted_steps: List[str]
    recommended_action: str
    recommended_action_label: str
    confidence: float
    urgency_score: float
    sentiment_summary: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIBriefingCreate(BaseModel):
    core_issue: str
    root_cause: str
    attempted_steps: List[str] = []
    recommended_action: str
    recommended_action_label: str = "Execute Action"
    confidence: float = 0.85
    urgency_score: float = 0.5
    sentiment_summary: str = "Neutral"


class CSATFeedbackSchema(BaseModel):
    id: uuid.UUID
    ticket_id: uuid.UUID
    customer_name: str
    rating: int
    sentiment: FeedbackSentiment
    comment: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CSATFeedbackCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    customer_name: Optional[str] = "Customer"
    sentiment: FeedbackSentiment = FeedbackSentiment.NEUTRAL
    comment: Optional[str] = None


class TicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_avatar: Optional[str] = None
    order_id: Optional[str] = None
    order_amount: Optional[str] = None
    channel: Channel = Channel.WEB_CHAT
    initial_message: Optional[str] = None


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    intent: Optional[str] = None
    sentiment: Optional[CustomerSentiment] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    assigned_agent_name: Optional[str] = None
    resolution_action: Optional[str] = None


class TicketResolutionRequest(BaseModel):
    action_name: str
    notes: Optional[str] = None


class TicketSummaryResponse(BaseModel):
    id: uuid.UUID
    ticket_number: str
    customer_name: str
    customer_email: str
    customer_avatar: Optional[str] = None
    order_id: Optional[str] = None
    order_amount: Optional[str] = None
    channel: Channel
    status: TicketStatus
    priority: TicketPriority
    intent: Optional[str] = None
    intent_confidence: Optional[float] = 0.0
    sentiment: CustomerSentiment
    sentiment_score: float
    urgency_score: float
    assigned_agent_id: Optional[uuid.UUID] = None
    assigned_agent_name: Optional[str] = None
    resolution_action: Optional[str] = None
    escalated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketDetailResponse(TicketSummaryResponse):
    messages: List[MessageSchema] = []
    diagnostic_steps: List[DiagnosticStepSchema] = []
    ai_briefing: Optional[AIBriefingSchema] = None
    feedback: Optional[CSATFeedbackSchema] = None

    model_config = ConfigDict(from_attributes=True)


class TicketMetricsResponse(BaseModel):
    total_tickets: int
    open_tickets: int
    escalated_tickets: int
    resolved_tickets: int
    ai_resolution_rate: float
    avg_csat_score: float
    avg_handle_time_minutes: float
