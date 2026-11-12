import { apiClient, API_ROUTES } from "./axios"
import { Ticket, Message, DiagnosticStep, AIBriefing } from "@/components/dashboard/types"

export interface TicketMetrics {
  total_tickets: number
  open_tickets: number
  escalated_tickets: number
  resolved_tickets: number
  ai_resolution_rate: number
  avg_csat_score: number
  avg_handle_time_minutes: number
}

export interface ListTicketsParams {
  status?: string
  priority?: string
  channel?: string
  search?: string
  limit?: number
  offset?: number
}

export interface SendMessagePayload {
  text: string
  sender?: "customer" | "agent" | "ai"
  sender_name?: string
  choices?: string[]
  suggested_replies?: string[]
}

export interface ResolveTicketPayload {
  action_name: string
  notes?: string
}

export interface CSATPayload {
  rating: number
  sentiment?: "Positive" | "Neutral" | "Negative"
  comment?: string
  customer_name?: string
}

function formatTimeAgo(isoString?: string): string {
  if (!isoString) return "Just now"
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return "Just now"
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

export function mapApiTicketToTicket(raw: any): Ticket {
  const conversation: Message[] = (raw.messages || raw.conversation || []).map((m: any) => ({
    id: String(m.id),
    sender: m.sender,
    senderName: m.sender_name || m.senderName,
    text: m.text || m.content || "",
    timestamp: m.created_at
      ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : (m.timestamp || "Just now"),
    thoughts: m.thoughts,
    choices: m.choices,
    suggestedReplies: m.suggested_replies || m.suggestedReplies,
    isHandoffNotice: m.is_handoff_notice || m.isHandoffNotice || false,
    metadata: m.metadata_json || m.metadata,
  }))

  const diagnosticSteps: DiagnosticStep[] = (raw.diagnostic_steps || raw.diagnosticSteps || []).map((d: any) => ({
    stepNumber: d.step_number || d.stepNumber || 1,
    title: d.title || "",
    instruction: d.instruction || "",
    status: d.status || "pending",
    resultNote: d.result_note || d.resultNote,
  }))

  const aiBriefing: AIBriefing = raw.ai_briefing
    ? {
        coreIssue: raw.ai_briefing.core_issue || raw.ai_briefing.coreIssue || "Inquiry under review",
        rootCause: raw.ai_briefing.root_cause || raw.ai_briefing.rootCause || "Diagnostic triage completed",
        attemptedSteps: raw.ai_briefing.attempted_steps || raw.ai_briefing.attemptedSteps || [],
        recommendedAction: raw.ai_briefing.recommended_action || raw.ai_briefing.recommendedAction || "Review account records",
        recommendedActionLabel: raw.ai_briefing.recommended_action_label || raw.ai_briefing.recommendedActionLabel || "Execute Action",
        confidence: typeof raw.ai_briefing.confidence === "number"
          ? (raw.ai_briefing.confidence <= 1 ? Math.round(raw.ai_briefing.confidence * 100) : raw.ai_briefing.confidence)
          : 90,
        urgencyScore: typeof raw.ai_briefing.urgency_score === "number"
          ? (raw.ai_briefing.urgency_score <= 1 ? Math.round(raw.ai_briefing.urgency_score * 100) : raw.ai_briefing.urgency_score)
          : 50,
        sentimentSummary: raw.ai_briefing.sentiment_summary || raw.ai_briefing.sentimentSummary || "Neutral",
      }
    : {
        coreIssue: "Customer inquiry logged in system.",
        rootCause: "Awaiting automated or specialist diagnostic checks.",
        attemptedSteps: ["Initial customer query parsed"],
        recommendedAction: "Review inquiry details and diagnostic logs.",
        recommendedActionLabel: "Authorize Action",
        confidence: 88,
        urgencyScore: 40,
        sentimentSummary: "Neutral",
      }

  return {
    id: String(raw.id),
    ticketNumber: raw.ticket_number || raw.ticketNumber || `TICK-${String(raw.id).slice(0, 4)}`,
    customerName: raw.customer_name || raw.customerName || "Customer",
    customerEmail: raw.customer_email || raw.customerEmail || "",
    customerAvatar: raw.customer_avatar || raw.customerAvatar || (raw.customer_name ? raw.customer_name.slice(0, 2).toUpperCase() : "CU"),
    orderId: raw.order_id || raw.orderId,
    orderAmount: raw.order_amount || raw.orderAmount || "$0.00",
    channel: raw.channel || "Web Chat",
    status: raw.status || "ai_troubleshooting",
    priority: raw.priority || "medium",
    intent: raw.intent || "General Inquiry",
    intentConfidence: typeof raw.intent_confidence === "number"
      ? (raw.intent_confidence <= 1 ? Math.round(raw.intent_confidence * 100) : raw.intent_confidence)
      : (raw.intentConfidence || 85),
    sentiment: raw.sentiment || "neutral",
    sentimentScore: typeof raw.sentiment_score === "number"
      ? (raw.sentiment_score <= 1 ? Math.round(raw.sentiment_score * 100) : raw.sentiment_score)
      : (raw.sentimentScore || 50),
    timeAgo: formatTimeAgo(raw.created_at || raw.createdAt),
    escalatedAgo: raw.escalated_at ? formatTimeAgo(raw.escalated_at) : undefined,
    assignedAgent: raw.assigned_agent_name || raw.assignedAgent,
    conversation,
    diagnosticSteps,
    aiBriefing,
    resolutionDetails: raw.resolution_action
      ? {
          resolvedAt: raw.resolved_at ? new Date(raw.resolved_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently",
          resolvedBy: raw.assigned_agent_name || "Support Specialist",
          actionTaken: raw.resolution_action,
          csatRating: raw.feedback?.rating,
          csatComment: raw.feedback?.comment,
        }
      : raw.resolutionDetails,
  }
}

export const ticketsApi = {
  // 1. Fetch support desk aggregate metrics
  async getMetrics(): Promise<TicketMetrics> {
    const res = await apiClient.get<TicketMetrics>(API_ROUTES.TICKETS.METRICS)
    return res.data
  },

  // 2. List tickets with filters and map to frontend Ticket types
  async listTickets(params?: ListTicketsParams): Promise<Ticket[]> {
    const res = await apiClient.get<any[]>(API_ROUTES.TICKETS.LIST, { params })
    return (res.data || []).map(mapApiTicketToTicket)
  },

  // 2b. Create a new customer ticket
  async createTicket(payload: {
    customer_name: string
    customer_email: string
    order_id?: string
    order_amount?: string
    channel?: string
    initial_message?: string
  }): Promise<Ticket> {
    const res = await apiClient.post<any>(API_ROUTES.TICKETS.LIST, payload)
    return mapApiTicketToTicket(res.data)
  },

  // 3. Get single ticket with full relations mapped
  async getTicket(ticketId: string): Promise<Ticket> {
    const res = await apiClient.get<any>(API_ROUTES.TICKETS.DETAIL(ticketId))
    return mapApiTicketToTicket(res.data)
  },

  // 4. Send message to conversation
  async sendMessage(ticketId: string, payload: SendMessagePayload): Promise<Message> {
    const res = await apiClient.post<any>(API_ROUTES.TICKETS.MESSAGES(ticketId), payload)
    const m = res.data
    return {
      id: String(m.id),
      sender: m.sender,
      senderName: m.sender_name || m.senderName,
      text: m.text || "",
      timestamp: m.created_at
        ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Just now",
      thoughts: m.thoughts,
      choices: m.choices,
      suggestedReplies: m.suggested_replies || m.suggestedReplies,
      isHandoffNotice: m.is_handoff_notice || false,
      metadata: m.metadata_json || m.metadata,
    }
  },

  // 5. Execute 1-click resolution action
  async resolveTicket(ticketId: string, payload: ResolveTicketPayload): Promise<Ticket> {
    const res = await apiClient.post<any>(API_ROUTES.TICKETS.RESOLVE(ticketId), payload)
    return mapApiTicketToTicket(res.data)
  },

  // 5b. Delete a ticket
  async deleteTicket(ticketId: string): Promise<void> {
    await apiClient.delete(API_ROUTES.TICKETS.DETAIL(ticketId))
  },

  // 6. Submit CSAT feedback
  async submitFeedback(ticketId: string, payload: CSATPayload): Promise<any> {
    const res = await apiClient.post(API_ROUTES.TICKETS.FEEDBACK(ticketId), payload)
    return res.data
  },

  // 7. Seed sample tickets on first setup
  async seedSampleTickets(): Promise<{ message: string; seeded: number }> {
    const res = await apiClient.post(API_ROUTES.TICKETS.SEED)
    return res.data
  },
}
