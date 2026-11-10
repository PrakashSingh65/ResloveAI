"use client"

import * as React from "react"
import {
  Star,
  MessageSquare,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CSAT_FEEDBACK_LIST } from "./dashboard-data"
import { CSATFeedback } from "./types"

export function FeedbackCSATView() {
  const [feedbackList, setFeedbackList] = React.useState<CSATFeedback[]>(CSAT_FEEDBACK_LIST)
  const [selectedRating, setSelectedRating] = React.useState<number>(5)
  const [feedbackComment, setFeedbackComment] = React.useState("")
  const [feedbackCategory, setFeedbackCategory] = React.useState("Order Delivery Issue")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false)

  const averageRating = (
    feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length
  ).toFixed(2)

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackComment.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const newReview: CSATFeedback = {
        id: `csat-${Date.now()}`,
        ticketId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: "You (Hackathon Evaluator)",
        rating: selectedRating,
        sentiment: selectedRating >= 4 ? "Positive" : selectedRating === 3 ? "Neutral" : "Negative",
        comment: feedbackComment.trim(),
        timestamp: "Just now",
        category: feedbackCategory,
        humanAgent: "Sarah Miller & ResolveAI Bot",
      }

      setFeedbackList([newReview, ...feedbackList])
      setFeedbackComment("")
      setIsSubmitting(false)
      setSubmissionSuccess(true)
      setTimeout(() => setSubmissionSuccess(false), 4000)
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="ai" className="mb-2 text-xs font-semibold px-2.5 py-0.5">
            <HeartHandshake className="size-3.5 mr-1 text-[#8B5CF6]" />
            Post-Resolution Feedback Engine
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Customer Satisfaction (CSAT) & Quality Assurance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            ResolveAI automatically surveys customers post-resolution. Zero context handoffs eliminate customer repetition, resulting in industry-leading CSAT and retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall CSAT</span>
            <div className="text-2xl font-black text-[#0F172A] flex items-center justify-center gap-1 mt-0.5">
              <span>{averageRating}</span>
              <Star className="size-5 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Net Promoter</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">+72 NPS</div>
          </div>
        </div>
      </div>

      {/* Grid: Survey Simulator + Live Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive CSAT Survey Simulator (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Simulate Post-Chat CSAT Survey
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Customer View</span>
          </div>

          {submissionSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your CSAT rating was recorded in the live queue.</span>
            </div>
          )}

          <form onSubmit={handleSubmitSurvey} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                How satisfied were you with ResolveAI&apos;s speed & handoff?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Star
                      className={`size-7 transition-all ${
                        star <= selectedRating
                          ? "fill-amber-400 text-amber-500 scale-110"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-slate-700 font-mono text-sm">
                  {selectedRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Issue Category Tested
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Order Delivery Issue">Order Delivery Issue (Showcase Scenario)</option>
                <option value="Billing Dispute">Billing & Duplicate Charge</option>
                <option value="Product Quality">Fulfillment & SKU Mismatch</option>
                <option value="Account Self-Service">Account FAQ & Export</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Your Feedback / Review Comments
              </label>
              <textarea
                rows={3}
                required
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="e.g. Loved that the agent already knew my FedEx tracking and had the replacement pre-authorized!"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2563EB] leading-relaxed text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !feedbackComment.trim()}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl h-10 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="size-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit CSAT Feedback"}</span>
            </Button>
          </form>
        </div>

        {/* Live Customer Reviews Feed (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-[#8B5CF6]" />
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Recent Verified Customer CSAT Reviews ({feedbackList.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Post-chat verified</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center">
                      {item.customerName[0]}
                    </div>
                    <div>
                      <span className="font-extrabold text-[#0F172A]">
                        {item.customerName}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-2">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-500"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-100">
                  &quot;{item.comment}&quot;
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="font-semibold text-slate-700">
                    Handled by: {item.humanAgent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
