"use client"

import * as React from "react"
import {
  TrendingUp,
  Clock,
  Sparkles,
  Star,
  FileCheck2,
  Headphones,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MetricsOverviewProps {
  totalTicketsCount: number
  escalatedCount: number
  resolvedCount: number
}

export function MetricsOverview({
  totalTicketsCount,
  escalatedCount,
  resolvedCount,
}: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Autonomous Resolution */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#2563EB]/40 transition group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Autonomous Resolution</span>
          <div className="size-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#0F172A] tracking-tight">73.8%</span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="size-3" />
            +4.8%
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {resolvedCount} of {totalTicketsCount} closed with zero human touch
        </div>
      </div>

      {/* 2. Response Speed */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#2563EB]/40 transition group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Avg First Response</span>
          <div className="size-8 rounded-xl bg-violet-50 text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#2563EB] tracking-tight">0.8s</span>
          <Badge variant="ai" className="text-[10px] py-0 px-1.5 font-bold">
            Realtime
          </Badge>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Sub-second LLM reasoning</div>
      </div>

      {/* 3. Live Escalation Queue */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#2563EB]/40 transition group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Escalated Handoffs</span>
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Headphones className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#0F172A] tracking-tight">{escalatedCount}</span>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
            Active Now
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Avg human resolution: 1m 15s</div>
      </div>

      {/* 4. RAG Precision */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#2563EB]/40 transition group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">RAG Grounding Fidelity</span>
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileCheck2 className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600 tracking-tight">98.6%</span>
          <span className="text-[11px] font-semibold text-slate-500">Cosine &gt; 0.90</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">5 internal policy stores synced</div>
      </div>

      {/* 5. CSAT Satisfaction */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#2563EB]/40 transition group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Customer CSAT</span>
          <div className="size-8 rounded-xl bg-yellow-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Star className="size-4 fill-amber-400 text-amber-500" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#0F172A] tracking-tight">4.89</span>
          <span className="text-xs text-slate-400">/ 5.0</span>
          <span className="text-[11px] font-semibold text-emerald-600">94.2%</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Zero duplicate questioning</div>
      </div>
    </div>
  )
}
