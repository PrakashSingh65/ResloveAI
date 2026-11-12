"use client"

import * as React from "react"
import {
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Ticket,
  Headphones,
  FileText,
  Play,
  Pause,
  ChevronRight,
  TrendingDown,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface StepData {
  step: number
  title: string
  subtitle: string
  chatAction: string
  aiThought: string
  intent: string
  intentConfidence: string
  sentiment: string
  sentimentLevel: string
  sentimentScore: number
  ragDoc: string
  ragSimilarity: string
  ticketStatus: string
  humanDeskStatus: string
  summaryBullets: string[]
}

const STEPS: StepData[] = [
  {
    step: 1,
    title: "1. LLM Comprehension",
    subtitle: "Customer message ingestion & semantic parsing",
    chatAction: "Customer: 'My order #7741-CA shows delivered, but I haven't received it.'",
    aiThought: "Analyzing natural language input: Customer states parcel status is 'Delivered' but physical goods are missing.",
    intent: "Analyzing...",
    intentConfidence: "Pending",
    sentiment: "Frustrated / Concerned",
    sentimentLevel: "Medium-High",
    sentimentScore: 68,
    ragDoc: "Connecting to vector knowledge store...",
    ragSimilarity: "--",
    ticketStatus: "Not needed yet",
    humanDeskStatus: "Listening in background",
    summaryBullets: [
      "Customer reports order #7741-CA missing despite 'Delivered' tracking timestamp.",
    ],
  },
  {
    step: 2,
    title: "2. Intent & Sentiment",
    subtitle: "Classification of problem category and user emotional state",
    chatAction: "AI Agent classifies intent into 'Logistics / Missing Delivery' category.",
    aiThought: "Identified high-urgency delivery dispute. Sentiment shows rising frustration due to time-sensitive items.",
    intent: "Missing Delivery Discrepancy",
    intentConfidence: "99.4%",
    sentiment: "Frustrated (Urgency High)",
    sentimentLevel: "High",
    sentimentScore: 78,
    ragDoc: "logistics_sla_playbook.md & carrier_safe_drop.pdf",
    ragSimilarity: "0.96",
    ticketStatus: "Pre-ticket allocated",
    humanDeskStatus: "Monitored",
    summaryBullets: [
      "Customer reports order #7741-CA marked delivered but missing.",
      "Intent: Missing Delivery. Frustration index high; immediate action required.",
    ],
  },
  {
    step: 3,
    title: "3. Diagnostic Policy Check",
    subtitle: "Verifying delivery protocols & carrier safe-drop SOPs",
    chatAction: "AI Agent cross-references standard operating procedures for 'Carrier Safe Drop & Doorstep Checks'.",
    aiThought: "Found SOP: 42% of false 'Delivered' statuses occur when couriers drop in building mailrooms, parcel lockers, or side porches. Photo on file shows blue porch door.",
    intent: "Missing Delivery Discrepancy",
    intentConfidence: "99.4%",
    sentiment: "Frustrated (Urgency High)",
    sentimentLevel: "High",
    sentimentScore: 75,
    ragDoc: "Carrier_SOP_2026_Missing_Parcels.pdf (Clause 4.1)",
    ragSimilarity: "Verified",
    ticketStatus: "Pending Troubleshooting",
    humanDeskStatus: "Standby",
    summaryBullets: [
      "Customer reports order #7741-CA marked delivered but missing.",
      "Carrier SOP fetched: Courier uploaded proof of delivery (POD) at back patio.",
    ],
  },
  {
    step: 4,
    title: "4. Smart Troubleshooting",
    subtitle: "Guiding the user through step-by-step verification options",
    chatAction: "AI Agent: 'I see courier FedEx marked this at 11:42 AM at the rear patio / side entrance. Could you check if it was placed there or with your building concierge?'",
    aiThought: "Guiding customer through non-invasive self-verification before escalating to carrier claim.",
    intent: "Missing Delivery Discrepancy",
    intentConfidence: "99.4%",
    sentiment: "Attentive / Testing Steps",
    sentimentLevel: "Medium",
    sentimentScore: 55,
    ragDoc: "Customer_Self_Service_SOP.md",
    ragSimilarity: "0.93",
    ticketStatus: "Awaiting Customer Confirmation",
    humanDeskStatus: "Standby",
    summaryBullets: [
      "Customer guided to check rear patio & building locker per courier delivery note.",
      "Customer responded: 'I checked rear patio and mailbox, nothing is there.'",
    ],
  },
  {
    step: 5,
    title: "5. Ticket Creation",
    subtitle: "Automated ticket provisioning with structured payload",
    chatAction: "Customer: 'I just searched both areas, no package anywhere.' -> AI Agent initializes Ticket #RES-8924.",
    aiThought: "Verification unsuccessful. Self-resolution threshold exceeded. Generating official support ticket with all order and courier metadata.",
    intent: "Missing Delivery Discrepancy",
    intentConfidence: "99.4%",
    sentiment: "Frustrated -> Reassured (Action Taken)",
    sentimentLevel: "Medium",
    sentimentScore: 48,
    ragDoc: "Escalation_Matrix_Tier2.md",
    ragSimilarity: "0.97",
    ticketStatus: "Ticket #RES-8924 Created (Priority: HIGH)",
    humanDeskStatus: "Queue Slot Assigned",
    summaryBullets: [
      "Self-troubleshooting concluded: Parcel physically absent.",
      "Support Ticket #RES-8924 generated with FedEx Tracking #FX-992140.",
      "Recommended Resolution: Authorize instant replacement or expedite human refund.",
    ],
  },
  {
    step: 6,
    title: "6. Smart Escalation",
    subtitle: "Intelligent agent handoff triggered by complexity rules",
    chatAction: "AI Agent: 'Thank you for verifying. I have created Ticket #RES-8924 and am transferring you right now to Sarah from our Senior Logistics team.'",
    aiThought: "Dispatching websocket handoff payload to human dashboard. Seamless transfer initiated.",
    intent: "Missing Delivery Discrepancy",
    intentConfidence: "99.4%",
    sentiment: "Calm / Appreciative",
    sentimentLevel: "Positive Trend",
    sentimentScore: 32,
    ragDoc: "Agent_Handoff_Protocol.md",
    ragSimilarity: "0.99",
    ticketStatus: "Ticket #RES-8924 In Transit to Human",
    humanDeskStatus: "Incoming Call / Chat Ringing for Agent Sarah",
    summaryBullets: [
      "Customer: Verified e-commerce buyer (Tier 1 Gold).",
      "Issue: Missing delivered package after thorough physical check.",
      "Current Status: Escalated to human specialist; zero re-prompting needed.",
    ],
  },
  {
    step: 7,
    title: "7. Full Context Handoff",
    subtitle: "Human receives full chat history, sentiment, and AI summary",
    chatAction: "Human Agent Sarah joins: 'Hi Alex! I reviewed ResolveAI's notes. I see the courier left it at the wrong door. I am approving your free replacement now!'",
    aiThought: "Handoff completed with 100% context retention. Customer did NOT have to repeat themselves.",
    intent: "Resolved via Human Handoff",
    intentConfidence: "100%",
    sentiment: "Delighted (CSAT 5/5)",
    sentimentLevel: "Very High Satisfaction",
    sentimentScore: 12,
    ragDoc: "Claims_Fulfillment_API.md",
    ragSimilarity: "1.00",
    ticketStatus: "Ticket #RES-8924 -> Replacement Approved",
    humanDeskStatus: "Handled by Sarah M. (Senior Support)",
    summaryBullets: [
      "AI Summary: Verified missing parcel #7741-CA.",
      "Resolution: 1-click replacement order dispatched by Sarah.",
      "Total Time: 1 min 42 seconds vs industry average 18 minutes.",
    ],
  },
]

export function InteractiveSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const currentStep = STEPS[currentStepIndex]

  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= STEPS.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 3500)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }

  return (
    <section id="simulator" className="py-20 lg:py-28 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <Sparkles className="size-3.5 mr-1 text-[#8B5CF6]" />
            Live Agentic Workflow Simulation
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Watch ResolveAI Handle an E-Commerce Delivery Issue
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Follow the real-life journey: Customer reports a missing delivered parcel, the AI understands the problem, applies diagnostic SOPs, guides troubleshooting, and completes a zero-friction human escalation.
          </p>
        </div>

        {/* Step Navigation Pill Bar */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[700px] border border-[#E2E8F0] rounded-2xl bg-white p-2 shadow-xs">
            {STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex
              const isPast = idx < currentStepIndex
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentStepIndex(idx)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm font-semibold"
                      : isPast
                      ? "text-slate-800 bg-blue-50/70 hover:bg-blue-100/70"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#2563EB]"
                        : isPast
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {s.step}
                  </span>
                  <span className="truncate max-w-[90px] sm:max-w-none">{s.title.split(". ")[1]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Playback Controls & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-[#E2E8F0] text-slate-800 hover:text-[#2563EB]"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3.5 mr-1 text-[#8B5CF6]" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <Play className="size-3.5 mr-1 text-[#2563EB]" />
                  Auto Play (Step-by-Step)
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="size-3.5 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className="border-[#E2E8F0] disabled:opacity-40"
            >
              Back
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={currentStepIndex === STEPS.length - 1}
              onClick={handleNext}
              className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-40"
            >
              Next Step
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* 3-Column Interactive Sandbox View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1: Customer Chat Experience (4 cols) */}
          <div className="lg:col-span-4 flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-xs">
                  <Bot className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">Customer Chat View</div>
                  <div className="text-[10px] text-slate-500">Live Client Window</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Session Active
              </Badge>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 space-y-3.5 min-h-[360px] text-xs">
              {/* Message 1: Customer initial problem */}
              <div className="flex justify-end">
                <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-[#2563EB] text-white p-3 shadow-xs">
                  <p className="font-medium">
                    "My order shows delivered, but I haven&apos;t received it."
                  </p>
                  <span className="block text-[9px] text-blue-200 mt-1 text-right">Order #7741-CA</span>
                </div>
              </div>

              {/* Message 2: AI Step 1-3 response */}
              {currentStepIndex >= 2 && (
                <div className="flex items-start gap-2">
                  <div className="size-6 rounded-md bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 p-3 text-slate-800 space-y-1.5">
                    <p className="text-[11px] leading-relaxed">
                      I checked carrier notes for #7741-CA. FedEx noted safe drop at rear entrance/patio at 11:42 AM.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] text-slate-600">
                      <strong>Verification Step:</strong> Did you check your side porch or neighbor&apos;s doorway?
                    </div>
                  </div>
                </div>
              )}

              {/* Message 3: Customer feedback */}
              {currentStepIndex >= 3 && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-100 text-slate-800 p-2.5 border border-slate-200">
                    <p>
                      "I just checked the rear patio and mailbox, nothing is there."
                    </p>
                  </div>
                </div>
              )}

              {/* Message 4: Escalation trigger */}
              {currentStepIndex >= 4 && (
                <div className="flex items-start gap-2">
                  <div className="size-6 rounded-md bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-violet-50/70 border border-[#8B5CF6]/30 p-3 text-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1 font-semibold text-[#8B5CF6] text-[11px]">
                      <Ticket className="size-3.5" />
                      Created Ticket #RES-8924
                    </div>
                    <p className="text-[11px] text-slate-700">
                      Since it wasn&apos;t found, I&apos;ve logged an official lost package claim and am bringing in a senior logistics specialist with our full conversation history.
                    </p>
                  </div>
                </div>
              )}

              {/* Message 5: Human Agent Joined */}
              {currentStepIndex >= 5 && (
                <div className="flex items-start gap-2">
                  <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Headphones className="size-3" />
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-emerald-50/70 border border-emerald-300 p-3 text-slate-900 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      Sarah M. (Senior Support) joined
                    </div>
                    <p className="text-[11px]">
                      &quot;Hi Alex! I reviewed the AI summary and FedEx geotag. I can confirm the package went to 14B instead of 14A. I just processed a replacement order for overnight shipping at no cost!&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom active state indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentStep.humanDeskStatus}
              </span>
              <span className="font-mono text-slate-400">Step {currentStep.step} of 7</span>
            </div>
          </div>

          {/* Column 2: ResolveAI Agent Brain & RAG Engine (4 cols) */}
          <div className="lg:col-span-4 flex flex-col rounded-2xl border border-[#8B5CF6]/30 bg-white p-5 shadow-sm relative overflow-hidden">
            {/* Subtle violet top banner accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#8B5CF6]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">AI Agent Diagnostic Brain</div>
                  <div className="text-[10px] text-[#8B5CF6] font-medium">Agentic State Machine</div>
                </div>
              </div>
              <Badge variant="ai" className="text-[10px]">
                {currentStep.title}
              </Badge>
            </div>

            {/* Live LLM Thought Trace */}
            <div className="space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 border border-[#E2E8F0] p-3 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Bot className="size-3 text-[#8B5CF6]" />
                  Internal Agent Chain of Thought
                </div>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                  {currentStep.aiThought}
                </p>
              </div>

              {/* Intent Classification Result */}
              <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                  <span>DETECTED INTENT</span>
                  <span className="text-[#2563EB] font-bold font-mono">{currentStep.intentConfidence}</span>
                </div>
                <div className="text-xs font-bold text-[#0F172A]">
                  {currentStep.intent}
                </div>
              </div>

              {/* Sentiment & Frustration Meter */}
              <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                  <span>CUSTOMER SENTIMENT GAUGE</span>
                  <span className="font-mono text-slate-700">{currentStep.sentimentLevel}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentStep.sentimentScore > 60
                        ? "bg-amber-500"
                        : currentStep.sentimentScore > 35
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${currentStep.sentimentScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Frustration: {currentStep.sentimentScore}%</span>
                  <span className="text-[#8B5CF6] font-medium">{currentStep.sentiment}</span>
                </div>
              </div>

              {/* Diagnostic Policies */}
              <div className="p-3 rounded-xl bg-violet-50/50 border border-[#8B5CF6]/25 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#8B5CF6]">
                  <span className="flex items-center gap-1">
                    <FileSearch className="size-3" />
                    Diagnostic Policy Grounding
                  </span>
                  <span className="font-mono text-slate-600">{currentStep.ragSimilarity}</span>
                </div>
                <p className="font-mono text-[10px] text-slate-800 bg-white p-2 rounded-lg border border-[#8B5CF6]/20 truncate">
                  {currentStep.ragDoc}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Human Agent Escalation Desk (4 cols) */}
          <div className="lg:col-span-4 flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                  <Headphones className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">Human Agent Desk</div>
                  <div className="text-[10px] text-slate-500">Zero-Context-Loss Handover</div>
                </div>
              </div>
              <Badge
                variant={currentStepIndex >= 4 ? "default" : "secondary"}
                className={`text-[10px] ${currentStepIndex >= 4 ? "bg-[#2563EB]" : ""}`}
              >
                {currentStepIndex >= 5 ? "Agent Active" : currentStepIndex >= 4 ? "Ticket Open" : "Standby"}
              </Badge>
            </div>

            {/* Ticket Card Details */}
            <div className="space-y-4 text-xs flex-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Ticket Summary
                  </span>
                  <span className="text-[10px] font-mono text-[#2563EB] font-bold">
                    {currentStep.ticketStatus}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#0F172A]">
                  Order #7741-CA • Delivery Dispute
                </div>
                <div className="text-[10px] text-slate-500">
                  Customer: Alex Vance (Member since 2023, 14 orders)
                </div>
              </div>

              {/* AI Generated 3-Bullet Summary */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
                  <FileText className="size-3.5" />
                  AI Summary For Human Agent
                </div>
                <ul className="space-y-2 text-[11px] text-slate-600">
                  {currentStep.summaryBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#8B5CF6] mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action Card */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Recommended One-Click Action
                </div>
                <p className="text-[11px] text-emerald-800">
                  Instant free reshipment authorized under Carrier SLA Clause 4.
                </p>
              </div>

              {/* Human Action Button */}
              <div className="pt-2">
                <Button
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold h-9 rounded-xl shadow-sm"
                  disabled={currentStepIndex < 4}
                >
                  {currentStepIndex >= 5 ? "Conversation Resolved" : "Claim & Respond in 1 Click"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
