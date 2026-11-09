"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Bot,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authApi, getApiErrorMessage, UserProfile } from "@/lib/api"

function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [user, setUser] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function handleAuth() {
      // 1. Check for error returned by OAuth provider
      const oauthError =
        searchParams.get("error") ||
        searchParams.get("error_description") ||
        searchParams.get("message")

      if (oauthError) {
        if (isMounted) {
          setStatus("error")
          setErrorMessage(oauthError)
        }
        return
      }

      // 2. Extract session verifier or token from URL
      const sessionVerifier =
        searchParams.get("neon_auth_session_verifier") ||
        searchParams.get("token") ||
        searchParams.get("session_token") ||
        ""

      try {
        // 3. Synchronize with backend API
        const response = await authApi.syncGoogleSession(sessionVerifier || undefined)

        if (!isMounted) return

        if (response && response.user) {
          setUser(response.user)
          setStatus("success")

          // Auto-redirect to home or dashboard after 1.5 seconds
          const timer = setTimeout(() => {
            router.push("/")
          }, 1500)

          return () => clearTimeout(timer)
        } else {
          setStatus("error")
          setErrorMessage("Failed to retrieve user profile from Google session.")
        }
      } catch (err) {
        if (!isMounted) return
        setStatus("error")
        setErrorMessage(getApiErrorMessage(err))
      }
    }

    handleAuth()

    return () => {
      isMounted = false
    }
  }, [searchParams, router])

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] p-3 text-white shadow-lg shadow-[#2563EB]/25">
          <Bot className="size-6 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Resolve<span className="text-[#2563EB]">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            AI Customer Support Console
          </p>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm shadow-slate-200/60 text-center space-y-5 transition-all">
        {status === "loading" && (
          <div className="py-6 space-y-4 animate-in fade-in duration-200">
            <div className="mx-auto size-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center ring-8 ring-blue-50/50">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <Badge variant="ai" className="text-[10px] font-semibold tracking-wide">
                <Sparkles className="size-3 mr-1" />
                Securing Authentication
              </Badge>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Verifying Google Session
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Establishing your authenticated session with the ResolveAI Agentic Console...
              </p>
            </div>
            <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] rounded-full animate-pulse w-3/4 mx-auto" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto size-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Authentication Successful!
              </h2>
              <p className="text-xs text-slate-600">
                Welcome back,{" "}
                <strong className="text-slate-900 font-semibold">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                </strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>Session tokens secured & cookies minted</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl h-10 shadow-sm shadow-[#2563EB]/25">
                  <span>Enter ResolveAI</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto size-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center ring-8 ring-red-50">
              <AlertCircle className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Sign-In Incomplete
              </h2>
              <p className="text-xs text-red-600 font-medium max-w-xs mx-auto leading-relaxed">
                {errorMessage || "Unable to complete Google verification."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-left space-y-1">
              <p className="font-semibold text-slate-700">Troubleshooting tip:</p>
              <p>
                Ensure third-party cookies or pop-ups are allowed, or sign in directly using your email and password.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link href="/login" className="flex-1">
                <Button
                  variant="default"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl h-10"
                >
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-10 border-slate-200 text-slate-700"
                >
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} ResolveAI Inc. All rights reserved.
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden selection:bg-[#2563EB]/15">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      <React.Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 animate-spin text-[#2563EB]" />
            <p className="text-xs text-slate-500">Loading authentication state...</p>
          </div>
        }
      >
        <AuthCallbackContent />
      </React.Suspense>
    </div>
  )
}
