"use client"

import * as React from "react"
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  FileText,
  Activity,
  Bot,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Hero Ambient Focal Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[520px] w-[760px] rounded-full bg-gradient-to-tr from-[#2563EB]/15 via-[#8B5CF6]/12 to-transparent blur-3xl opacity-80 animate-pulse-subtle" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <Badge
            variant="ai"
            className="px-3.5 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm"
          >
            <Sparkles className="size-3.5 text-[#8B5CF6] mr-1" />
            AI + Full Stack + Agentic Workflow
          </Badge>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
            •
          </span>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-[#E2E8F0] px-3 py-1 rounded-full shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Hackathon Production Ready
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
            An AI Support Agent That{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                Actually Resolves
              </span>
            </span>{" "}
            Problems, Not Just Chats.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            Automate issue resolution with intelligent AI diagnostics and seamless, zero-repetition human handoffs.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a href="#simulator" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/25 font-semibold text-base px-8 h-12"
              >
                Launch Live Simulator
                <ArrowRight className="size-4.5 ml-2" />
              </Button>
            </a>
            <a href="#handoff" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-[#E2E8F0] hover:border-slate-300 text-[#0F172A] hover:bg-white text-base h-12 font-medium"
              >
                <UserCheck className="size-4.5 text-[#8B5CF6] mr-2" />
                View Human Handoff Desk
              </Button>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#2563EB]" />
              <span>Zero Context Loss Escalation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#8B5CF6]" />
              <span>AI Diagnostic Policies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Live Sentiment & Intent Telemetry</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Mockup: Dual View (Customer Conversation + Agent Brain) */}
        <div className="mt-14 relative mx-auto max-w-5xl">
          {/* Outer Card with Glassmorphic Accent Border */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5">
            {/* Window Topbar */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 px-2 sm:px-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-red-400" />
                  <span className="size-3 rounded-full bg-amber-400" />
                  <span className="size-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-400">
                  resolve-agent-orchestrator :: live-session #RES-8924
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="ai" className="text-[11px] font-medium">
                  <Sparkles className="size-3 mr-1 text-[#8B5CF6]" />
                  Agent State: Resolving
                </Badge>
              </div>
            </div>

            {/* Split Screen Grid: Customer View vs Agentic Reasoner View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Customer Conversation Experience (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-[#F8FAFC] p-4 sm:p-5 border border-[#E2E8F0]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-xs border border-[#2563EB]/20">
                        RA
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                          ResolveAI Support Bot
                          <span className="size-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-xs text-slate-500">Autonomous Concierge</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono">
                      Order #7741-CA
                    </Badge>
                  </div>

                  {/* Customer Message */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#2563EB] px-4 py-3 text-sm text-white shadow-sm">
                      <p className="font-medium">
                        "My order shows delivered, but I haven&apos;t received it."
                      </p>
                      <span className="block mt-1 text-[10px] text-blue-100 text-right">
                        12:14 PM • Verified Customer
                      </span>
                    </div>
                  </div>

                  {/* AI Response with Step-by-Step Guidance */}
                  <div className="flex items-start gap-2.5">
                    <div className="size-7 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                      <Bot className="size-4" />
                    </div>
                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white border border-[#E2E8F0] p-4 text-sm text-[#0F172A] shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#8B5CF6] flex items-center gap-1">
                          <Sparkles className="size-3" />
                          ResolveAI Intelligent Assistant
                        </span>
                        <span className="text-[10px] text-slate-400">12:14 PM</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        I understand how frustrating it is when a parcel shows as delivered. Let me help you verify what happened right away.
                      </p>
                      <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs space-y-1.5">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-[#2563EB]" />
                          Step 1: Check Safe Drop & Neighbor verification
                        </div>
                        <p className="text-slate-600">
                          Couriers frequently mark packages safe at rear porches, mail lockers, or with front desks. Did you have a chance to check these spots?
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition cursor-pointer">
                          I checked, nothing there
                        </button>
                        <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition cursor-pointer">
                          Where was photo taken?
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                  <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>Type your response or select verification step...</span>
                    <Sparkles className="size-3.5 text-[#8B5CF6]" />
                  </div>
                  <Button size="sm" className="bg-[#2563EB] text-white rounded-xl px-3.5">
                    Send
                  </Button>
                </div>
              </div>

              {/* Right Column: AI Agent Telemetry & Reasoning Hub (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-3.5 rounded-2xl bg-white p-4 sm:p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-[#8B5CF6]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Agentic Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Confidence: 98.4%
                  </span>
                </div>

                {/* Intent & Sentiment Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Intent Detection
                    </span>
                    <span className="text-xs font-bold text-[#2563EB] mt-0.5 block">
                      Order Delivery Missing
                    </span>
                    <span className="text-[10px] text-slate-500">Category: Logistics</span>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-50/70 border border-[#8B5CF6]/20">
                    <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wider block">
                      Sentiment Metric
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-slate-800">Frustrated (0.76)</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Urgency: Elevated</span>
                  </div>
                </div>

                {/* Diagnostic Policy Verification */}
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="size-3.5 text-[#8B5CF6]" />
                      Diagnostic Policy Verification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Policy Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                    &quot;Standard Carrier SOP #Clause-4.2&quot;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Rule triggered: If doorstep check is negative, prepare briefing &amp; handoff to human desk.
                  </p>
                </div>

                {/* Auto-Handoff Trigger Status */}
                <div className="mt-auto p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 border border-[#8B5CF6]/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Zap className="size-3.5 text-[#8B5CF6]" />
                      Escalation Readiness
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Summary generated, ready for Human Handoff
                    </p>
                  </div>
                  <Badge variant="ai" className="font-mono text-[10px]">
                    Auto-Handoff
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-xs">
            <div className="text-3xl font-extrabold text-[#2563EB]">72%</div>
            <div className="text-xs font-semibold text-slate-800 mt-1">Autonomous Resolution</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Resolved without human intervention</div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-xs">
            <div className="text-3xl font-extrabold text-[#8B5CF6]">&lt; 300ms</div>
            <div className="text-xs font-semibold text-slate-800 mt-1">Diagnostic Latency</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Instant triage &amp; escalation evaluation</div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-xs">
            <div className="text-3xl font-extrabold text-[#2563EB]">100%</div>
            <div className="text-xs font-semibold text-slate-800 mt-1">Context Retention</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero customer repetition on handoff</div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-xs">
            <div className="text-3xl font-extrabold text-emerald-600">4.9 / 5</div>
            <div className="text-xs font-semibold text-slate-800 mt-1">Customer CSAT Rating</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Based on instant problem solving</div>
          </div>
        </div>
      </div>
    </section>
  )
}
