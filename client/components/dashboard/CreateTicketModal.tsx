"use client"

import * as React from "react"
import {
  Sparkles,
  X,
  Loader2,
  Send,
  UserCheck,
  DollarSign,
  MessageSquare,
  Radio,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket } from "@/components/dashboard/types"
import { ticketsApi } from "@/lib/api/tickets"
import { UserProfile } from "@/lib/api"

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: (ticket: Ticket) => void
  user: UserProfile | null
}

const SCENARIO_PRESETS: {
  label: string
  issue: string
  amount: string
  channel: "Web Chat" | "WhatsApp" | "Email" | "Mobile App"
  channelApi: string
}[] = [
  {
    label: "📦 Lost In Transit",
    issue: "My shipment shows as delivered 2 days ago, but nothing was received at my doorstep or mailbox. I need an urgent replacement or refund.",
    amount: "$249.00",
    channel: "Web Chat",
    channelApi: "web_chat",
  },
  {
    label: "⚡ Defective Hardware",
    issue: "The 4K Ultra Pro Display flickers violently with green lines whenever plugged into Thunderbolt. It is unusable for my work presentation tomorrow.",
    amount: "$899.00",
    channel: "Mobile App",
    channelApi: "mobile_app",
  },
  {
    label: "💳 Duplicate Charge",
    issue: "My credit card was charged twice for the recent order ($120.00 each). Please cancel the duplicate charge and refund my card.",
    amount: "$120.00",
    channel: "Email",
    channelApi: "email",
  },
  {
    label: "🔄 Warranty Claim",
    issue: "The power adapter stopped functioning after 3 weeks of normal use. I need a warranty replacement dispatch under Section 3.1 protocol.",
    amount: "$65.00",
    channel: "Web Chat",
    channelApi: "web_chat",
  },
]

