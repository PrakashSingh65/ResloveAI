"use client"

import * as React from "react"
import Link from "next/link"
import { Bot, LogIn, LayoutDashboard, LogOut, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
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
                Agentic SaaS
              </Badge>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden md:block">
              AI Support with Smart Human Handoff
            </span>
          </div>
        </Link>

        {/* Right Actions: Authenticated vs Guest */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Optional user greeting pill */}
              {user?.first_name && (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80">
                  <User className="size-3.5 text-[#2563EB]" />
                  <span>{user.first_name}</span>
                </div>
              )}

              {/* Dashboard Navigate Button */}
              <Link href="/dashboard">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-[#2563EB]/20 font-semibold h-9 px-3.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 h-9 px-3 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                aria-label="Log out of account"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-3.5 animate-spin text-red-600" />
                ) : (
                  <LogOut className="size-3.5" />
                )}
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-[#2563EB]/20 font-semibold h-9 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <LogIn className="size-3.5 mr-1" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
