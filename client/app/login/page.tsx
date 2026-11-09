"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { authApi, getApiErrorMessage, UserProfile } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })

  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [loginSuccess, setLoginSuccess] = React.useState(false)
  const [authenticatedUser, setAuthenticatedUser] = React.useState<UserProfile | null>(null)
  const [showForgotPassword, setShowForgotPassword] = React.useState(false)
  const [resetEmail, setResetEmail] = React.useState("")
  const [resetSent, setResetSent] = React.useState(false)

  // Close forgot password dialog on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForgotPassword) {
        setShowForgotPassword(false)
        setResetSent(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showForgotPassword])

  const validateField = (name: string, value: string): string => {
    if (name === "email") {
      if (!value.trim()) {
        return "Email address is required"
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim())) {
        return "Please enter a valid email address"
      }
    }
    if (name === "password") {
      if (!value) {
        return "Password is required"
      }
      if (value.length < 6) {
        return "Password must be at least 6 characters"
      }
    }
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (apiError) setApiError(null)

    // Clear field error dynamically once valid
    if (errors[name]) {
      const err = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldError = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  const validateAll = () => {
    const newErrors: Record<string, string> = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    }

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)
    setTouched({ email: true, password: true })
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    if (!validateAll()) return

    setIsLoading(true)

    try {
      const response = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      })
      setAuthenticatedUser(response.user)
      setLoginSuccess(true)
      // Automatically navigate to landing page
      router.push("/")
    } catch (err) {
      const message = getApiErrorMessage(err)
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setApiError(null)
    try {
      const url = await authApi.initiateGoogleOAuth()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err))
      setIsGoogleLoading(false)
    }
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      return
    }
    setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#2563EB]/15 relative overflow-x-hidden">
      {/* Background Ambient Glow for modern AI SaaS feel */}
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
                  Agentic SaaS
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden md:block">
                AI Support with Smart Human Handoff
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              New to ResolveAI?
            </span>
            <Link href="/signup">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/50 rounded-xl border-slate-200"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px] space-y-6">
          
          {/* Sign In Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-[#2563EB] shadow-2xs">
              <Sparkles className="size-3.5 text-[#2563EB]" />
              <span>Agentic Support Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter your credentials to access your agent dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm shadow-slate-200/60 transition-all">
            {loginSuccess ? (
              <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto size-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    Welcome back{authenticatedUser?.first_name ? `, ${authenticatedUser.first_name}` : ""}!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Signing you in... redirecting to landing page
                  </p>
                </div>
                <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] rounded-full animate-pulse w-full" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Real API Error Alert */}
                {apiError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium leading-relaxed">{apiError}</div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" required className="text-xs font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail
                      className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="alex.support@resolveai.io"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.email && touched.email}
                      aria-invalid={!!errors.email && touched.email}
                      aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                      className="pl-10 h-11 text-sm bg-slate-50/40 focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" required className="text-xs font-semibold text-slate-700">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.password && touched.password}
                      aria-invalid={!!errors.password && touched.password}
                      aria-describedby={errors.password && touched.password ? "password-error" : undefined}
                      className="pl-10 pr-10 h-11 text-sm bg-slate-50/40 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded p-0.5 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-bold h-11 rounded-xl shadow-md shadow-[#2563EB]/25 text-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2" role="status">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Sign In to ResolveAI</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  )}
                </Button>

                {/* Social Login Separator */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400 font-medium tracking-wide uppercase">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Single Sign-On Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex h-11 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:border-transparent disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="size-4 animate-spin text-[#2563EB]" />
                  ) : (
                    <svg className="size-4.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Card for Sign Up Link */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-4 text-center text-xs text-slate-600 shadow-2xs backdrop-blur-xs">
            Don&apos;t have a ResolveAI account yet?{" "}
            <Link
              href="/signup"
              className="text-[#2563EB] hover:text-[#1D4ED8] font-bold hover:underline transition-colors ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForgotPassword(false)
              setResetSent(false)
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 id="forgot-password-title" className="text-base font-bold text-[#0F172A]">
                Reset your password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetSent(false)
                }}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="space-y-3 py-2 text-center">
                <div className="mx-auto size-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-4 ring-emerald-50">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">Check your inbox</p>
                  <p className="text-xs text-slate-600">
                    Password reset link sent to <strong>{resetEmail}</strong>.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetSent(false)
                  }}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl h-10 font-semibold"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="resetEmail" className="text-xs font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="h-10 text-sm"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 rounded-xl h-10 border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl h-10 font-semibold shadow-sm"
                  >
                    Send Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-[#E2E8F0] bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">ResolveAI Inc.</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-800 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-800 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-800 transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-slate-800 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
