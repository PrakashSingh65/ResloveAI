"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bot,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Headphones,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-[#2563EB]" />
        <p className="mt-3 text-xs text-slate-500 font-medium">
          Loading dashboard session...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#2563EB]/15 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      {/* Top Header */}
      <header className="relative z-40 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md sticky top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg p-1 transition-transform"
          >
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] text-white shadow-md shadow-[#2563EB]/25 transition-transform group-hover:scale-105">
              <Bot className="size-5.5 text-white" />
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-[#8B5CF6]"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                  Resolve<span className="text-[#2563EB]">AI</span>
                </span>
                <Badge
                  variant="ai"
                  className="hidden sm:inline-flex text-[10px] py-0 px-2 font-semibold"
                >
                  Console
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden md:block">
                AI Support with Smart Human Handoff
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold text-slate-700 hover:text-[#2563EB] rounded-xl border-slate-200 h-9"
              >
                Landing Page
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-3 flex items-center gap-1.5 transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 className="size-3.5 animate-spin text-red-600" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Welcome Banner */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm shadow-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-[#2563EB]">
                <Sparkles className="size-3.5" />
                <span>Agentic Workspace Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Welcome back, {user?.first_name || "Operator"}!
              </h1>
              <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                Your autonomous support agent is live and monitoring incoming conversations with active RAG grounding and smart escalation protocols.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/#simulator">
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl h-10 px-4 shadow-sm shadow-[#2563EB]/25 flex items-center gap-2">
                  <Activity className="size-4" />
                  <span>Launch Live Simulator</span>
                </Button>
              </Link>
              <Link href="/#handoff">
                <Button variant="outline" className="border-slate-200 text-slate-700 font-semibold rounded-xl h-10 px-4 flex items-center gap-2">
                  <Headphones className="size-4 text-[#8B5CF6]" />
                  <span>Human Handoff Desk</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
              <span className="text-xs font-medium text-slate-500">Autonomous Resolution</span>
              <div className="text-3xl font-black text-[#0F172A]">72.4%</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>↑ 4.2%</span>
                <span className="text-slate-400 font-normal">vs manual triage</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
              <span className="text-xs font-medium text-slate-500">Avg First Response</span>
              <div className="text-3xl font-black text-[#2563EB]">0.8s</div>
              <div className="text-[11px] text-slate-500">Real-time LLM inference</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
              <span className="text-xs font-medium text-slate-500">Context Retention</span>
              <div className="text-3xl font-black text-[#8B5CF6]">100%</div>
              <div className="text-[11px] text-slate-500">Zero-loss human handoffs</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
              <span className="text-xs font-medium text-slate-500">Account Security</span>
              <div className="text-3xl font-black text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="size-7" />
                <span>Verified</span>
              </div>
              <div className="text-[11px] text-slate-500">JWT Token Rotation Active</div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <User className="size-4 text-[#2563EB]" />
              <span>Operator Profile Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Full Name</span>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : "Not specified"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Email Address</span>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user?.email || "Active User"}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Location</span>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span>{user?.city ? `${user.city}, ${user.country}` : user?.country || "Global"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-[#E2E8F0] bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ResolveAI Inc.</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <Link href="/#simulator" className="hover:text-slate-800 transition-colors">
              Simulator
            </Link>
            <Link href="/#handoff" className="hover:text-slate-800 transition-colors">
              Handoff Desk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
