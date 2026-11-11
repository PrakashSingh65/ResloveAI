import { Ticket, RAGDocument, CSATFeedback, TroubleshootingFlowNode } from "./types"

// Live ticket queue starts clean with zero demo tickets.
// Real tickets populate as customer conversations and escalations are received.
export const INITIAL_TICKETS: Ticket[] = []

export const RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: "rag-1",
    title: "Carrier_SOP_2026_Missing_Parcels.pdf",
    category: "Logistics",
    chunksCount: 420,
    similarityScore: 0.98,
    lastUpdated: "2026-11-04",
    tags: ["FedEx", "UPS", "Safe Drop", "Misdelivery", "GPS Protocol"],
    fileSize: "2.4 MB",
    sampleSnippet:
      "Clause 4.1.2: Misdelivered parcel verification. When GPS coordinates indicate parcel drop at neighboring thresholds (within 10-25m), guide customer to verify adjacent doorsteps. If unresolved within 1 attempt, auto-escalate for replacement.",
  },
  {
    id: "rag-2",
    title: "Global_Billing_Disputes_Refund_SLA.pdf",
    category: "Billing",
    chunksCount: 185,
    similarityScore: 0.99,
    lastUpdated: "2026-11-01",
    tags: ["Refunds", "Stripe", "Double Charge", "Chargebacks", "Proration"],
    fileSize: "680 KB",
    sampleSnippet:
      "Section 3.2: Duplicate payment gateway authorizations occurring inside 60-second windows due to idempotent network retries are eligible for instantaneous automated void.",
  },
  {
    id: "rag-3",
    title: "Warehouse_Fulfillment_Exceptions.pdf",
    category: "Product",
    chunksCount: 310,
    similarityScore: 0.93,
    lastUpdated: "2026-10-28",
    tags: ["SKU Mismatch", "Wrong Item", "Barcode Scans", "Reshipment"],
    fileSize: "1.8 MB",
    sampleSnippet:
      "Section 2.3: Wrong SKU dispatch. If warehouse optical verification logs show incorrect color/size code pick, prioritize expedited replacement dispatch with complimentary return label.",
  },
  {
    id: "rag-4",
    title: "Developer_API_RateLimits_v4.md",
    category: "Security",
    chunksCount: 220,
    similarityScore: 0.95,
    lastUpdated: "2026-11-08",
    tags: ["429 Errors", "Rate Limits", "Burst Allowance", "Webhooks"],
    fileSize: "940 KB",
    sampleSnippet:
      "Section 7.4: Automated Launch Bursts. Pro Tier accounts experiencing unexpected traffic spikes can be granted automated temporary +50 req/min burst limits for up to 24 hours.",
  },
  {
    id: "rag-5",
    title: "Customer_Self_Service_SOP.md",
    category: "Logistics",
    chunksCount: 285,
    similarityScore: 0.91,
    lastUpdated: "2026-11-02",
    tags: ["Self-Troubleshooting", "Step-by-Step", "Concierge", "Mailboxes"],
    fileSize: "1.1 MB",
    sampleSnippet:
      "Diagnostic Rule 1.1: Multi-step verification flows must always present clear, non-technical actions (e.g. check locker, verify porch) before issuing claims.",
  },
]

// Real customer feedback starts clean with zero demo entries.
export const CSAT_FEEDBACK_LIST: CSATFeedback[] = []

export const TROUBLESHOOTING_NODES: TroubleshootingFlowNode[] = [
  {
    id: "node-1",
    title: "1. LLM Ingestion & Semantic Parsing",
    description: "Customer query ingested and normalized through LLM intent parser.",
    type: "start",
    successRate: "99.8%",
    avgTime: "0.2s",
    isAutomated: true,
  },
  {
    id: "node-2",
    title: "2. Intent & Sentiment Classification",
    description: "Classified as Order Delivery Issue (99.4%) with Frustration Score of 84/100.",
    type: "analysis",
    successRate: "99.4%",
    avgTime: "0.3s",
    isAutomated: true,
  },
  {
    id: "node-3",
    title: "3. RAG Knowledge Base Retrieval",
    description: "Vector search queries Carrier SOP Clause 4.1.2 & proof-of-delivery GPS coordinates.",
    type: "rag",
    successRate: "98.6%",
    avgTime: "0.3s",
    isAutomated: true,
  },
  {
    id: "node-4",
    title: "4. Smart Guided Troubleshooting",
    description: "Interactive guidance: customer checks rear patio and adjacent unit 14B.",
    type: "check",
    successRate: "72.4%",
    avgTime: "1m 10s",
    isAutomated: true,
  },
  {
    id: "node-5",
    title: "5. Escalation Trigger Evaluation",
    description: "Physical inspection negative + GPS deviation >15m triggers automated escalation threshold.",
    type: "escalation",
    successRate: "100%",
    avgTime: "0.1s",
    isAutomated: true,
  },
  {
    id: "node-6",
    title: "6. Zero-Context Human Handoff",
    description: "Generates Ticket #RES-8924, pre-populates briefing, and routes to human operator Sarah.",
    type: "action",
    successRate: "100%",
    avgTime: "0.4s",
    isAutomated: true,
  },
  {
    id: "node-7",
    title: "7. 1-Click Resolution & CSAT",
    description: "Human agent executes 1-click replacement order; CSAT 5-star survey delivered.",
    type: "resolution",
    successRate: "96.8%",
    avgTime: "30s",
    isAutomated: false,
  },
]

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
    docName: "Carrier_Damaged_Goods_SOP.pdf",
    docType: "Carrier SOP" as const,
    docSnippet: "Clause 3.1: Catastrophic in-transit damage with customer photo upload qualifies for immediate priority re-order authorization without requiring customer to return hazardous broken glass.",
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
    docName: "Subscription_Cancellation_Grace_Policy.pdf",
    docType: "Policy Guide" as const,
    docSnippet: "Section 5.2: 48-hour accidental renewal grace window allows full 100% refund if zero team member activity occurred post-renewal.",
    coreIssue: "Customer requests refund for un-cancelled annual plan within 24h grace window.",
    rootCause: "Annual recurring renewal triggered automatically; zero API usage detected post-renewal.",
    recommendedAction: "Issue full $99 refund and downgrade seat to free tier.",
    recommendedActionLabel: "Execute Grace Refund ($99)",
  },
]
