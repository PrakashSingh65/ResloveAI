"use client"

import * as React from "react"
import {
  Database,
  Search,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RAG_DOCUMENTS } from "./dashboard-data"
import { RAGDocument } from "./types"

export function RAGKnowledgeView() {
  const [documents, setDocuments] = React.useState<RAGDocument[]>(RAG_DOCUMENTS)
  const [testQuery, setTestQuery] = React.useState(
    "My package says delivered, but I checked my porch and cannot find it."
  )
  const [isSearching, setIsSearching] = React.useState(false)
  const [activeResult, setActiveResult] = React.useState<RAGDocument | null>(RAG_DOCUMENTS[0])
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [uploadFileName, setUploadFileName] = React.useState("")
  const [uploadCategory, setUploadCategory] = React.useState<"Logistics" | "Billing" | "Product" | "Security">("Logistics")
  const [isIndexing, setIsIndexing] = React.useState(false)
  const [indexProgress, setIndexProgress] = React.useState(0)

  const handleRunSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      const q = testQuery.toLowerCase()
      if (q.includes("refund") || q.includes("charge") || q.includes("bill")) {
        setActiveResult(documents.find((d) => d.category === "Billing") || documents[1])
      } else if (q.includes("api") || q.includes("429") || q.includes("rate")) {
        setActiveResult(documents.find((d) => d.category === "Security") || documents[3])
      } else if (q.includes("wrong") || q.includes("color") || q.includes("item")) {
        setActiveResult(documents.find((d) => d.category === "Product") || documents[2])
      } else {
        setActiveResult(documents[0])
      }
    }, 400)
  }

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName) return
    setIsIndexing(true)
    setIndexProgress(20)

    const interval = setInterval(() => {
      setIndexProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsIndexing(false)
          setShowUploadModal(false)
          const newDoc: RAGDocument = {
            id: `rag-${Date.now()}`,
            title: uploadFileName.endsWith(".pdf") || uploadFileName.endsWith(".md") ? uploadFileName : `${uploadFileName}.pdf`,
            category: uploadCategory,
            chunksCount: Math.floor(Math.random() * 200) + 50,
            similarityScore: 0.96,
            lastUpdated: "Just now",
            tags: ["New", "Custom SOP", uploadCategory],
            fileSize: "1.2 MB",
            sampleSnippet: "Clause 1.0: Newly indexed operating procedure with active vector chunk embeddings ready for LLM grounding.",
          }
          setDocuments([newDoc, ...documents])
          setUploadFileName("")
          setIndexProgress(0)
          return 100
        }
        return prev + 25
      })
    }, 250)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="ai" className="mb-2 text-xs font-semibold px-2.5 py-0.5">
            <Database className="size-3.5 mr-1" />
            Vector Knowledge Base Engine
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Retrieval-Augmented Generation (RAG) Grounding
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            ResolveAI performs sub-second semantic searches across company SOPs, carrier contracts, and warranty guidelines to ensure every AI answer is mathematically grounded.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs h-10 px-4 flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Upload className="size-4" />
          <span>Index New Document</span>
        </Button>
      </div>

      {/* RAG Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Total Indexed Chunks</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">1,420</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Vectorized</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Average Vector Latency</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">32 ms</div>
          <span className="text-[10px] text-slate-400">Hybrid Dense + Sparse</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Embedding Model</span>
          <div className="text-sm font-extrabold text-slate-800 mt-2 font-mono truncate">
            text-embedding-3-small
          </div>
          <span className="text-[10px] text-slate-400">1536-dim vectors</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Hallucination Rejection</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">99.9%</div>
          <span className="text-[10px] text-slate-400">Confidence threshold &gt; 0.85</span>
        </div>
      </div>

      {/* Interactive Vector Search Sandbox */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              Live Semantic Vector Search Tester
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Type any customer inquiry to see retrieved chunks
          </span>
        </div>

        {/* Query Input */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter customer phrasing to simulate semantic embedding lookup..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
          <Button
            onClick={handleRunSearch}
            disabled={isSearching}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl h-11 px-6 font-bold text-xs shrink-0 cursor-pointer"
          >
            {isSearching ? "Searching Vectors..." : "Run Vector Search"}
          </Button>
        </div>

        {/* Quick query sample chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Try queries:</span>
          {[
            "Order marked delivered but package missing on porch",
            "Double charged $280 on corporate card subscription",
            "Hit 429 too many requests on chat endpoint",
            "Received royal blue jacket instead of navy coat",
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setTestQuery(sample)
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
            >
              &quot;{sample}&quot;
            </button>
          ))}
        </div>

        {/* Live Vector Match Result */}
        {activeResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[11px] font-bold">
                  Top Match (Rank #1)
                </Badge>
                <span className="font-extrabold text-sm text-[#0F172A]">
                  {activeResult.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">Cosine Similarity:</span>
                <span className="font-extrabold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {activeResult.similarityScore}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
              <span className="text-[10px] text-slate-400 font-sans font-bold block mb-1">
                Grounded Knowledge Chunk Extract:
              </span>
              {activeResult.sampleSnippet}
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Category: {activeResult.category} • Size: {activeResult.fileSize}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Verified for Autonomous Agent Execution
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-[#2563EB]" />
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              Active Knowledge Sources ({documents.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Last vector sync: 12m ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Document Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Vector Chunks</th>
                <th className="pb-3 font-semibold">Fidelity</th>
                <th className="pb-3 font-semibold">Tags</th>
                <th className="pb-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setActiveResult(doc)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition ${
                    activeResult?.id === doc.id ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="py-3 pr-3 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="size-4 text-[#2563EB] shrink-0" />
                    <span>{doc.title}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <Badge variant="outline" className="text-[10px]">
                      {doc.category}
                    </Badge>
                  </td>
                  <td className="py-3 pr-3 font-mono text-slate-700">
                    {doc.chunksCount} chunks
                  </td>
                  <td className="py-3 pr-3 font-bold text-emerald-600 font-mono">
                    {doc.similarityScore}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-slate-500 text-[11px]">{doc.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                <Upload className="size-4 text-[#2563EB]" />
                <span>Index New Knowledge File</span>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Document Filename
                </label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Courier_Express_Overnight_Rules.pdf"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Category Domain
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Logistics">Logistics & Shipping</option>
                  <option value="Billing">Billing & Gateway</option>
                  <option value="Product">Product & Fulfillment</option>
                  <option value="Security">Security & API SLA</option>
                </select>
              </div>

              {isIndexing && (
                <div className="space-y-1.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex justify-between text-[11px] font-semibold text-[#2563EB]">
                    <span>Chunking & Vector Embedding...</span>
                    <span>{indexProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563EB] h-full transition-all duration-300"
                      style={{ width: `${indexProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isIndexing}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isIndexing || !uploadFileName}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs h-9 font-semibold"
                >
                  {isIndexing ? "Embedding..." : "Upload & Vectorize"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
