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
    ragDoc?: string
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

export interface RAGCitation {
  docName: string
  docType: "Carrier SOP" | "Policy Guide" | "API Specs" | "Knowledge Base"
  similarityScore: number
  clauseNumber: string
  snippet: string
  sourceUrl?: string
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
  ragCitation: RAGCitation
  aiBriefing: AIBriefing
  resolutionDetails?: ResolutionDetails
}

export interface RAGDocument {
  id: string
  title: string
  category: "Logistics" | "Billing" | "Product" | "Security"
  chunksCount: number
  similarityScore: number
  lastUpdated: string
  tags: string[]
  sampleSnippet: string
  fileSize: string
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

export interface TroubleshootingFlowNode {
  id: string
  title: string
  description: string
  type: "start" | "analysis" | "rag" | "action" | "check" | "escalation" | "resolution"
  successRate: string
  avgTime: string
  isAutomated: boolean
}
