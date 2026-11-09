"use client"

import * as React from "react"
import { Bot, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E2E8F0]">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-md shadow-[#2563EB]/20">
                <Bot className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                Resolve<span className="text-[#2563EB]">AI</span>
              </span>
              <Badge variant="ai" className="text-[10px] py-0 px-2 font-semibold">
                Agentic SaaS
              </Badge>
            </div>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Autonomous customer support platform powered by LLMs, RAG knowledge retrieval, and intelligent human escalation. Built to solve problems, not just chat.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Agent Systems Operational</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400">
              Architecture: <strong className="text-slate-600 font-medium">AI + Full Stack + Agentic Workflow</strong>
            </div>
          </div>

          {/* Product Capabilities (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Platform Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#simulator" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 group">
                  <span>Autonomous Troubleshooting</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 group">
                  <span>RAG Knowledge Grounding</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 group">
                  <span>Intent &amp; Sentiment Telemetry</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                </a>
              </li>
              <li>
                <a href="#handoff" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 group">
                  <span>Smart Escalation &amp; Handoff</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                </a>
              </li>
              <li>
                <a href="#handoff" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 group">
                  <span>Human Agent Command Center</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2563EB]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Use Cases & Solutions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">E-Commerce Delivery</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">SaaS Subscription Support</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">Hardware Diagnostics</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">Carrier Claim Automation</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">Billing &amp; Refund Approvals</span>
              </li>
            </ul>
          </div>

          {/* Resources & Security (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Enterprise
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Zero Context Loss</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-[#2563EB] shrink-0" />
                <span>Hallucination Guardrails</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-[#8B5CF6] shrink-0" />
                <span>SOC2 Type II Ready</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-slate-500 shrink-0" />
                <span>GDPR &amp; CCPA Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ResolveAI. Built with modern agentic workflows &amp; shadcn/ui.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-[#2563EB] transition-colors">
              Documentation
            </a>
            <span className="text-slate-300">•</span>
            <a href="#architecture" className="hover:text-[#2563EB] transition-colors">
              Architecture Spec
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">
              Powered by LLMs &amp; Hybrid RAG
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
