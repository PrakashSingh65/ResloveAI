"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bot,
  User,
  Mail,
  MapPin,
  Building,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Check,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { COUNTRIES, GENDER_OPTIONS } from "@/lib/location-data"

export default function SignUpPage() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "India",
    state: "Delhi NCR",
    city: "",
    phoneCountryCode: "+91",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  // Current states based on selected country
  const currentCountry = COUNTRIES.find((c) => c.name === formData.country)
  const availableStates = currentCountry ? currentCountry.states : []

  // Update country code and default state when country changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryName = e.target.value
    const matched = COUNTRIES.find((c) => c.name === selectedCountryName)
    setFormData((prev) => ({
      ...prev,
      country: selectedCountryName,
      phoneCountryCode: matched ? matched.dialCode : "+1",
      state: matched && matched.states.length > 0 ? matched.states[0] : "",
    }))
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }))
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({ ...prev, [name]: val }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" }
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-red-500", textColor: "text-red-600" }
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500", textColor: "text-amber-600" }
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500", textColor: "text-blue-600" }
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" }
      default:
        return { score: 10, label: "Too Short", color: "bg-red-400", textColor: "text-red-500" }
    }
  }

  const strength = getPasswordStrength(formData.password)

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      if (dob >= today) {
        newErrors.dateOfBirth = "Date of birth must be in the past"
      } else {
        const age = today.getFullYear() - dob.getFullYear()
        if (age < 13) {
          newErrors.dateOfBirth = "You must be at least 13 years old"
        }
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Enter a valid phone number (7-15 digits)"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms and Privacy Policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector("[aria-invalid='true']")
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsSubmitting(true)

    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1200)
  }

  // Max date for DOB (today)
  const maxDobDate = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#2563EB]/15 relative overflow-x-hidden">
      {/* Background Ambient Glow for modern AI SaaS feel */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
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
              Already have an account?
            </span>
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow-xs"
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Hero / Brand Info Column (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 sticky top-24">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
                <Sparkles className="size-3.5" />
                <span>Next-Gen Customer Support AI</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl leading-tight">
                Empower your business with autonomous AI support.
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Join high-growth support teams transforming customer satisfaction with automated resolutions and seamless human handoffs.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="rounded-xl bg-blue-50 p-2 text-[#2563EB] shrink-0">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      Agentic Multi-Step Reasoning
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Resolves up to 72% of complex inquiries autonomously before human touch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="rounded-xl bg-purple-50 p-2 text-[#8B5CF6] shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      Smart Human Handoff
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transfers conversations with full context summary, sentiment, and diagnostics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 shrink-0">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      Enterprise Data Privacy
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SOC-2 Type II, GDPR compliant, and bank-grade TLS encryption out of the box.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial / Social Proof Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {"★★★★★"}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &ldquo;ResolveAI reduced our ticket queue backlog by 68% in the first two weeks, while CSAT scores jumped from 3.8 to 4.7.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1 border-t border-slate-700/60">
                <div className="size-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#8B5CF6] flex items-center justify-center font-bold text-xs">
                  SR
                </div>
                <div>
                  <div className="text-xs font-semibold">Sarah Reynolds</div>
                  <div className="text-[10px] text-slate-400">VP of Customer Experience, CloudScale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              /* Success State Screen */
              <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
                  <CheckCircle2 className="size-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                    Account Created Successfully!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Welcome to ResolveAI, <strong className="text-[#0F172A]">{formData.firstName} {formData.lastName}</strong>! We have sent a confirmation email to <span className="text-[#2563EB] font-medium">{formData.email}</span>.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left text-xs text-slate-600 space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Name:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Phone:</span>
                    <span>{formData.phoneCountryCode} {formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Location:</span>
                    <span>{formData.city}, {formData.state}, {formData.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Gender:</span>
                    <span>{formData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Date of Birth:</span>
                    <span>{formData.dateOfBirth}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl"
                    >
                      <span>Proceed to Log In</span>
                      <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData((prev) => ({
                        ...prev,
                        password: "",
                        confirmPassword: "",
                      }))
                    }}
                    className="w-full sm:w-auto rounded-xl"
                  >
                    Edit Registration
                  </Button>
                </div>
              </div>
            ) : (
              /* Registration Form Card */
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm shadow-slate-200/60">
                
                {/* Form Title */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                      Create your account
                    </h2>
                    <Badge variant="outline" className="text-xs text-[#2563EB] border-blue-200 bg-blue-50/50">
                      Step 1 of 1
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    Get started with ResolveAI in seconds.
                  </p>
                </div>

                {/* Quick Google Sign-Up Action */}
                <div className="space-y-4 mb-6">
                  <button
                    type="button"
                    className="w-full flex h-11 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:border-transparent"
                  >
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
                    <span>Sign up with Google</span>
                  </button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-400 font-medium tracking-wide uppercase">
                        Or register with email
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  
                  {/* Section 1: Personal Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <User className="size-4 text-[#2563EB]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Personal Information
                      </span>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" required className="text-xs font-semibold text-slate-700">
                          First Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            spellCheck={false}
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            aria-invalid={!!errors.firstName}
                            className="pl-3.5 h-11 text-sm bg-slate-50/40 focus:bg-white"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.firstName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" required className="text-xs font-semibold text-slate-700">
                          Last Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            spellCheck={false}
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            aria-invalid={!!errors.lastName}
                            className="pl-3.5 h-11 text-sm bg-slate-50/40 focus:bg-white"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.lastName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" required className="text-xs font-semibold text-slate-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          spellCheck={false}
                          placeholder="john.doe@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          aria-invalid={!!errors.email}
                          className="pl-10 h-11 text-sm bg-slate-50/40 focus:bg-white"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Date of Birth & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <Label htmlFor="dateOfBirth" required className="text-xs font-semibold text-slate-700">
                          Date of Birth
                        </Label>
                        <div className="relative">
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            max={maxDobDate}
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            error={!!errors.dateOfBirth}
                            aria-invalid={!!errors.dateOfBirth}
                            className="pl-3.5 h-11 text-sm bg-slate-50/40 focus:bg-white"
                          />
                        </div>
                        {errors.dateOfBirth && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.dateOfBirth}</span>
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <Label htmlFor="gender" required className="text-xs font-semibold text-slate-700">
                          Gender
                        </Label>
                        <div className="relative">
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            aria-invalid={!!errors.gender}
                            className={`flex h-11 w-full rounded-xl border appearance-none bg-slate-50/40 focus:bg-white px-3.5 py-2 text-sm text-[#0F172A] transition-all duration-150 outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 cursor-pointer ${
                              errors.gender
                                ? "border-red-500"
                                : "border-[#E2E8F0]"
                            }`}
                          >
                            <option value="" disabled>
                              Select Gender
                            </option>
                            {GENDER_OPTIONS.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="size-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                        </div>
                        {errors.gender && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.gender}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact & Location */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <MapPin className="size-4 text-[#2563EB]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Location & Contact
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" required className="text-xs font-semibold text-slate-700">
                        Phone Number
                      </Label>
                      <div className="flex gap-2">
                        {/* Country Dial Code */}
                        <div className="relative w-28 shrink-0">
                          <select
                            name="phoneCountryCode"
                            value={formData.phoneCountryCode}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                phoneCountryCode: e.target.value,
                              }))
                            }}
                            className="flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-slate-50 px-2.5 py-2 text-xs font-medium text-[#0F172A] appearance-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 cursor-pointer"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.dialCode}>
                                {c.flag} {c.dialCode} ({c.code})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                        </div>

                        {/* Phone Input */}
                        <div className="relative flex-1">
                          <Phone className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel-national"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            aria-invalid={!!errors.phone}
                            className="pl-10 h-11 text-sm bg-slate-50/40 focus:bg-white"
                          />
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Country & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Country */}
                      <div className="space-y-1.5">
                        <Label htmlFor="country" required className="text-xs font-semibold text-slate-700">
                          Country
                        </Label>
                        <div className="relative">
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleCountryChange}
                            aria-invalid={!!errors.country}
                            className={`flex h-11 w-full rounded-xl border appearance-none bg-slate-50/40 focus:bg-white px-3.5 py-2 text-sm text-[#0F172A] transition-all duration-150 outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 cursor-pointer ${
                              errors.country
                                ? "border-red-500"
                                : "border-[#E2E8F0]"
                            }`}
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.flag} {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="size-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                        </div>
                        {errors.country && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.country}</span>
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div className="space-y-1.5">
                        <Label htmlFor="state" required className="text-xs font-semibold text-slate-700">
                          State / Province
                        </Label>
                        <div className="relative">
                          {availableStates.length > 0 ? (
                            <>
                              <select
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                aria-invalid={!!errors.state}
                                className={`flex h-11 w-full rounded-xl border appearance-none bg-slate-50/40 focus:bg-white px-3.5 py-2 text-sm text-[#0F172A] transition-all duration-150 outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 cursor-pointer ${
                                  errors.state
                                    ? "border-red-500"
                                    : "border-[#E2E8F0]"
                                }`}
                              >
                                {availableStates.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="size-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                            </>
                          ) : (
                            <Input
                              id="state"
                              name="state"
                              type="text"
                              placeholder="Enter state or region"
                              value={formData.state}
                              onChange={handleChange}
                              error={!!errors.state}
                              aria-invalid={!!errors.state}
                              className="pl-3.5 h-11 text-sm bg-slate-50/40 focus:bg-white"
                            />
                          )}
                        </div>
                        {errors.state && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.state}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <Label htmlFor="city" required className="text-xs font-semibold text-slate-700">
                        City
                      </Label>
                      <div className="relative">
                        <Building className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Mumbai, New York, London..."
                          value={formData.city}
                          onChange={handleChange}
                          error={!!errors.city}
                          aria-invalid={!!errors.city}
                          className="pl-10 h-11 text-sm bg-slate-50/40 focus:bg-white"
                        />
                      </div>
                      {errors.city && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Password & Security */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Lock className="size-4 text-[#2563EB]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Security & Password
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="password" required className="text-xs font-semibold text-slate-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            aria-invalid={!!errors.password}
                            className="pl-10 pr-10 h-11 text-sm bg-slate-50/40 focus:bg-white"
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
                        {errors.password && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.password}</span>
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" required className="text-xs font-semibold text-slate-700">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            aria-invalid={!!errors.confirmPassword}
                            className="pl-10 pr-10 h-11 text-sm bg-slate-50/40 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded p-0.5 transition-colors cursor-pointer"
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-4" aria-hidden="true" />
                            ) : (
                              <Eye className="size-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{errors.confirmPassword}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">
                            Password strength:
                          </span>
                          <span
                            className={`font-bold ${
                              strength.textColor || "text-slate-600"
                            }`}
                          >
                            {strength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            {formData.password.length >= 8 ? (
                              <Check className="size-3 text-emerald-600 font-bold" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-slate-400 inline-block mr-1"></span>
                            )}
                            8+ characters
                          </span>
                          <span className="flex items-center gap-1">
                            {/[A-Z]/.test(formData.password) ? (
                              <Check className="size-3 text-emerald-600 font-bold" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-slate-400 inline-block mr-1"></span>
                            )}
                            Uppercase letter
                          </span>
                          <span className="flex items-center gap-1">
                            {/[0-9]/.test(formData.password) ? (
                              <Check className="size-3 text-emerald-600 font-bold" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-slate-400 inline-block mr-1"></span>
                            )}
                            At least 1 number
                          </span>
                          <span className="flex items-center gap-1">
                            {/[^A-Za-z0-9]/.test(formData.password) ? (
                              <Check className="size-3 text-emerald-600 font-bold" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-slate-400 inline-block mr-1"></span>
                            )}
                            Special character
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 size-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I agree to ResolveAI&apos;s{" "}
                        <a
                          href="#"
                          className="text-[#2563EB] hover:underline font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded"
                        >
                          Terms of Service
                        </a>{" "}
                        and acknowledge the{" "}
                        <a
                          href="#"
                          className="text-[#2563EB] hover:underline font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{errors.agreeToTerms}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-bold h-12 rounded-xl shadow-md shadow-[#2563EB]/25 text-sm transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2" role="status">
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></span>
                        <span>Creating Account...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Complete Sign Up</span>
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    )}
                  </Button>

                  {/* Bottom Link to Sign In */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already registered?{" "}
                      <Link
                        href="/login"
                        className="text-[#2563EB] hover:text-[#1D4ED8] font-bold hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                      >
                        Sign in to your account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer minimal */}
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
