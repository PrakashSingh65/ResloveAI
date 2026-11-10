"use client"

import * as React from "react"
import {
  Sparkles,
  User,
  Send,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  Check,
  Package,
  CreditCard,
  Truck,
  Star,
  Eye,
  Zap,
} from "lucide-react"
import { Ticket, TicketStatus } from "./types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LiveSupportDeskProps {
  tickets: Ticket[]
  selectedTicket: Ticket | null
  onSelectTicket: (ticket: Ticket) => void
  onSendMessage: (ticketId: string, messageText: string) => void
  onResolveTicket: (ticketId: string, actionName: string) => void
  searchFilter: string
}

export function LiveSupportDesk({
  tickets,
  selectedTicket,
  onSelectTicket,
  onSendMessage,
  onResolveTicket,
  searchFilter,
}: LiveSupportDeskProps) {
  const [statusTab, setStatusTab] = React.useState<"all" | "escalated" | "ai_troubleshooting" | "resolved">("all")
  const [inputText, setInputText] = React.useState("")
  const [showRAGModal, setShowRAGModal] = React.useState(false)
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null)
  const chatBottomRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation when messages update
  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedTicket?.conversation?.length])

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus =
      statusTab === "all" ? true : t.status === statusTab
    const q = searchFilter.toLowerCase().trim()
    const matchesSearch =
      !q ||
      t.ticketNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.intent.toLowerCase().includes(q) ||
      (t.orderId && t.orderId.toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  const handleSend = () => {
    if (!inputText.trim() || !selectedTicket) return
    onSendMessage(selectedTicket.id, inputText.trim())
    setInputText("")
  }

  const handleQuickReply = (text: string) => {
    if (!selectedTicket) return
    onSendMessage(selectedTicket.id, text)
  }

  const handleActionClick = (actionName: string) => {
    if (!selectedTicket) return
    onResolveTicket(selectedTicket.id, actionName)
    setActionSuccess(`Action executed: "${actionName}". Ticket marked resolved & CSAT survey sent!`)
    setTimeout(() => {
      setActionSuccess(null)
    }, 4500)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "frustrated":
        return "text-red-600 bg-red-50 border-red-200"
      case "urgent":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "neutral":
        return "text-slate-600 bg-slate-100 border-slate-200"
      case "satisfied":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      default:
        return "text-slate-600 bg-slate-100 border-slate-200"
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "escalated":
        return (
          <Badge className="bg-red-500/10 text-red-600 border border-red-200 text-[10px] font-bold">
            Escalated to Human
          </Badge>
        )
      case "ai_troubleshooting":
        return (
          <Badge variant="ai" className="text-[10px] font-semibold">
            AI Troubleshooting
          </Badge>
        )
      case "pending_user":
        return (
          <Badge variant="warning" className="text-[10px] font-semibold">
            Awaiting Customer
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="success" className="text-[10px] font-semibold">
            Resolved
          </Badge>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* ============================================================ */}
      {/* LEFT PANE: Escalation & Ticket Queue (3 cols)               */}
      {/* ============================================================ */}
      <div className="lg:col-span-3 space-y-3">
        {/* Sub-tabs for Queue */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px] font-semibold">
          <button
            onClick={() => setStatusTab("all")}
            className={`flex-1 py-1 rounded-lg text-center transition ${
              statusTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setStatusTab("escalated")}
            className={`flex-1 py-1 rounded-lg text-center transition ${
              statusTab === "escalated"
                ? "bg-white text-red-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Escalated ({tickets.filter((t) => t.status === "escalated").length})
          </button>
          <button
            onClick={() => setStatusTab("ai_troubleshooting")}
            className={`flex-1 py-1 rounded-lg text-center transition ${
              statusTab === "ai_troubleshooting"
                ? "bg-white text-[#2563EB] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            AI Active
          </button>
          <button
            onClick={() => setStatusTab("resolved")}
            className={`flex-1 py-1 rounded-lg text-center transition ${
              statusTab === "resolved"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Tickets Scroll List */}
        <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredTickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
              No tickets matching this filter.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id
              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className={`rounded-2xl p-3.5 transition-all cursor-pointer border text-left space-y-2 ${
                    isSelected
                      ? "border-[#2563EB] bg-white ring-2 ring-[#2563EB]/15 shadow-sm"
                      : "border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold font-mono ${
                        isSelected ? "text-[#2563EB]" : "text-slate-700"
                      }`}
                    >
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {ticket.timeAgo}
                    </span>
                  </div>

                  {/* Customer Info & Avatar */}
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-lg bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/80">
                      {ticket.customerAvatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#0F172A] truncate">
                        {ticket.customerName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {ticket.orderId ? `Order ${ticket.orderId} • ${ticket.orderAmount}` : ticket.customerEmail}
                      </div>
                    </div>
                  </div>

                  {/* Intent & Problem Snippet */}
                  <div className="text-xs text-slate-700 font-medium line-clamp-1">
                    {ticket.intent}
                  </div>

                  {/* Sentiment & Status Pill */}
                  <div className="flex items-center justify-between pt-1 gap-1 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getSentimentColor(
                        ticket.sentiment
                      )}`}
                    >
                      {ticket.sentiment.toUpperCase()} ({ticket.sentimentScore}%)
                    </span>
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER PANE: Live Conversation Stream (5 cols)             */}
      {/* ============================================================ */}
      <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between min-h-[720px]">
        {!selectedTicket ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="size-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100">
              <Sparkles className="size-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Active Ticket Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              The support queue is clean. When a customer sends an inquiry via Web Chat, WhatsApp, Email, or Mobile App, the live conversation stream will appear here.
            </p>
          </div>
        ) : (
          <>
            <div>
              {/* Conversation Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm border border-blue-100">
                {selectedTicket.customerAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#0F172A]">
                    {selectedTicket.customerName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({selectedTicket.channel})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-mono text-slate-700 font-semibold">
                    {selectedTicket.ticketNumber}
                  </span>
                  {selectedTicket.orderId && (
                    <>
                      <span>•</span>
                      <span>Order {selectedTicket.orderId}</span>
                    </>
                  )}
                  {selectedTicket.escalatedAgo && (
                    <>
                      <span>•</span>
                      <span className="text-red-600 font-medium flex items-center gap-0.5">
                        <Clock className="size-3" />
                        Escalated {selectedTicket.escalatedAgo}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              {getStatusBadge(selectedTicket.status)}
            </div>
          </div>

          {/* Visual Agentic Workflow Progress Bar */}
          <div className="my-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-0.5">
              <span>Agentic Workflow Execution</span>
              <span className="text-[#2563EB] font-mono">Stage 5 of 5</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              <div className="rounded-lg bg-emerald-100 text-emerald-800 p-1 text-[10px] font-bold border border-emerald-300">
                1. Intent
              </div>
              <div className="rounded-lg bg-emerald-100 text-emerald-800 p-1 text-[10px] font-bold border border-emerald-300">
                2. RAG
              </div>
              <div className="rounded-lg bg-emerald-100 text-emerald-800 p-1 text-[10px] font-bold border border-emerald-300">
                3. Troubleshoot
              </div>
              <div
                className={`rounded-lg p-1 text-[10px] font-bold border ${
                  selectedTicket.status === "escalated" || selectedTicket.status === "resolved"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-slate-200 text-slate-600 border-slate-300"
                }`}
              >
                4. Escalate
              </div>
              <div
                className={`rounded-lg p-1 text-[10px] font-bold border ${
                  selectedTicket.status === "resolved"
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-[#2563EB] text-white border-[#1D4ED8] animate-pulse"
                }`}
              >
                {selectedTicket.status === "resolved" ? "5. Resolved" : "5. Human Desk"}
              </div>
            </div>
          </div>

          {/* Action Success Toast if clicked */}
          {actionSuccess && (
            <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Conversation Stream */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
            {selectedTicket.conversation.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-violet-50/90 border border-violet-200 text-violet-900 text-xs space-y-1 my-2"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-[#7C3AED]">
                      <ShieldCheck className="size-4" />
                      <span>ResolveAI Autonomous Orchestrator</span>
                    </div>
                    <p className="text-slate-700">{msg.text}</p>
                    <span className="text-[10px] text-slate-400 block text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                )
              }

              if (msg.sender === "customer") {
                return (
                  <div key={msg.id} className="flex flex-col items-start space-y-1 max-w-[85%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                      <User className="size-3 text-slate-400" />
                      <span>{msg.senderName || selectedTicket.customerName}</span>
                      <span className="text-slate-400">• {msg.timestamp}</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-slate-800 border border-slate-200/80">
                      {msg.text}
                    </div>
                  </div>
                )
              }

              if (msg.sender === "ai") {
                return (
                  <div key={msg.id} className="flex flex-col items-end ml-auto space-y-1.5 max-w-[90%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#2563EB]">
                      <Sparkles className="size-3 text-[#8B5CF6]" />
                      <span>ResolveAI Autonomous Bot</span>
                      <span className="text-slate-400">• {msg.timestamp}</span>
                    </div>
                    <div className="rounded-2xl rounded-tr-sm bg-blue-50/70 border border-blue-200/90 p-3 text-slate-800 space-y-2">
                      <p>{msg.text}</p>

                      {/* AI Reasoning Thought disclosure */}
                      {msg.thoughts && (
                        <div className="rounded-xl bg-white/80 p-2 text-[11px] text-slate-600 border border-blue-100 font-mono">
                          <span className="font-bold text-[#8B5CF6]">AI Thought:</span>{" "}
                          {msg.thoughts}
                        </div>
                      )}

                      {/* Diagnostic Choices */}
                      {msg.choices && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.choices.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                            >
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              // Human Agent
              return (
                <div key={msg.id} className="flex flex-col items-end ml-auto space-y-1 max-w-[88%]">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    <span>{msg.senderName || "Sarah Miller (You)"}</span>
                    <span className="text-slate-400">• {msg.timestamp}</span>
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-emerald-50 border border-emerald-200 p-3 text-slate-900 shadow-xs">
                    {msg.text}
                  </div>
                </div>
              )
            })}
            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* Reply Composer & AI Copilot Suggestions */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {/* AI Quick Response Chips */}
          {selectedTicket.conversation.find((m) => m.suggestedReplies)?.suggestedReplies && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="size-3 text-[#8B5CF6]" />
                <span>AI Suggested Responses</span>
              </div>
              <div className="flex flex-col gap-1">
                {selectedTicket.conversation
                  .find((m) => m.suggestedReplies)!
                  .suggestedReplies!.map((rep, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(rep)}
                      className="text-left text-[11px] p-2 rounded-xl bg-violet-50/70 hover:bg-violet-100/80 border border-violet-200 text-[#6D28D9] transition font-medium flex items-center justify-between group"
                    >
                      <span className="truncate">{rep}</span>
                      <ArrowRight className="size-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Live Message Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend()
              }}
              placeholder={`Reply to ${selectedTicket.customerName} as human agent...`}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-slate-50/50"
            />
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-4 h-9 font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>Send</span>
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      </>
    )}
  </div>

      {/* ============================================================ */}
      {/* RIGHT PANE: AI Intelligence Briefing & Actions (4 cols)     */}
      {/* ============================================================ */}
      <div className="lg:col-span-4 space-y-4">
        {!selectedTicket ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center min-h-[360px] flex flex-col items-center justify-center">
            <div className="size-14 rounded-2xl bg-violet-50 text-[#8B5CF6] flex items-center justify-center mb-3 border border-violet-100">
              <ShieldCheck className="size-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">AI Copilot Standby</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
              Select an inquiry from the queue to view its automated root cause briefing and pre-authorized 1-click resolution action.
            </p>
          </div>
        ) : (
          <>
            {/* Card 1: Executive AI Context Briefing */}
            <div className="rounded-3xl border border-[#8B5CF6]/30 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-extrabold text-xs text-[#0F172A]">
              <Sparkles className="size-4 text-[#8B5CF6]" />
              <span>AI Executive Briefing</span>
            </div>
            <Badge variant="ai" className="text-[10px] font-bold">
              Confidence {selectedTicket.aiBriefing.confidence}%
            </Badge>
          </div>

          {/* Core Issue & Root Cause */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Problem
              </span>
              <p className="font-semibold text-slate-800">
                {selectedTicket.aiBriefing.coreIssue}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                Identified Root Cause
              </span>
              <p className="text-slate-800">
                {selectedTicket.aiBriefing.rootCause}
              </p>
            </div>
          </div>

          {/* Attempted Diagnostic Steps */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Attempted Troubleshooting Steps
            </div>
            <div className="space-y-1">
              {selectedTicket.aiBriefing.attemptedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                >
                  <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Gauge */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Sentiment & Urgency Index</span>
              <span className="font-extrabold text-red-600 font-mono">
                {selectedTicket.aiBriefing.urgencyScore} / 100
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedTicket.aiBriefing.urgencyScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 italic">
              &quot;{selectedTicket.aiBriefing.sentimentSummary}&quot;
            </p>
          </div>
        </div>

        {/* Card 2: Grounded RAG Knowledge Citation */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#0F172A]">
              <FileText className="size-4 text-[#2563EB]" />
              <span>Grounded RAG Citation</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
              Cosine {selectedTicket.ragCitation.similarityScore}
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-[#0F172A] flex items-center justify-between">
              <span>{selectedTicket.ragCitation.docName}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedTicket.ragCitation.clauseNumber}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              &quot;{selectedTicket.ragCitation.snippet}&quot;
            </p>
            <button
              onClick={() => setShowRAGModal(true)}
              className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1 pt-1"
            >
              <Eye className="size-3" />
              <span>Inspect Raw Document Chunk</span>
            </button>
          </div>
        </div>

        {/* Card 3: 1-Click Action Hub */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#0F172A]">
              <Zap className="size-4 text-amber-500 fill-amber-400" />
              <span>1-Click Resolution Hub</span>
            </div>
            <span className="text-[10px] text-slate-400">Zero Human Delay</span>
          </div>

          <div className="space-y-2">
            {/* Primary Recommended Action */}
            <Button
              onClick={() => handleActionClick(selectedTicket.aiBriefing.recommendedActionLabel)}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs h-10 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package className="size-4" />
              <span>{selectedTicket.aiBriefing.recommendedActionLabel}</span>
            </Button>

            {/* Secondary Actions */}
            {selectedTicket.orderAmount && (
              <Button
                variant="outline"
                onClick={() =>
                  handleActionClick(`Refund ${selectedTicket.orderAmount} in full`)
                }
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-9 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="size-3.5 text-slate-500" />
                <span>Issue Full Refund ({selectedTicket.orderAmount})</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => handleActionClick("Open Carrier Investigation Ticket")}
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-9 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="size-3.5 text-slate-500" />
              <span>Open Courier Investigation Claim</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleActionClick("Mark Resolved & Dispatch CSAT")}
              className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Star className="size-3.5 fill-emerald-500 text-emerald-600" />
              <span>Resolve & Send 5-Star CSAT</span>
            </Button>
          </div>
        </div>
      </>
    )}
  </div>

  {/* RAG Inspection Modal */}
  {showRAGModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                <FileText className="size-4 text-[#2563EB]" />
                <span>RAG Grounding Document Details</span>
              </div>
              <button
                onClick={() => setShowRAGModal(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  Source Document
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedTicket.ragCitation.docName}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {selectedTicket.ragCitation.clauseNumber}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  Retrieved Vector Chunk (Cosine: {selectedTicket.ragCitation.similarityScore})
                </span>
                <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                  {selectedTicket.ragCitation.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Vector Model: text-embedding-3-small</span>
                <span>Grounding Accuracy: 99.4%</span>
              </div>
            </div>

            <Button
              onClick={() => setShowRAGModal(false)}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs h-9"
            >
              Close Snippet Viewer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
