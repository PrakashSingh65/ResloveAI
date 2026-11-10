"use client"

import * as React from "react"
import {
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCcw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TROUBLESHOOTING_NODES } from "./dashboard-data"
import { TroubleshootingFlowNode } from "./types"

export function TroubleshootingFlowView() {
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<
    "missing_delivery" | "duplicate_billing" | "damaged_item"
  >("missing_delivery")
  const [activeNode, setActiveNode] = React.useState<TroubleshootingFlowNode>(TROUBLESHOOTING_NODES[3])
  const [activeTestStep, setActiveTestStep] = React.useState<number | null>(null)
  const [isRunningTest, setIsRunningTest] = React.useState(false)

  const handleRunTest = () => {
    setIsRunningTest(true)
    setActiveTestStep(0)
    let current = 0

    const timer = setInterval(() => {
      current += 1
      if (current >= TROUBLESHOOTING_NODES.length) {
        clearInterval(timer)
        setIsRunningTest(false)
        setActiveTestStep(TROUBLESHOOTING_NODES.length - 1)
      } else {
        setActiveTestStep(current)
        setActiveNode(TROUBLESHOOTING_NODES[current])
      }
    }, 900)
  }

  const handleResetTest = () => {
    setIsRunningTest(false)
    setActiveTestStep(null)
    setActiveNode(TROUBLESHOOTING_NODES[3])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="ai" className="mb-2 text-xs font-semibold px-2.5 py-0.5">
            <GitBranch className="size-3.5 mr-1" />
            Agentic Diagnostic Trees
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Smart Troubleshooting Flow Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            ResolveAI guides users through intelligent, multi-step verification procedures before escalating. If a verification fails or exceeds customer patience thresholds, it triggers instant human handoff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRunningTest ? (
            <Button
              variant="outline"
              onClick={handleResetTest}
              className="rounded-xl text-xs h-10 px-4 font-semibold text-red-600 border-red-200"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Stop Test
            </Button>
          ) : (
            <Button
              onClick={handleRunTest}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs h-10 px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="size-3.5 fill-white" />
              <span>Simulate Flow Execution</span>
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedWorkflow("missing_delivery")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            selectedWorkflow === "missing_delivery"
              ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          📦 Missing Delivery & Doorstep Protocol (Hackathon Showcase)
        </button>
        <button
          onClick={() => setSelectedWorkflow("duplicate_billing")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            selectedWorkflow === "duplicate_billing"
              ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          💳 Duplicate Charge & Gateway Idempotency Flow
        </button>
        <button
          onClick={() => setSelectedWorkflow("damaged_item")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            selectedWorkflow === "damaged_item"
              ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          ⚠️ In-Transit Damaged Goods & Immediate Reship
        </button>
      </div>

      {/* Main Flowchart & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Pipeline Nodes (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Interactive Execution Pipeline
            </span>
            <span className="text-[11px] text-slate-400">
              Click any node to inspect agent logic & threshold
            </span>
          </div>

          <div className="space-y-3 relative">
            {TROUBLESHOOTING_NODES.map((node, index) => {
              const isSelected = activeNode.id === node.id
              const isSimulatingActive = activeTestStep === index

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSimulatingActive
                      ? "border-[#2563EB] bg-blue-50/80 ring-2 ring-[#2563EB] scale-[1.02] shadow-md"
                      : isSelected
                      ? "border-[#2563EB] bg-blue-50/40 shadow-xs ring-1 ring-[#2563EB]/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSimulatingActive
                            ? "bg-[#2563EB] text-white animate-pulse"
                            : node.isAutomated
                            ? "bg-violet-100 text-[#7C3AED]"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-[#0F172A]">
                        {node.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={node.isAutomated ? "ai" : "success"}
                        className="text-[10px] py-0 px-2 font-semibold hidden sm:inline-flex"
                      >
                        {node.isAutomated ? "Autonomous AI" : "Human Desk"}
                      </Badge>
                      <ArrowRight className="size-3.5 text-slate-400" />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 pl-9.5">
                    {node.description}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 pl-9.5 pt-2 border-t border-slate-200/50 font-mono">
                    <span>Success Rate: <strong className="text-slate-800">{node.successRate}</strong></span>
                    <span>Avg Latency: <strong className="text-[#2563EB]">{node.avgTime}</strong></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Node Inspector Details (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-extrabold text-xs text-[#0F172A]">
              <Info className="size-4 text-[#2563EB]" />
              <span>Diagnostic Node Inspector</span>
            </div>
            <Badge variant="ai" className="text-[10px]">
              Active Step
            </Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Step Name
              </span>
              <h4 className="text-base font-extrabold text-[#0F172A] mt-0.5">
                {activeNode.title}
              </h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            {/* Prompt Instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans block">
                LLM Operational Directive
              </span>
              <p className="text-slate-800">
                &quot;Analyze customer coordinates against courier safe-drop telemetry. Prompt user with non-technical physical check choices. If patio check returns negative within 60s, transition state to ESCALATION_TRIGGER.&quot;
              </p>
            </div>

            {/* Fail-Safe Condition */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5 text-[11px]">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-amber-600" />
                <span>Fail-Safe Escalation Condition</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                If customer responds with words like &quot;not there&quot;, &quot;checked&quot;, or if sentiment score exceeds 75/100, bypass remaining self-service loops immediately to avoid customer fatigue.
              </p>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Step Completion</span>
                <span className="text-lg font-bold text-emerald-600">{activeNode.successRate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block">Execution Time</span>
                <span className="text-lg font-bold text-[#2563EB]">{activeNode.avgTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Handoff Protocol: Zero Context Loss</span>
              <span className="text-emerald-600 font-semibold">Active & Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
