"use client"

import * as React from "react"
import { Check, X, Sparkles, AlertCircle, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const COMPARISON_ROWS = [
  {
    capability: "Problem Resolution Approach",
    traditional: "Spits out canned text links and tells users to read the FAQ",
    resolveAi: "Guides active step-by-step verification and troubleshoots directly",
  },
  {
    capability: "Knowledge Grounding (RAG)",
    traditional: "Static keyword triggers or generic LLM hallucinations",
    resolveAi: "Direct vector search across internal policies, carrier SOPs & manuals",
  },
  {
    capability: "Intent & Sentiment Tracking",
    traditional: "Blind to emotional tone; ignores customer frustration",
    resolveAi: "Real-time frustration scoring with priority escalation triggers",
  },
  {
    capability: "Human Agent Escalation",
    traditional: "Drops chat abruptly; customer repeats entire story to human",
    resolveAi: "Zero-context-loss handoff with 3-bullet AI executive summary",
  },
  {
    capability: "Ticket Management",
    traditional: "Manual copy-pasting by frustrated human reps",
    resolveAi: "Automated ticket provisioning with order IDs and full audit trail",
  },
  {
    capability: "Customer Experience & CSAT",
    traditional: "Frustrating endless loops, high abandonment rate",
    resolveAi: "Fast, empathetic, 4.9/5 satisfaction with immediate next steps",
  },
]

export function ComparisonSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <Sparkles className="size-3.5 mr-1 text-[#8B5CF6]" />
            The Paradigm Shift
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Why Legacy Chatbots Fail &amp; How ResolveAI Wins
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Customers dread robotic chat scripts. ResolveAI replaces frustrating loops with an autonomous agentic workflow designed for real resolutions.
          </p>
        </div>

        {/* Table / Grid Comparison */}
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-lg shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#E2E8F0] bg-slate-50/80 p-4 sm:p-6 text-sm font-bold text-[#0F172A]">
            <div className="md:col-span-4 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              Support Capability
            </div>
            <div className="md:col-span-4 text-slate-500 flex items-center gap-1.5 mt-2 md:mt-0">
              <span className="size-2 rounded-full bg-red-400" />
              Traditional Canned Bots
            </div>
            <div className="md:col-span-4 text-[#2563EB] flex items-center gap-1.5 mt-2 md:mt-0">
              <Sparkles className="size-4 text-[#8B5CF6]" />
              ResolveAI Agentic Workflow
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 text-sm hover:bg-slate-50/50 transition-colors items-center gap-3 md:gap-0"
              >
                <div className="md:col-span-4 font-semibold text-[#0F172A]">
                  {row.capability}
                </div>
                <div className="md:col-span-4 text-slate-500 flex items-start gap-2 pr-4 text-xs sm:text-sm">
                  <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="md:col-span-4 text-slate-900 font-medium flex items-start gap-2 text-xs sm:text-sm bg-blue-50/40 md:bg-transparent p-2.5 md:p-0 rounded-xl">
                  <Check className="size-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{row.resolveAi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
