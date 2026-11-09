import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "ResolveAI — AI Customer Support Agent with Smart Human Handoff",
  description:
    "Automate customer support with an agentic AI that resolves issues, guides step-by-step troubleshooting, and executes flawless human handoffs with full context.",
  keywords: [
    "AI Customer Support",
    "Agentic Workflow",
    "Smart Human Handoff",
    "RAG Knowledge Base",
    "Customer Support Automation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
