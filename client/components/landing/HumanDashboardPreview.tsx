"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Sparkles,
  Headphones,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  User,
  ShieldCheck,
  Search,
  Sliders,
  AlertTriangle,
  FileText,
  BadgeAlert,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function HumanDashboardPreview() {
  return (
    <section id="handoff" className="py-20 lg:py-28 bg-white border-y border-[#E2E8F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <Headphones className="size-3.5 mr-1 text-[#8B5CF6]" />
            Human Agent Dashboard & Handover Experience
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Zero Context Loss. When Humans Take Over, They Already Know Everything.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Never make frustrated customers repeat their story. ResolveAI prepares a comprehensive executive briefing, sentiment trendline, and instant 1-click resolutions for the human team.
          </p>
        </div>

        {/* Realistic Dashboard Mockup */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-6 shadow-xl shadow-slate-200/50">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-sm">
                <LayoutDashboard className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">ResolveAI Support Command</span>
                  <Badge variant="success" className="text-[10px]">
                    Live Queue: 3 Waiting
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">Agent: Sarah Miller • Senior Resolution Specialist</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-slate-600">
                <Clock className="size-3.5 text-[#2563EB]" />
                Avg Human Resolution: <strong className="text-slate-900">1m 15s</strong>
              </div>
              <Button size="sm" className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] rounded-xl text-xs font-semibold">
                Available (Auto-Accept)
              </Button>
            </div>
          </div>

          {/* 3-Pane Dashboard View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Pane: Ticket Queue (3 cols) */}
            <div className="lg:col-span-3 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Escalated Queue
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sorted by Urgency</span>
              </div>

              {/* Active Ticket */}
              <div className="rounded-xl border-2 border-[#2563EB] bg-white p-3.5 shadow-sm space-y-1.5 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2563EB]">Ticket #RES-8924</span>
                  <Badge variant="ai" className="text-[10px] px-1.5 py-0">
                    High Priority
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-[#0F172A] line-clamp-1">
                  Missing Package #7741-CA
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Alex Vance</span>
                  <span className="text-red-500 font-medium">Frustrated (78%)</span>
                </div>
              </div>

              {/* Secondary Ticket */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white/70 p-3.5 space-y-1.5 hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Ticket #RES-8923</span>
                  <span className="text-[10px] text-slate-400">Medium</span>
                </div>
                <div className="text-xs text-slate-800 line-clamp-1">
                  Subscription Cancellation Refund
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Elena Gomez</span>
                  <span className="text-amber-500">Neutral (44%)</span>
                </div>
              </div>

              {/* Third Ticket */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white/70 p-3.5 space-y-1.5 hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Ticket #RES-8920</span>
                  <span className="text-[10px] text-slate-400">Low</span>
                </div>
                <div className="text-xs text-slate-800 line-clamp-1">
                  API Key Rate Limit Increase
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>TechNova Inc.</span>
                  <span className="text-emerald-500">Satisfied (22%)</span>
                </div>
              </div>
            </div>

            {/* Center Pane: Active Customer Chat Timeline (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-[#E2E8F0] bg-white p-4 flex flex-col justify-between shadow-xs min-h-[420px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      AV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F172A]">Alex Vance</div>
                      <div className="text-[10px] text-slate-500">Order #7741-CA • Delivery Missing</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">
                    Handed to Human
                  </Badge>
                </div>

                {/* Conversation History Stream */}
                <div className="space-y-3 text-xs max-h-[290px] overflow-y-auto pr-1">
                  <div className="text-center text-[10px] text-slate-400 my-1">
                    AI Agent Handled (12:14 PM - 12:16 PM)
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-slate-700 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500">Customer</div>
                    <p>&quot;My order shows delivered, but I haven&apos;t received it.&quot;</p>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 text-slate-800 space-y-1">
                    <div className="text-[10px] font-semibold text-[#2563EB] flex items-center gap-1">
                      <Sparkles className="size-3 text-[#8B5CF6]" />
                      ResolveAI Autonomous Agent
                    </div>
                    <p>Guided customer to inspect back patio & verified delivery photo with courier coordinates.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-slate-700 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500">Customer</div>
                    <p>&quot;I checked rear patio and mailbox, nothing is there.&quot;</p>
                  </div>

                  <div className="p-2 rounded-xl bg-violet-50 border border-[#8B5CF6]/30 text-xs text-[#7C3AED] flex items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>AI auto-escalated with pre-authorized replacement suggestion.</span>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-slate-900 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700">Sarah Miller (You)</div>
                    <p>&quot;Hi Alex! I see FedEx delivered to 14B instead of 14A. I just authorized an immediate overnight replacement!&quot;</p>
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message to Alex Vance..."
                  className="flex-1 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  defaultValue="Tracking for the replacement order has been sent to your email!"
                />
                <Button size="sm" className="bg-[#2563EB] text-white rounded-xl px-3">
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Right Pane: AI Summary & 1-Click Action Hub (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-[#8B5CF6]/30 bg-white p-4 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                  <Sparkles className="size-4 text-[#8B5CF6]" />
                  AI Context Briefing
                </div>
                <Badge variant="ai" className="text-[10px]">
                  99% Accuracy
                </Badge>
              </div>

              {/* 3-Bullet Summary */}
              <div className="rounded-xl bg-slate-50 p-3 border border-[#E2E8F0] space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  AI-Generated Summary
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#8B5CF6] mt-1 shrink-0" />
                    <span><strong>Problem:</strong> Package marked delivered 11:42 AM, missing on site.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#8B5CF6] mt-1 shrink-0" />
                    <span><strong>Attempted:</strong> Customer verified porch & locker; no parcel found.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#8B5CF6] mt-1 shrink-0" />
                    <span><strong>Root Cause:</strong> Geotag mismatch indicates adjacent building drop.</span>
                  </li>
                </ul>
              </div>

              {/* Sentiment Trend */}
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>SENTIMENT TRAJECTORY</span>
                  <span className="text-emerald-600 font-bold">Turnaround: +62%</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-red-400 w-1/4 h-full" />
                    <div className="bg-amber-400 w-1/4 h-full" />
                    <div className="bg-emerald-500 w-2/4 h-full" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-700">Delighted</span>
                </div>
              </div>

              {/* One-Click Resolution Actions */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Actions
                </span>
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-[#2563EB]/30 hover:bg-blue-100/70 text-xs text-[#2563EB] font-semibold transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5" />
                    Approve Free Reshipment
                  </span>
                  <span className="text-[10px] font-mono font-normal">Executed</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-medium transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="size-3.5 text-slate-500" />
                    File Carrier Claim #FX-9921
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">1-click</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
