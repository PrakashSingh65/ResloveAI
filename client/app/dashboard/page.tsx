"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  Headphones,
  Database,
  GitBranch,
  BrainCircuit,
  HeartHandshake,
  Play,
  User,
  ShieldCheck,
  Mail,
  MapPin,
  Loader2,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { MetricsOverview } from "@/components/dashboard/MetricsOverview"
import { LiveSupportDesk } from "@/components/dashboard/LiveSupportDesk"
import { RAGKnowledgeView } from "@/components/dashboard/RAGKnowledgeView"
import { TroubleshootingFlowView } from "@/components/dashboard/TroubleshootingFlowView"
import { SentimentIntentView } from "@/components/dashboard/SentimentIntentView"
import { FeedbackCSATView } from "@/components/dashboard/FeedbackCSATView"
import { SimulatorTab } from "@/components/dashboard/SimulatorTab"
import { INITIAL_TICKETS, SIMULATION_TEMPLATES } from "@/components/dashboard/dashboard-data"
import { Ticket, Message } from "@/components/dashboard/types"
import { ticketsApi } from "@/lib/api/tickets"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = React.useState<Ticket[]>(INITIAL_TICKETS)
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [operatorStatus, setOperatorStatus] = React.useState<"available" | "busy" | "away">("available")
  const [activeTab, setActiveTab] = React.useState<
    "desk" | "rag" | "troubleshooting" | "sentiment" | "csat" | "simulator" | "profile"
  >("desk")
  const [simulationIndex, setSimulationIndex] = React.useState(0)
  const [notificationMessage, setNotificationMessage] = React.useState<string | null>(null)

  // Load live tickets from FastAPI backend on mount
  React.useEffect(() => {
    let isMounted = true
    async function fetchLiveTickets() {
      try {
        const live = await ticketsApi.listTickets()
        if (isMounted && live && live.length > 0) {
          setTickets(live)
          setSelectedTicket(live[0])
        }
      } catch (err) {
        // Fallback to initial local tickets smoothly
      }
    }
    fetchLiveTickets()
    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch {
      // ignore
    }
  }

  // Handle agent sending a message in the live conversation
  const handleSendMessage = (ticketId: string, messageText: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "agent",
      senderName: user?.first_name ? `${user.first_name} (You)` : "Sarah Miller (You)",
      text: messageText,
      timestamp: timeNow,
    }

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedConv = [...t.conversation, newMsg]
          const updatedTicket = { ...t, conversation: updatedConv, timeAgo: "Just now" }
          if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updatedTicket)
          }
          return updatedTicket
        }
        return t
      })
    )

    // Sync to backend asynchronously
    ticketsApi.sendMessage(ticketId, {
      text: messageText,
      sender: "agent",
      sender_name: user?.first_name ? `${user.first_name} (You)` : "Sarah Miller (You)",
    }).catch(() => {})
  }

  // Handle 1-click resolution on a ticket
  const handleResolveTicket = (ticketId: string, actionName: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const resolutionMsg: Message = {
      id: `sys-${Date.now()}`,
      sender: "system",
      text: `✅ Action Executed: ${actionName}. Ticket resolved with zero customer repetition. Post-chat CSAT survey initiated.`,
      timestamp: timeNow,
    }

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedTicket: Ticket = {
            ...t,
            status: "resolved",
            timeAgo: "Resolved",
            conversation: [...t.conversation, resolutionMsg],
            resolutionDetails: {
              resolvedAt: timeNow,
              resolvedBy: user?.first_name ? `${user.first_name} ${user.last_name}` : "Sarah Miller",
              actionTaken: actionName,
              csatRating: 5,
              csatComment: "Resolved immediately with zero repetition!",
            },
          }
          if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updatedTicket)
          }
          return updatedTicket
        }
        return t
      })
    )

    // Sync resolution to backend asynchronously
    ticketsApi.resolveTicket(ticketId, {
      action_name: actionName,
    }).catch(() => {})
  }

  // Inject a new simulated customer escalation into the live queue
  const handleSimulateIncomingTicket = () => {
    const template = SIMULATION_TEMPLATES[simulationIndex % SIMULATION_TEMPLATES.length]
    setSimulationIndex((prev) => prev + 1)

    const newTicketNumber = `RES-${Math.floor(2000 + Math.random() * 7000)}`
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const newTicket: Ticket = {
      id: `ticket-sim-${Date.now()}`,
      ticketNumber: newTicketNumber,
      customerName: template.customerName,
      customerEmail: template.customerEmail,
      customerAvatar: template.customerAvatar,
      orderId: template.orderId,
      orderAmount: template.orderAmount,
      channel: template.channel,
      status: "escalated",
      priority: "high",
      intent: template.intent,
      intentConfidence: template.intentConfidence,
      sentiment: template.sentiment,
      sentimentScore: template.sentimentScore,
      timeAgo: "Just now",
      escalatedAgo: "Just now",
      assignedAgent: user?.first_name ? user.first_name : "Sarah Miller",
      diagnosticSteps: [
        {
          stepNumber: 1,
          title: "Ingestion & Intent Classification",
          instruction: `Identified customer issue: ${template.intent}`,
          status: "completed",
          resultNote: `Confidence score ${template.intentConfidence}%`,
        },
        {
          stepNumber: 2,
          title: "Vector SOP Retrieval",
          instruction: `Queried ${template.docName}`,
          status: "completed",
          resultNote: "Relevant clause extracted with 0.97 cosine score",
        },
        {
          stepNumber: 3,
          title: "Automated Escalation Rule",
          instruction: "Threshold exceeded for automated resolution; transferred to Human Desk",
          status: "completed",
          resultNote: "Pre-authorized briefing generated",
        },
      ],
      ragCitation: {
        docName: template.docName,
        docType: template.docType,
        similarityScore: 0.97,
        clauseNumber: "Section 3.1 - Priority Escalation Protocol",
        snippet: template.docSnippet,
      },
      aiBriefing: {
        coreIssue: template.coreIssue,
        rootCause: template.rootCause,
        attemptedSteps: [
          "Ingested customer description and parsed sentiment.",
          `Cross-referenced internal SOP: ${template.docName}`,
          "Auto-prepared 1-click replacement order payload.",
        ],
        recommendedAction: template.recommendedAction,
        recommendedActionLabel: template.recommendedActionLabel,
        confidence: template.intentConfidence,
        urgencyScore: template.sentimentScore,
        sentimentSummary: "Customer requires rapid confirmation. Zero explanation required.",
      },
      conversation: [
        {
          id: `sim-msg-1`,
          sender: "customer",
          senderName: template.customerName,
          text: template.firstMessage,
          timestamp: timeNow,
        },
        {
          id: `sim-msg-2`,
          sender: "ai",
          senderName: "ResolveAI Agent",
          text: `Hello ${template.customerName.split(" ")[0]}. I am reviewing your order ${template.orderId} and packaging scans right now.`,
          timestamp: timeNow,
          thoughts: `Intent: ${template.intent}. Sentiment: ${template.sentiment} (${template.sentimentScore}%). RAG SOP: ${template.docName}.`,
        },
        {
          id: `sim-msg-3`,
          sender: "system",
          text: `⚠️ Escalation Handover: AI transferred chat session to Human Specialist with pre-approved 1-click resolution.`,
          timestamp: timeNow,
          isHandoffNotice: true,
        },
      ],
    }

    setTickets((prev) => [newTicket, ...prev])
    setSelectedTicket(newTicket)
    setActiveTab("desk")

    setNotificationMessage(
      `New escalation received: Ticket ${newTicketNumber} from ${template.customerName} (${template.intent})`
    )
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  const escalatedCount = tickets.filter((t) => t.status === "escalated").length
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-[#2563EB]" />
        <p className="mt-3 text-xs text-slate-500 font-medium">
          Loading ResolveAI Support Command Center...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#2563EB]/15 relative overflow-x-hidden font-sans">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      {/* Top Application Header */}
      <DashboardHeader
        operatorName={user?.first_name || "Sarah Miller"}
        operatorStatus={operatorStatus}
        onStatusChange={setOperatorStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSimulateTicket={handleSimulateIncomingTicket}
        escalatedCount={escalatedCount}
        onLogout={isAuthenticated ? handleLogout : undefined}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Notification Toast */}
          {notificationMessage && (
            <div className="p-3.5 rounded-2xl bg-violet-600 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2">
                <Bell className="size-4 animate-bounce shrink-0" />
                <span>{notificationMessage}</span>
              </div>
              <button
                onClick={() => setNotificationMessage(null)}
                className="size-5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-[10px]"
              >
                ✕
              </button>
            </div>
          )}

          {/* Welcome & Command Bar */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB]">
                <Sparkles className="size-3.5" />
                <span>ResolveAI Autonomous Operator Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                Welcome back, {user?.first_name || "Sarah Miller"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Autonomous support agent is actively resolving customer inquiries. When complex edge cases occur, ResolveAI prepares zero-context handoffs with pre-approved solutions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                onClick={() => setActiveTab("simulator")}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:text-[#2563EB] font-semibold rounded-xl text-xs h-10 px-3.5 flex items-center gap-2 cursor-pointer"
              >
                <Play className="size-3.5 text-[#2563EB] fill-[#2563EB]" />
                <span>Problem Simulator</span>
              </Button>
              <Button
                onClick={handleSimulateIncomingTicket}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs h-10 px-4 shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-3.5" />
                <span>+ Simulate Escalation</span>
              </Button>
            </div>
          </div>

          {/* Top KPI Metrics Bar */}
          <MetricsOverview
            totalTicketsCount={tickets.length}
            escalatedCount={escalatedCount}
            resolvedCount={resolvedCount}
          />

          {/* Workspace Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("desk")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "desk"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Headphones className="size-4" />
              <span>Live Support Desk ({escalatedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("rag")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "rag"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="size-4 text-[#2563EB]" />
              <span>RAG Knowledge Store</span>
            </button>

            <button
              onClick={() => setActiveTab("troubleshooting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "troubleshooting"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitBranch className="size-4 text-[#8B5CF6]" />
              <span>Smart Troubleshooting Trees</span>
            </button>

            <button
              onClick={() => setActiveTab("sentiment")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "sentiment"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BrainCircuit className="size-4 text-emerald-600" />
              <span>Sentiment & Intent</span>
            </button>

            <button
              onClick={() => setActiveTab("csat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "csat"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HeartHandshake className="size-4 text-amber-500" />
              <span>Feedback & CSAT</span>
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Play className="size-4 text-violet-600 fill-violet-500" />
              <span>Agentic Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="size-4 text-slate-500" />
              <span>Operator Details</span>
            </button>
          </div>

          {/* Tab Views Content */}
          {activeTab === "desk" && (
            <LiveSupportDesk
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              onSendMessage={handleSendMessage}
              onResolveTicket={handleResolveTicket}
              searchFilter={searchQuery}
            />
          )}

          {activeTab === "rag" && <RAGKnowledgeView />}

          {activeTab === "troubleshooting" && <TroubleshootingFlowView />}

          {activeTab === "sentiment" && <SentimentIntentView />}

          {activeTab === "csat" && <FeedbackCSATView />}

          {activeTab === "simulator" && <SimulatorTab />}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-extrabold text-base text-[#0F172A]">
                    <User className="size-5 text-[#2563EB]" />
                    <span>Operator Identity &amp; System Authorization</span>
                  </div>
                  <Badge variant="success" className="text-xs">
                    JWT Session Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Full Name
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {user?.first_name ? `${user.first_name} ${user.last_name}` : "Sarah Miller (Senior Resolution Specialist)"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Email Address
                    </span>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                      <Mail className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user?.email || "sarah.miller@resolveai.internal"}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Location / Region
                    </span>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-slate-400 shrink-0" />
                      <span>{user?.city ? `${user.city}, ${user.country}` : "San Francisco, United States"}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Security &amp; Token Protocol
                    </span>
                    <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                      <span>Auto-Rotating Neon JWT Active</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Assigned Queue Tier
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      Tier 2 Logistics &amp; High-Frustration Handoff Desk
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Autonomous Bot Override
                    </span>
                    <p className="text-sm font-bold text-[#2563EB]">
                      1-Click Instant Action Pre-Authorized
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E2E8F0] bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ResolveAI Support Command</span>
            <span>&copy; {new Date().getFullYear()} Autonomous Customer Resolution Platform.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Landing Page
            </Link>
            <Link href="/#simulator" className="hover:text-slate-800 transition-colors">
              Landing Simulator
            </Link>
            <Link href="/#handoff" className="hover:text-slate-800 transition-colors">
              Handoff Desk Section
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
