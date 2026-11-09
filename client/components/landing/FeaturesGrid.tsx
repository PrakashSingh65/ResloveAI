"use client"

import * as React from "react"
import {
  MessageSquare,
  Database,
  SlidersHorizontal,
  Compass,
  Smile,
  ArrowUpRight,
  Ticket,
  FileText,
  LayoutDashboard,
  Star,
  Sparkles,
  Bot,
  ShieldCheck,
  Check,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeatureItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  tag: string
  highlight?: boolean
  details: string[]
  accentColor: string
}

const FEATURES: FeatureItem[] = [
  {
    id: "chatbot",
    title: "AI Chatbot",
    description: "Answers customer questions naturally with nuanced domain context, conversational memory, and human-level empathy.",
    icon: MessageSquare,
    tag: "Core Conversational Engine",
    highlight: true,
    details: [
      "Multi-turn conversational memory",
      "Tone adaptation based on customer mood",
      "Supports 95+ languages natively",
    ],
    accentColor: "from-[#2563EB] to-[#8B5CF6]",
  },
  {
    id: "rag",
    title: "RAG Knowledge Base",
    description: "Retrieves accurate, hallucination-free answers grounded directly in your company documents, FAQs, and API manuals.",
    icon: Database,
    tag: "Grounded Truth",
    highlight: true,
    details: [
      "Vector semantic search with hybrid reranking",
      "Auto-sync with Notion, Confluence & Zendesk",
      "Inline citation links for trust verification",
    ],
    accentColor: "from-[#8B5CF6] to-[#6366F1]",
  },
  {
    id: "troubleshooting",
    title: "Smart Troubleshooting",
    description: "Guides customers step-by-step through interactive checklists and verification procedures rather than dead-end answers.",
    icon: SlidersHorizontal,
    tag: "Active Problem Solving",
    details: [
      "Interactive click-through diagnostic flows",
      "Dynamic branches based on user responses",
      "Hardware, software & logistics tree logic",
    ],
    accentColor: "from-[#2563EB] to-blue-400",
  },
  {
    id: "intent",
    title: "Intent Detection",
    description: "Instantly parses raw customer language into structured intents (e.g. lost shipment, billing error, warranty claim).",
    icon: Compass,
    tag: "Semantic Routing",
    details: [
      "Sub-millisecond classifier latency",
      "Multi-intent decomposition in complex queries",
      "Custom business taxonomy mapping",
    ],
    accentColor: "from-[#8B5CF6] to-purple-400",
  },
  {
    id: "sentiment",
    title: "Sentiment Analysis",
    description: "Monitors emotional markers, detecting customer frustration and urgency in real-time to trigger priority intervention.",
    icon: Smile,
    tag: "Real-time Telemetry",
    details: [
      "Live frustration and churn risk scoring",
      "Detects subtle sarcasm and polite dissatisfaction",
      "Automatic priority queue escalation",
    ],
    accentColor: "from-amber-500 to-[#8B5CF6]",
  },
  {
    id: "escalation",
    title: "Smart Escalation",
    description: "Autonomously detects when an issue exceeds AI confidence or requires human empathy, routing smoothly without dropping context.",
    icon: ArrowUpRight,
    tag: "Autonomous Guardrails",
    highlight: true,
    details: [
      "Confidence threshold triggers",
      "Specialist skill-based routing",
      "Zero customer re-prompting guarantee",
    ],
    accentColor: "from-[#2563EB] to-[#8B5CF6]",
  },
  {
    id: "ticket",
    title: "Ticket Management",
    description: "Creates, prioritizes, and syncs comprehensive support tickets with full audit trails in Jira, Zendesk, or ResolveAI Desk.",
    icon: Ticket,
    tag: "Ops Automation",
    details: [
      "Automatic priority & SLA assignment",
      "Payload includes device & order metadata",
      "Two-way status synchronization",
    ],
    accentColor: "from-[#2563EB] to-cyan-500",
  },
  {
    id: "summary",
    title: "Conversation Summary",
    description: "Generates concise 3-bullet executive briefs and root causes so human support agents can grasp 20 minutes of chat in 5 seconds.",
    icon: FileText,
    tag: "Agent Supercharger",
    details: [
      "Chronological timeline of customer attempts",
      "Highlighted user sentiment trajectory",
      "Recommended immediate next action",
    ],
    accentColor: "from-[#8B5CF6] to-pink-500",
  },
  {
    id: "dashboard",
    title: "Human Dashboard",
    description: "A high-productivity command center for human agents to monitor live queues, view AI reasoning, and take over with 1 click.",
    icon: LayoutDashboard,
    tag: "Mission Control",
    highlight: true,
    details: [
      "Split-screen live agent takeover",
      "Real-time customer typing preview",
      "AI co-pilot suggested replies",
    ],
    accentColor: "from-[#2563EB] to-indigo-600",
  },
  {
    id: "feedback",
    title: "Feedback System",
    description: "Collects contextual CSAT and CES ratings right after resolution to continuously fine-tune RAG embeddings and agent workflows.",
    icon: Star,
    tag: "Continuous Learning",
    details: [
      "1-tap in-chat micro ratings",
      "Dislike root-cause diagnosis capture",
      "Automated prompt & retrieval tuning loops",
    ],
    accentColor: "from-amber-400 to-[#8B5CF6]",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <Sparkles className="size-3.5 mr-1 text-[#8B5CF6]" />
            Complete Feature Suite
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Built For End-to-End Resolution, Not Superficial Small Talk
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every layer of ResolveAI is engineered to diagnose problems accurately, reference authoritative company knowledge, and empower human agents when human discretion is required.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <Card
                key={feat.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  feat.highlight
                    ? "border-[#8B5CF6]/40 shadow-sm"
                    : "border-[#E2E8F0] hover:border-slate-300"
                }`}
              >
                {/* Accent top gradient on highlighted cards */}
                {feat.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#8B5CF6]" />
                )}

                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr ${feat.accentColor} shadow-md transition-transform group-hover:scale-105`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <Badge
                      variant={feat.highlight ? "ai" : "outline"}
                      className="text-[11px] font-medium"
                    >
                      {feat.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {feat.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {feat.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-2">
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {feat.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="size-3.5 text-[#2563EB] shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
