"use client"

import * as React from "react"
import {
  Sparkles,
  Bot,
  RotateCcw,
  CheckCircle2,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StepData {
  step: number
  title: string
  subtitle: string
  chatAction: string
  aiThought: string
  intent: string
  intentConfidence: string
  sentiment: string
  sentimentScore: number
  ragDoc: string
  ragSimilarity: string
  ticketStatus: string
  humanDeskStatus: string
  summaryBullets: string[]
}

const SIMULATOR_STEPS: StepData[] = [
  {
    step: 1,
    title: "1. LLM Comprehension",
    subtitle: "Customer message ingestion & semantic parsing",
    chatAction: "Customer: 'My order #7741-CA shows delivered, but I haven't received it.'",
    aiThought: "Analyzing natural language input: Customer states parcel status is 'Delivered' but physical goods are missing.",
    intent: "Analyzing Intent...",
    intentConfidence: "Pending",
    sentiment: "Frustrated / Concerned",
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
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Frustrated (Urgency High)",
    sentimentScore: 78,
    ragDoc: "Carrier_SOP_2026_Missing_Parcels.pdf",
    ragSimilarity: "0.96",
    ticketStatus: "Pre-ticket allocated",
    humanDeskStatus: "Monitored",
    summaryBullets: [
      "Customer reports order #7741-CA marked delivered but missing.",
      "Intent: Order Delivery Issue. Frustration index high; immediate action required.",
    ],
  },
  {
    step: 3,
    title: "3. RAG Knowledge Search",
    subtitle: "Retrieving verified policies & carrier delivery procedures",
    chatAction: "Vector search queries internal SOPs for 'Carrier Safe Drop & Doorstep Checks'.",
    aiThought: "Found SOP: 42% of false 'Delivered' statuses occur when couriers drop in building mailrooms, parcel lockers, or side porches. GPS indicates unit 14B doorstep.",
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Frustrated (Urgency High)",
    sentimentScore: 75,
    ragDoc: "Carrier_SOP_2026_Missing_Parcels.pdf (Clause 4.1.2)",
    ragSimilarity: "0.98",
    ticketStatus: "Pending Troubleshooting",
    humanDeskStatus: "Standby",
    summaryBullets: [
      "Customer reports order #7741-CA marked delivered but missing.",
      "Carrier SOP fetched: Courier uploaded photo proof at side entrance/patio.",
    ],
  },
  {
    step: 4,
    title: "4. Smart Guided Troubleshooting",
    subtitle: "Guiding the user through step-by-step verification options",
    chatAction: "AI Agent: 'I see FedEx marked this at 11:42 AM near a patio door. Could you check if it was placed around your rear patio or with unit 14B?'",
    aiThought: "Guiding customer through non-invasive self-verification before escalating to carrier claim.",
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Attentive / Testing Steps",
    sentimentScore: 55,
    ragDoc: "Customer_Self_Service_SOP.md",
    ragSimilarity: "0.93",
    ticketStatus: "Awaiting Customer Confirmation",
    humanDeskStatus: "Standby",
    summaryBullets: [
      "Customer guided to check rear patio & adjacent unit per courier note.",
      "Verification steps delivered with friendly, supportive tone.",
    ],
  },
  {
    step: 5,
    title: "5. Escalation Trigger",
    subtitle: "Customer checked, parcel absent; automated escalation criteria met",
    chatAction: "Customer: 'I checked the rear patio and mailbox. Nothing is there. I need this today!'",
    aiThought: "Verification unsuccessful. Time sensitivity + frustration threshold reached. Automatically generating ticket & triggering human handoff.",
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Frustrated (Urgency High)",
    sentimentScore: 84,
    ragDoc: "Escalation_Matrix_SOP.md",
    ragSimilarity: "0.95",
    ticketStatus: "Ticket #RES-8924 Auto-Generated",
    humanDeskStatus: "Handoff Triggered",
    summaryBullets: [
      "Customer verified patio & mailbox: parcel not found.",
      "Automated troubleshooting exhausted without resolution.",
      "Ticket #RES-8924 created with Priority: High.",
    ],
  },
  {
    step: 6,
    title: "6. Zero-Context Human Handoff",
    subtitle: "Live session smoothly transferred to available operator Sarah",
    chatAction: "AI Agent: 'I'm connecting you right now with Sarah on our Priority Resolution Desk. She has your full history.'",
    aiThought: "Transferring active WebSocket session. Compiling executive briefing summary so Sarah has instant context.",
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Frustrated -> Reassured",
    sentimentScore: 60,
    ragDoc: "Carrier_SOP_2026_Missing_Parcels.pdf",
    ragSimilarity: "0.98",
    ticketStatus: "Assigned to Sarah Miller",
    humanDeskStatus: "Human Active on Chat",
    summaryBullets: [
      "Zero customer repetition: Human agent briefed before first keystroke.",
      "Live chat session transferred with zero dropped messages.",
    ],
  },
  {
    step: 7,
    title: "7. Agent Briefing & 1-Click Resolution",
    subtitle: "Human agent reviews briefing and authorizes overnight replacement",
    chatAction: "Sarah (Human): 'Hi Alex! I see FedEx delivered to 14B instead of 14A. I just authorized an immediate overnight replacement!'",
    aiThought: "Resolution confirmed. Customer awarded 5/5 ⭐ CSAT. Ticket marked Resolved with zero delay.",
    intent: "Order Delivery Issue",
    intentConfidence: "99.4%",
    sentiment: "Delighted (Satisfied)",
    sentimentScore: 12,
    ragDoc: "Resolution_Playbook.md",
    ragSimilarity: "0.99",
    ticketStatus: "Resolved in 1m 20s",
    humanDeskStatus: "Case Closed (CSAT 5/5 ⭐)",
    summaryBullets: [
      "Problem resolved in 1 minute 20 seconds total human time.",
      "Overnight replacement dispatched via 1-click action.",
      "Customer satisfaction score: 5/5 ⭐.",
    ],
  },
]

export function SimulatorTab() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= SIMULATOR_STEPS.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 2500)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const step = SIMULATOR_STEPS[currentStep]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="ai" className="mb-2 text-xs font-semibold px-2.5 py-0.5">
            <Sparkles className="size-3.5 mr-1" />
            Hackathon Execution Workflow
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            End-to-End Agentic Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Experience the exact problem scenario step-by-step: Customer reports missing delivered parcel → LLM comprehension → Intent classification → RAG lookup → Smart troubleshooting → Automated escalation → Zero-context handoff → 1-Click resolution.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsPlaying(false)
              setCurrentStep(0)
            }}
            className="rounded-xl text-xs h-9 px-3"
          >
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs h-9 px-4 font-semibold shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="size-3.5 mr-1 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="size-3.5 mr-1 fill-white" /> Autoplay Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step Progress Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SIMULATOR_STEPS.map((s, idx) => {
          const isActive = idx === currentStep
          const isDone = idx < currentStep

          return (
            <button
              key={s.step}
              onClick={() => {
                setIsPlaying(false)
                setCurrentStep(idx)
              }}
              className={`p-3 rounded-2xl text-left transition-all border text-xs cursor-pointer ${
                isActive
                  ? "border-[#2563EB] bg-blue-50/70 shadow-xs ring-2 ring-[#2563EB]/15"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? "text-[#2563EB]"
                      : isDone
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  Step {s.step}
                </span>
                {isDone && <CheckCircle2 className="size-3 text-emerald-600" />}
              </div>
              <div className="font-extrabold text-[#0F172A] text-xs line-clamp-1">
                {s.title.split(". ")[1]}
              </div>
            </button>
          )
        })}
      </div>

      {/* Main 2-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Interaction & Thought Trace (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-2">
              <Bot className="size-4 text-[#2563EB]" />
              <span>Conversational State</span>
            </span>
            <Badge variant="outline" className="text-[10px]">
              Step {step.step} of 7
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Chat Action
            </span>
            <p className="text-slate-900 font-medium text-sm leading-relaxed">
              {step.chatAction}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50/70 border border-[#8B5CF6]/30 space-y-1.5 text-xs font-mono">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              <span>Autonomous Reasoning &amp; Decision Logic</span>
            </span>
            <p className="text-slate-800 leading-relaxed text-[11px]">
              {step.aiThought}
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="rounded-xl text-xs h-9 px-3"
            >
              Previous Step
            </Button>
            <Button
              size="sm"
              disabled={currentStep === SIMULATOR_STEPS.length - 1}
              onClick={() =>
                setCurrentStep((prev) => Math.min(SIMULATOR_STEPS.length - 1, prev + 1))
              }
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs h-9 px-4 font-semibold shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right: Live Diagnostics Telemetry (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="size-4 text-[#8B5CF6]" />
              <span>Real-Time Diagnostic Gauges</span>
            </span>
            <Badge variant="ai" className="text-[10px]">
              Active Inference
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Detected Intent
              </span>
              <div className="font-extrabold text-slate-900 truncate">{step.intent}</div>
              <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                Confidence: {step.intentConfidence}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Customer Sentiment
              </span>
              <div className="font-extrabold text-slate-900">{step.sentiment}</div>
              <span className="text-[10px] text-red-600 font-semibold font-mono">
                Frustration Score: {step.sentimentScore}/100
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Grounded RAG Doc
              </span>
              <div className="font-extrabold text-[#2563EB] truncate text-[11px]">
                {step.ragDoc}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Cosine Match: {step.ragSimilarity}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Escalation Ticket
              </span>
              <div className="font-extrabold text-slate-900 truncate text-[11px]">
                {step.ticketStatus}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">
                Status: {step.humanDeskStatus}
              </span>
            </div>
          </div>

          {/* Running Briefing Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Agent Briefing State
            </span>
            <ul className="space-y-1">
              {step.summaryBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-xs">
                  <span className="text-[#2563EB] font-bold">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
