import { Ticket, CSATFeedback } from "./types"

// Live ticket queue starts clean with zero demo tickets.
// Real tickets populate as customer conversations and escalations are received.
export const INITIAL_TICKETS: Ticket[] = []

// Real customer feedback starts clean with zero demo entries.
export const CSAT_FEEDBACK_LIST: CSATFeedback[] = []

export const SIMULATION_TEMPLATES = [
  {
    customerName: "Liam Johnson",
    customerEmail: "liam.j@acmemail.com",
    customerAvatar: "LJ",
    orderId: "#9982-TX",
    orderAmount: "$210.00",
    channel: "Web Chat" as const,
    intent: "Damaged Package on Arrival",
    intentConfidence: 98.7,
    sentiment: "frustrated" as const,
    sentimentScore: 89,
    firstMessage: "The delivery box arrived completely crushed and the glass espresso machine inside is shattered!",
    coreIssue: "Customer received crushed box with shattered glass espresso machine ($210).",
    rootCause: "In-transit impact confirmed by carrier damage report scan #TX-44.",
    recommendedAction: "Execute 1-click replacement dispatch; waive broken item return for customer safety.",
    recommendedActionLabel: "Dispatch Safety Replacement",
  },
  {
    customerName: "Zoe Patel",
    customerEmail: "zoe.p@startup.io",
    customerAvatar: "ZP",
    orderId: "#SUB-8819",
    orderAmount: "$99.00",
    channel: "Web Chat" as const,
    intent: "Annual Plan Accidental Auto-Renew",
    intentConfidence: 97.9,
    sentiment: "urgent" as const,
    sentimentScore: 73,
    firstMessage: "I intended to cancel our plan before the annual renewal processed yesterday. Can you please refund the annual charge?",
    coreIssue: "Customer requests refund for un-cancelled annual plan within 24h grace window.",
    rootCause: "Annual recurring renewal triggered automatically; zero API usage detected post-renewal.",
    recommendedAction: "Issue full $99 refund and downgrade seat to free tier.",
    recommendedActionLabel: "Execute Grace Refund ($99)",
  },
]
