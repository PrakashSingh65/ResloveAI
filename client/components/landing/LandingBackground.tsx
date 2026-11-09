"use client"

import * as React from "react"

export function LandingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Ambient Top Radiant Light Beam / Flare */}
      <div className="absolute -top-[280px] left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.18),rgba(139,92,246,0.12),transparent_75%)] animate-ray-glow" />

      {/* 2. Modern Precision Dot-Grid Mesh with Radial Edge Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_18%,#000_30%,transparent_85%)]" />

      {/* 3. High-Tier Aurora Floating Orbs */}
      {/* Electric Blue Orb (Left) */}
      <div className="absolute -top-24 left-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#2563EB]/20 via-[#3B82F6]/15 to-transparent blur-[120px] animate-float-slow" />

      {/* AI Violet / Magenta Orb (Right) */}
      <div className="absolute top-16 right-[8%] w-[540px] h-[540px] rounded-full bg-gradient-to-bl from-[#8B5CF6]/20 via-[#A855F7]/12 to-transparent blur-[130px] animate-float-reverse" />

      {/* Cyan & Indigo Core Glow (Center) */}
      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[680px] h-[360px] rounded-full bg-gradient-to-r from-[#06B6D4]/12 via-[#6366F1]/15 to-[#8B5CF6]/12 blur-[105px] animate-pulse-subtle" />

      {/* Mid-page Ambient Floating Glows */}
      <div className="absolute top-[950px] right-[5%] w-[480px] h-[480px] rounded-full bg-[#2563EB]/10 blur-[130px] animate-float-slow" />
      <div className="absolute top-[1750px] left-[5%] w-[520px] h-[520px] rounded-full bg-[#8B5CF6]/10 blur-[140px] animate-float-reverse" />
      <div className="absolute top-[2600px] right-[10%] w-[500px] h-[500px] rounded-full bg-[#06B6D4]/8 blur-[130px] animate-pulse-subtle" />

      {/* 4. Delicate Digital Crosshair & Node Markers at intersections */}
      <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] hidden md:block opacity-40">
        {/* Node 1 */}
        <div className="absolute top-12 left-20 flex items-center justify-center">
          <div className="size-1 rounded-full bg-[#2563EB] animate-ping" />
          <div className="absolute size-1.5 rounded-full bg-[#2563EB]" />
        </div>
        {/* Node 2 */}
        <div className="absolute top-28 right-32 flex items-center justify-center">
          <div className="size-1 rounded-full bg-[#8B5CF6] animate-ping [animation-delay:1.5s]" />
          <div className="absolute size-1.5 rounded-full bg-[#8B5CF6]" />
        </div>
        {/* Node 3 */}
        <div className="absolute bottom-20 left-1/3 flex items-center justify-center">
          <div className="size-1 rounded-full bg-[#06B6D4] animate-ping [animation-delay:2.5s]" />
          <div className="absolute size-1.5 rounded-full bg-[#06B6D4]" />
        </div>
        {/* Node 4 */}
        <div className="absolute bottom-32 right-1/4 flex items-center justify-center">
          <div className="size-1 rounded-full bg-[#8B5CF6] animate-ping [animation-delay:3.2s]" />
          <div className="absolute size-1.5 rounded-full bg-[#8B5CF6]" />
        </div>
      </div>
    </div>
  )
}
