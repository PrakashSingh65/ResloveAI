"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bot,
  Search,
  Sparkles,
  LogOut,
  ChevronDown,
  Headphones,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  operatorName: string
  operatorStatus: "available" | "busy" | "away"
  onStatusChange: (status: "available" | "busy" | "away") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onSimulateTicket: () => void
  escalatedCount: number
  onLogout?: () => void
}

export function DashboardHeader({
  operatorName,
  operatorStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onSimulateTicket,
  escalatedCount,
  onLogout,
}: DashboardHeaderProps) {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false)

  const statusColors = {
    available: "bg-emerald-500",
    busy: "bg-amber-500",
    away: "bg-slate-400",
  }

  const statusLabels = {
    available: "Available (Auto-Accept)",
    busy: "Busy / High Volume",
    away: "Away / Standby",
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg p-1 transition-transform"
          >
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] text-white shadow-md shadow-[#2563EB]/20 transition-transform group-hover:scale-105">
              <Bot className="size-5 text-white" />
              <span className="absolute -top-1 -right-1 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-[#8B5CF6]"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">
                  Resolve<span className="text-[#2563EB]">AI</span>
                </span>
                <Badge
                  variant="ai"
                  className="hidden md:inline-flex text-[10px] py-0 px-2 font-semibold"
                >
                  Human Console
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden lg:block leading-none">
                Autonomous AI & Smart Handoff Desk
              </span>
            </div>
          </Link>

          {/* Real-time Agent Status Pill */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              aria-label="Agent presence status"
            >
              <span className={`size-2 rounded-full ${statusColors[operatorStatus]} animate-pulse`} />
              <span className="hidden sm:inline">{operatorName}: {statusLabels[operatorStatus]}</span>
              <span className="sm:hidden capitalize">{operatorStatus}</span>
              <ChevronDown className="size-3 text-slate-400" />
            </button>

            {showStatusMenu && (
              <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(["available", "busy", "away"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusChange(s)
                      setShowStatusMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-left transition ${
                      operatorStatus === s ? "bg-blue-50 text-[#2563EB]" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className={`size-2 rounded-full ${statusColors[s]}`} />
                    <span>{statusLabels[s]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by customer, ticket #, order ID, intent..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
            />
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Simulate New Ticket */}
          <Button
            size="sm"
            onClick={onSimulateTicket}
            className="bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1D4ED8] hover:to-[#7C3AED] text-white font-semibold rounded-xl text-xs h-9 px-3 shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Simulate a new incoming customer escalation"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">Simulate Escalation</span>
            <span className="sm:hidden">+ Issue</span>
          </Button>

          {/* Live Queue Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
            <Headphones className="size-3.5 text-amber-600" />
            <span>{escalatedCount} Escalated</span>
          </div>

          {/* Return to Landing */}
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-slate-700 hover:text-[#2563EB] rounded-xl border-slate-200 h-9 px-3 text-xs hidden sm:flex items-center gap-1.5"
            >
              <span>Landing</span>
              <ArrowRight className="size-3" />
            </Button>
          </Link>

          {/* User profile / Logout */}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-2.5 text-xs flex items-center gap-1"
              title="Sign out of console"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
