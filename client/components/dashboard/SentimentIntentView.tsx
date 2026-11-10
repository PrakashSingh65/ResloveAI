"use client"

import * as React from "react"
import {
  BrainCircuit,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Activity,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SentimentIntentView() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="ai" className="mb-2 text-xs font-semibold px-2.5 py-0.5">
            <BrainCircuit className="size-3.5 mr-1" />
            Emotion & Intent Telemetry
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Intent Classification & Sentiment Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            ResolveAI evaluates semantic intent and emotional valence at every conversational turn. Highly frustrated or high-value issues are dynamically bumped to the top of human queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Intent Accuracy</span>
            <span className="text-xl font-extrabold text-[#2563EB]">99.4%</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Frustration Recovery</span>
            <span className="text-xl font-extrabold text-emerald-700">92.8%</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intent Distribution */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Intent Classification Breakdown (Last 24h)
              </h3>
            </div>
            <span className="text-xs text-slate-400">1,248 conversations</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                intent: "Order Delivery & Misplacement",
                percentage: 42,
                color: "bg-[#2563EB]",
                count: "524 cases",
                handoffRate: "28% escalated",
              },
              {
                intent: "Billing & Duplicate Charges",
                percentage: 28,
                color: "bg-[#8B5CF6]",
                count: "350 cases",
                handoffRate: "35% escalated",
              },
              {
                intent: "Technical API & SLA Inquiries",
                percentage: 18,
                color: "bg-emerald-500",
                count: "224 cases",
                handoffRate: "12% escalated",
              },
              {
                intent: "Account Self-Service FAQ",
                percentage: 12,
                color: "bg-slate-400",
                count: "150 cases",
                handoffRate: "2% escalated (98% auto-resolved)",
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${item.color}`} />
                    <span>{item.intent}</span>
                  </span>
                  <span className="font-mono text-slate-900">{item.percentage}% ({item.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Routing: Auto Diagnostic Path</span>
                  <span className="font-semibold text-slate-600">{item.handoffRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion & Sentiment Distribution */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[#8B5CF6]" />
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Customer Sentiment Spectrum
              </h3>
            </div>
            <span className="text-xs text-slate-400">Real-time triage</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                  <Frown className="size-4 text-red-600" />
                  Frustrated / Angry
                </span>
                <span className="text-lg font-black text-red-600 font-mono">24%</span>
              </div>
              <p className="text-[11px] text-red-900 leading-snug">
                Urgency &gt; 75. Prioritized to Senior Human Specialists with pre-approved resolution perks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="size-4 text-amber-600" />
                  Urgent / Anxious
                </span>
                <span className="text-lg font-black text-amber-700 font-mono">18%</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Time-sensitive events. Faster polling and proactive courier tracking queries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Meh className="size-4 text-slate-500" />
                  Neutral / Inquiring
                </span>
                <span className="text-lg font-black text-slate-800 font-mono">46%</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Standard troubleshooting. High candidate for autonomous resolution via RAG.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Smile className="size-4 text-emerald-600" />
                  Delighted / Relieved
                </span>
                <span className="text-lg font-black text-emerald-700 font-mono">12%</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                Immediate resolution without queue delays. Highest CSAT 5-star yield.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study: Sentiment Recovery Trajectory (The Alex Vance Experience) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="size-4 text-[#2563EB]" />
              <span>Real-time Sentiment Trajectory: Case Study #RES-8924</span>
            </h3>
            <span className="text-xs text-slate-500">
              Customer Alex Vance: &quot;My order shows delivered, but I haven&apos;t received it.&quot;
            </span>
          </div>
          <Badge variant="success" className="text-xs">
            100% Sentiment Recovery
          </Badge>
        </div>

        {/* 4-Step Trajectory Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Step 1: Arrival</span>
            <div className="text-lg font-extrabold text-amber-800">Frustrated (72%)</div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Package missing despite tracking confirmation. Customer reports anxiety.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 space-y-1">
            <span className="text-[10px] font-bold text-red-700 uppercase">Step 2: Check Failed</span>
            <div className="text-lg font-extrabold text-red-600">Frustrated (84%)</div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Rear patio check empty. ResolveAI immediately flags escalation threshold.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase">Step 3: Human Takeover</span>
            <div className="text-lg font-extrabold text-[#2563EB]">Reassured (38%)</div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Sarah steps in with zero repeated questions. Pre-authorized replacement ready.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Step 4: 1-Click Resolution</span>
            <div className="text-lg font-extrabold text-emerald-600">Delighted (5/5 ⭐)</div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Overnight replacement tracking dispatched. Customer submits glowing CSAT.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
