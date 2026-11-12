"use client"

import * as React from "react"
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle Ambient Light Orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-[#8B5CF6]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-violet-300 border border-white/10 backdrop-blur-xs">
              <Sparkles className="size-3.5 text-[#8B5CF6]" />
              Automate Support Today with Agentic Workflows
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Stop Answering FAQs. Start Resolving Customer Problems.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Experience the combination of high-speed LLM reasoning, smart friction detection, and zero-repetition human escalation. Boost resolution rates while your human team focuses on high-impact customer care.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base px-8 h-12 shadow-lg shadow-[#2563EB]/30 rounded-xl"
                >
                  Launch Live Support Desk
                  <ArrowRight className="size-4.5 ml-2" />
                </Button>
              </a>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 text-base h-12 rounded-xl"
                >
                  View Human Agent Inbox
                </Button>
              </a>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" />
                No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-[#8B5CF6]" />
                Zero-Context-Loss Escalation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-[#2563EB]" />
                Full SOC2 &amp; GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
