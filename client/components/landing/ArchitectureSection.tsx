"use client"

import * as React from "react"
import {
  Layers,
  Cpu,
  Database,
  ArrowRight,
  GitBranch,
  Shield,
  Zap,
  Server,
  Code2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function ArchitectureSection() {
  const layers = [
    {
      step: "01",
      name: "Conversational Ingestion",
      tech: "Next.js 16 • WebSockets • Base UI",
      desc: "Streams multi-modal customer inquiries with sub-50ms render latency and cross-device persistence.",
      icon: Code2,
      accent: "text-[#2563EB]",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      step: "02",
      name: "Intent & Sentiment Telemetry",
      tech: "Classifier LLM • Valence Analyzer",
      desc: "Decomposes requests into domain intents (e.g. lost shipment, billing) while monitoring emotional frustration.",
      icon: Cpu,
      accent: "text-[#8B5CF6]",
      bg: "bg-violet-50 border-violet-200",
    },
    {
      step: "03",
      name: "RAG Document Retrieval",
      tech: "Vector DB • Dense Embeddings • Reranker",
      desc: "Extracts grounded policies and carrier rules directly from enterprise SOPs to prevent hallucinations.",
      icon: Database,
      accent: "text-[#2563EB]",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      step: "04",
      name: "Agentic Decision & Troubleshooting",
      tech: "LangChain / State Machine • DAG Engine",
      desc: "Sequences interactive diagnostic checklists and dynamically branches based on customer responses.",
      icon: GitBranch,
      accent: "text-[#8B5CF6]",
      bg: "bg-violet-50 border-violet-200",
    },
    {
      step: "05",
      name: "Smart Escalation & Ticket Sync",
      tech: "REST / Webhooks • CRM Connectors",
      desc: "Auto-provisions structured support tickets and delivers complete contextual summaries to human desks.",
      icon: Server,
      accent: "text-[#2563EB]",
      bg: "bg-blue-50 border-blue-200",
    },
  ]

  return (
    <section id="architecture" className="py-20 lg:py-28 bg-white border-t border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <Layers className="size-3.5 mr-1 text-[#8B5CF6]" />
            Full Stack &amp; Agentic System Design
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Engineered For Scale, Speed, and Zero Hallucination
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A production-grade architecture combining state-of-the-art LLM reasoning with real-time vector retrieval and human escalation protocols.
          </p>
        </div>

        {/* Linear Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {layers.map((layer, idx) => {
            const Icon = layer.icon
            return (
              <div
                key={layer.step}
                className="relative rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-xs transition hover:border-[#8B5CF6]/50 hover:bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      LAYER {layer.step}
                    </span>
                    <div className={`p-2 rounded-xl border ${layer.bg}`}>
                      <Icon className={`size-4 ${layer.accent}`} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1">
                    {layer.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[#8B5CF6] mb-2 font-medium">
                    {layer.tech}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>

                {idx < layers.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                    <ArrowRight className="size-4" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