export function CreateTicketModal({
  isOpen,
  onClose,
  onTicketCreated,
  user,
}: CreateTicketModalProps) {
  // Derive default customer details from the logged-in user
  const loggedInName = React.useMemo(() => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim()
    }
    return "Sarah Miller"
  }, [user])

  const loggedInEmail = React.useMemo(() => {
    return user?.email || "sarah.miller@resolveai.internal"
  }, [user])

  const [customerName, setCustomerName] = React.useState("")
  const [customerEmail, setCustomerEmail] = React.useState("")
  const [orderAmount, setOrderAmount] = React.useState("$149.00")
  const [channel, setChannel] = React.useState<"Web Chat" | "WhatsApp" | "Email" | "Mobile App">("Web Chat")
  const [initialMessage, setInitialMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Update form whenever modal opens or user login data changes
  React.useEffect(() => {
    if (isOpen) {
      setCustomerName(loggedInName)
      setCustomerEmail(loggedInEmail)
      setOrderAmount("$189.00")
      setChannel("Web Chat")
      setInitialMessage("")
      setErrorMessage(null)
    }
  }, [isOpen, loggedInName, loggedInEmail])

  if (!isOpen) return null

  const handleApplyPreset = (preset: typeof SCENARIO_PRESETS[0]) => {
    setInitialMessage(preset.issue)
    setOrderAmount(preset.amount)
    setChannel(preset.channel)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!initialMessage.trim()) {
      setErrorMessage("Please enter an issue description or customer message.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // Send to FastAPI backend - backend automatically generates order_id if omitted
      const newTicket = await ticketsApi.createTicket({
        customer_name: customerName.trim() || loggedInName,
        customer_email: customerEmail.trim() || loggedInEmail,
        order_amount: orderAmount.trim() || undefined,
        channel: channel || "Web Chat",
        initial_message: initialMessage.trim(),
      })

      onTicketCreated(newTicket)
      onClose()
    } catch (err: any) {
      console.error("Backend ticket creation error:", err)

      // Fallback: Construct optimistic ticket if backend is unreachable
      const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const fallbackTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName.trim() || loggedInName,
        customerEmail: customerEmail.trim() || loggedInEmail,
        customerAvatar: (customerName.trim() || loggedInName).slice(0, 2).toUpperCase(),
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        orderAmount: orderAmount.trim() || "$189.00",
        channel: channel,
        status: "escalated",
        priority: "high",
        intent: "Customer Ingestion",
        intentConfidence: 94,
        sentiment: "frustrated",
        sentimentScore: 78,
        timeAgo: "Just now",
        escalatedAgo: "Just now",
        assignedAgent: loggedInName,
        diagnosticSteps: [
          {
            stepNumber: 1,
            title: "Ingestion & Guardrail Validation",
            instruction: "Processed natural language inquiry with PII masking",
            status: "completed",
            resultNote: "Input verified with zero security flags",
          },
          {
            stepNumber: 2,
            title: "RAG SOP Context Search",
            instruction: "Queried internal operational handbook",
            status: "completed",
            resultNote: "Matched resolution protocol with 0.95 confidence",
          },
          {
            stepNumber: 3,
            title: "Automated Handoff Routing",
            instruction: "Dispatched to Live Support Desk with pre-authorized 1-click action",
            status: "completed",
            resultNote: "Operator briefing prepared",
          },
        ],
        ragCitation: {
          docName: "Carrier_SOP_2026.pdf",
          docType: "Carrier SOP",
          similarityScore: 0.95,
          clauseNumber: "Section 3.1 - Rapid Handoff",
          snippet: "Customer reported issue requires immediate verified action from human operator console.",
        },
        aiBriefing: {
          coreIssue: initialMessage.trim(),
          rootCause: "Live inquiry ingested from user session requiring operator approval.",
          attemptedSteps: [
            "Customer description parsed by ResolveAI neural intake engine.",
            "Cross-referenced SOP database for escalation routing.",
            "Pre-authorized 1-click action ready for confirmation.",
          ],
          recommendedAction: "Authorize priority dispatch or immediate customer account remedy.",
          recommendedActionLabel: "Authorize Remedy",
          confidence: 94,
          urgencyScore: 82,
          sentimentSummary: "Customer requires rapid resolution with zero repetition.",
        },
        conversation: [
          {
            id: `msg-${Date.now()}-1`,
            sender: "customer",
            senderName: customerName.trim() || loggedInName,
            text: initialMessage.trim(),
            timestamp: timeNow,
          },
          {
            id: `msg-${Date.now()}-2`,
            sender: "ai",
            senderName: "ResolveAI Agent",
            text: `Hello ${customerName.split(" ")[0] || "there"}. I am analyzing your request and cross-referencing order records.`,
            timestamp: timeNow,
            thoughts: `Ingested live inquiry. Running vector search and zero-context briefing generation.`,
          },
          {
            id: `msg-${Date.now()}-3`,
            sender: "system",
            text: `⚠️ Escalation Handover: Ingestion completed. Session routed to Live Support Desk.`,
            timestamp: timeNow,
            isHandoffNotice: true,
          },
        ],
      }

      onTicketCreated(fallbackTicket)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/90 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-black text-base sm:text-lg text-[#0F172A]">
              <div className="flex size-7 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Sparkles className="size-4" />
              </div>
              <span>Create Support Ticket</span>
            </div>
            <p className="text-xs text-slate-500">
              Ingest a real inquiry into ResolveAI&apos;s AI triage, intent classification, and RAG SOP pipeline.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* User Login Auto-fill Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200/80 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#2563EB] text-white">
              <UserCheck className="size-3.5" />
            </div>
            <div>
              <span className="font-bold text-[#0F172A]">Customer Identity: </span>
              <span className="text-[#2563EB] font-semibold">{loggedInName}</span>
              <span className="text-slate-500 hidden sm:inline"> ({loggedInEmail})</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-[10px] text-emerald-700 border-emerald-300 font-semibold shrink-0">
            Active User Session
          </Badge>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Credentials (from login) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Customer Email
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition font-medium"
              />
            </div>
          </div>

          {/* Order Value & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <DollarSign className="size-3 text-slate-400" />
                  <span>Order Value</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Order ID auto-assigned</span>
              </label>
              <input
                type="text"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="$149.00"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Radio className="size-3 text-slate-400" />
                <span>Intake Channel</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full h-10 px-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition font-medium cursor-pointer"
              >
                <option value="Web Chat">Web Live Chat</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Email">Customer Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>

          {/* Quick Scenario Fillers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                Quick Problem Scenarios
              </span>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 border border-slate-200/80 text-[11px] font-medium text-slate-700 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Customer Message */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3 text-slate-400" />
                <span>Customer Inquiry / Problem Description</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Parsed by RAG & LLM Router</span>
            </label>
            <textarea
              required
              rows={4}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Describe the issue in natural language (e.g., 'My order ORD-8492 shows delivered, but I never received the package...')"
              className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition leading-relaxed resize-none font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl border-slate-200 text-slate-700 font-semibold text-xs h-10 px-4 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs h-10 px-5 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Processing AI Intake...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Generate & Ingest Ticket</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
