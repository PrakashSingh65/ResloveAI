import logging
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db, get_optional_current_user
from app.models.briefing import AIBriefing
from app.models.diagnostic import DiagnosticStep, StepStatus
from app.models.ticket import (
    Channel,
    CustomerSentiment,
    Ticket,
    TicketPriority,
    TicketStatus,
)
from app.models.user import User
from app.schemas.ticket import (
    CSATFeedbackCreate,
    CSATFeedbackSchema,
    MessageCreate,
    MessageSchema,
    TicketCreate,
    TicketDetailResponse,
    TicketMetricsResponse,
    TicketResolutionRequest,
    TicketSummaryResponse,
    TicketUpdate,
)
from app.services.ticket_service import TicketService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/metrics",
    response_model=TicketMetricsResponse,
    summary="Get aggregated support desk metrics",
)
async def get_desk_metrics(db: AsyncSession = Depends(get_db)):
    metrics = await TicketService.get_metrics(db)
    return metrics


@router.get(
    "",
    response_model=List[TicketSummaryResponse],
    summary="List support tickets with filters",
)
async def list_tickets(
    status: Optional[TicketStatus] = Query(None, description="Filter by ticket status"),
    priority: Optional[TicketPriority] = Query(None, description="Filter by ticket priority"),
    channel: Optional[Channel] = Query(None, description="Filter by intake channel"),
    search: Optional[str] = Query(None, description="Search by customer, ticket #, order ID or intent"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    tickets = await TicketService.list_tickets(
        db=db,
        status_filter=status,
        priority_filter=priority,
        channel_filter=channel,
        search_query=search,
        limit=limit,
        offset=offset,
    )
    return tickets


@router.get(
    "/{ticket_id}",
    response_model=TicketDetailResponse,
    summary="Get detailed ticket context",
)
async def get_ticket_detail(
    ticket_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    ticket = await TicketService.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a support ticket",
)
async def delete_ticket(
    ticket_id: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        parsed_uuid = uuid.UUID(ticket_id)
        await TicketService.delete_ticket(db, parsed_uuid)
    except (ValueError, TypeError):
        pass
    return None


@router.post(
    "",
    response_model=TicketDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new support ticket",
)
async def create_ticket(
    payload: TicketCreate,
    db: AsyncSession = Depends(get_db),
):
    ticket = await TicketService.create_ticket(db, payload)
    return ticket


@router.patch(
    "/{ticket_id}",
    response_model=TicketSummaryResponse,
    summary="Update ticket metadata or assignment",
)
async def update_ticket(
    ticket_id: uuid.UUID,
    payload: TicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    ticket = await TicketService.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    if payload.status is not None:
        ticket.status = payload.status
    if payload.priority is not None:
        ticket.priority = payload.priority
    if payload.intent is not None:
        ticket.intent = payload.intent
    if payload.sentiment is not None:
        ticket.sentiment = payload.sentiment
    if payload.assigned_agent_id is not None:
        ticket.assigned_agent_id = payload.assigned_agent_id
    if payload.assigned_agent_name is not None:
        ticket.assigned_agent_name = payload.assigned_agent_name
    elif current_user and payload.assigned_agent_id == current_user.id:
        ticket.assigned_agent_name = f"{current_user.first_name} {current_user.last_name}"
    if payload.resolution_action is not None:
        ticket.resolution_action = payload.resolution_action

    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.post(
    "/{ticket_id}/messages",
    response_model=MessageSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Send a message to a ticket conversation",
)
async def send_ticket_message(
    ticket_id: uuid.UUID,
    payload: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    ticket = await TicketService.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    # If sender is human agent
    if payload.sender.value == "agent":
        agent_name = (
            payload.sender_name
            or (f"{current_user.first_name} {current_user.last_name}" if current_user else "Support Specialist")
        )
        msg = await TicketService.add_human_agent_message(db, ticket, payload.text, agent_name)
        return msg

    # Customer message: processes AI workflow
    customer_msg, ai_reply = await TicketService.process_customer_message(db, ticket, payload.text)
    return ai_reply or customer_msg


@router.post(
    "/{ticket_id}/resolve",
    response_model=TicketDetailResponse,
    summary="Execute 1-click resolution action",
)
async def resolve_ticket(
    ticket_id: uuid.UUID,
    payload: TicketResolutionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    ticket = await TicketService.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    resolver = f"{current_user.first_name} {current_user.last_name}" if current_user else "Support Specialist"
    resolved_ticket = await TicketService.resolve_ticket(db, ticket, payload, resolved_by=resolver)
    return resolved_ticket


@router.post(
    "/{ticket_id}/feedback",
    response_model=CSATFeedbackSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Submit post-resolution customer CSAT feedback",
)
async def submit_csat_feedback(
    ticket_id: uuid.UUID,
    payload: CSATFeedbackCreate,
    db: AsyncSession = Depends(get_db),
):
    ticket = await TicketService.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    feedback = await TicketService.submit_feedback(db, ticket, payload)
    return feedback


@router.post(
    "/seed-sample",
    summary="Seed sample tickets for demonstration",
)
async def seed_sample_tickets(db: AsyncSession = Depends(get_db)):
    """Seeds initial sample tickets with diagnostic trees and briefings."""
    existing = await TicketService.list_tickets(db, limit=1)
    if existing:
        return {"message": "Tickets already exist", "seeded": 0}

    # Seed 1: Escalated Lost in Transit
    t1 = await TicketService.create_ticket(
        db,
        TicketCreate(
            customer_name="Marcus Vance",
            customer_email="m.vance@acme-corp.io",
            order_id="ORD-9482",
            order_amount="$1,420.00",
            channel=Channel.WEB_CHAT,
            initial_message="Where is my shipment ORD-9482? Tracking has not moved for 4 days and my client presentation is tomorrow!",
        ),
    )
    t1.ticket_number = "TICK-1042"
    t1.status = TicketStatus.ESCALATED
    t1.priority = TicketPriority.URGENT
    t1.intent = "Lost In Transit"
    t1.intent_confidence = 0.94
    t1.sentiment = CustomerSentiment.FRUSTRATED
    t1.sentiment_score = 0.88
    t1.urgency_score = 0.92

    # Add Diagnostic Steps
    db.add(DiagnosticStep(ticket_id=t1.id, step_number=1, title="Carrier API Webhook Query", instruction="Poll carrier gateway for recent telemetry scans", status=StepStatus.COMPLETED, result_note="Confirmed stuck at Memphis Hub for 98h"))
    db.add(DiagnosticStep(ticket_id=t1.id, step_number=2, title="Depot Exception Verification", instruction="Verify sorting facility automated alert code", status=StepStatus.FAILED, result_note="Station Code 404 - Pallet tag missing"))
    db.add(DiagnosticStep(ticket_id=t1.id, step_number=3, title="Carrier Escalation Ping", instruction="Open urgent carrier investigation ticket", status=StepStatus.PENDING))

    # Add AI Briefing
    db.add(AIBriefing(
        ticket_id=t1.id,
        core_issue="Customer ordered enterprise server chassis; shipment stalled in Memphis hub for 98 hours with no departure scan.",
        root_cause="Carrier hub automated sorting jam resulted in lost secondary routing slip. Physical pallet cannot be located in current cycle.",
        attempted_steps=["FedEx Carrier Gateway Telemetry Polled", "Depot Exception Alert 404 Triggered", "Automated Tracer Ping Initiated"],
        recommended_action="Execute 1-click priority inventory replacement dispatch from Chicago warehouse via Next-Day Air.",
        recommended_action_label="Dispatch Replacement",
        confidence=0.96,
        urgency_score=0.94,
        sentiment_summary="Frustrated - Customer SLA breached; mission critical business delivery.",
    ))

    # Seed 2: Hardware failure AI troubleshooting
    t2 = await TicketService.create_ticket(
        db,
        TicketCreate(
            customer_name="Elena Rostova",
            customer_email="elena.r@designcraft.co",
            order_id="ORD-8812",
            order_amount="$890.00",
            channel=Channel.MOBILE_APP,
            initial_message="My Pro Display 4K screen flickers violently with green lines every time I connect Thunderbolt.",
        ),
    )
    t2.ticket_number = "TICK-1039"
    t2.status = TicketStatus.AI_TROUBLESHOOTING
    t2.priority = TicketPriority.HIGH
    t2.intent = "Hardware Failure"
    t2.intent_confidence = 0.91
    t2.sentiment = CustomerSentiment.URGENT
    t2.sentiment_score = 0.65
    t2.urgency_score = 0.70

    db.add(DiagnosticStep(ticket_id=t2.id, step_number=1, title="Firmware Revision Check", instruction="Inspect driver version v2.4.1 compliance", status=StepStatus.COMPLETED, result_note="Driver updated to latest release"))
    db.add(DiagnosticStep(ticket_id=t2.id, step_number=2, title="Cable Integrity Signal Test", instruction="Test with certified 40Gbps Thunderbolt cable", status=StepStatus.IN_PROGRESS))
    db.add(DiagnosticStep(ticket_id=t2.id, step_number=3, title="Display Panel RMA Verification", instruction="Authorize replacement if green lines persist", status=StepStatus.PENDING))

    await db.commit()
    return {"message": "Sample tickets seeded successfully", "seeded": 2}
