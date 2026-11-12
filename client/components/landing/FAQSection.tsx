"use client"

import * as React from "react"
import { HelpCircle, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const FAQS = [
  {
    q: "How does ResolveAI differ from standard support chatbots?",
    a: "Standard chatbots typically repeat generic FAQ links and get stuck in repetitive loops. ResolveAI is an autonomous agent with step-by-step diagnostic workflows. It applies enterprise diagnostic policies, actively guides users through verification steps, and when an issue is truly unresolved, creates a support ticket and executes a seamless human handoff with full context.",
  },
  {
    q: "How does ResolveAI ensure zero customer repetition during human handoff?",
    a: "When a case escalates, ResolveAI's Copilot synthesizes an AI Executive Briefing for the human agent. The agent immediately sees the exact core issue, root cause, checklist of tests already tried, and a 1-click resolution button — so the customer never has to re-explain their situation.",
  },
  {
    q: "What triggers an automatic escalation to a human agent?",
    a: "Escalations are triggered by: 1) High customer frustration or urgency detected by sentiment analysis, 2) Failed troubleshooting steps (e.g. customer verified package is not found), 3) Issues exceeding the AI's confidence threshold, or 4) Specific policy requirements (such as high-value refund requests).",
  },
  {
    q: "What does the human agent see when a conversation is transferred?",
    a: "Human agents receive a comprehensive executive summary in 3 bullet points, the full conversation timeline, intent classification, customer sentiment trajectory, and one-click recommended resolution actions (such as authorizing replacement or filing carrier claims) — eliminating the need for the customer to repeat themselves.",
  },
  {
    q: "Does ResolveAI support integration with our existing CRM and helpdesk?",
    a: "Yes. ResolveAI includes bi-directional connectors for Zendesk, Jira Service Management, Salesforce Service Cloud, Freshdesk, and custom webhook endpoints for internal ticketing databases.",
  },
  {
    q: "How does the customer feedback loop improve the agent?",
    a: "After each resolution, customers provide a quick 1-tap CSAT rating and optional feedback. Unresolved or negative interactions automatically flag the underlying knowledge base passages and agent decision nodes for administrative review and prompt fine-tuning.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="ai" className="px-3 py-1 font-semibold text-xs">
            <HelpCircle className="size-3.5 mr-1 text-[#8B5CF6]" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Everything You Need to Know About ResolveAI
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Clear answers about agentic problem solving, human handoffs, and enterprise integration.
          </p>
        </div>

        <Accordion className="space-y-3">
          {FAQS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              defaultOpen={index === 0}
            >
              <AccordionTrigger className="text-base font-semibold text-[#0F172A]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
