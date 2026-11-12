export type TicketStatus = "escalated" | "ai_troubleshooting" | "pending_user" | "resolved"
export type TicketPriority = "urgent" | "high" | "medium" | "low"
export type CustomerSentiment = "frustrated" | "urgent" | "neutral" | "satisfied"

export interface Message {
  id: string
  sender: "customer" | "ai" | "agent" | "system"
  senderName?: string
  text: string
  timestamp: string
  thoughts?: string
  choices?: string[]
  isHandoffNotice?: boolean
  suggestedReplies?: string[]
  metadata?: {
    confidence?: string
    actionTaken?: string
  }
}

export interface DiagnosticStep {
  stepNumber: number
  title: string
  instruction: string
  status: "completed" | "failed" | "in_progress" | "pending"
  resultNote?: string
}

export interface AIBriefing {
  coreIssue: string
  rootCause: string
  attemptedSteps: string[]
  recommendedAction: string
  recommendedActionLabel: string
  confidence: number
  urgencyScore: number
  sentimentSummary: string
}

export interface ResolutionDetails {
  resolvedAt: string
  resolvedBy: string
  actionTaken: string
  csatRating?: number
  csatComment?: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  customerName: string
  customerEmail: string
  customerAvatar: string
  orderId?: string
  orderAmount?: string
  channel: "Web Chat" | "WhatsApp" | "Email" | "Mobile App"
  status: TicketStatus
  priority: TicketPriority
  intent: string
  intentConfidence: number
  sentiment: CustomerSentiment
  sentimentScore: number
  timeAgo: string
  escalatedAgo?: string
  assignedAgent?: string
  conversation: Message[]
  diagnosticSteps: DiagnosticStep[]
  aiBriefing: AIBriefing
  resolutionDetails?: ResolutionDetails
}

export interface CSATFeedback {
  id: string
  ticketId: string
  customerName: string
  rating: number
  sentiment: "Positive" | "Neutral" | "Negative"
  comment: string
  timestamp: string
  category: string
  humanAgent: string
}
