import * as React from "react"
import { Navbar } from "@/components/landing/Navbar"
import { LandingBackground } from "@/components/landing/LandingBackground"
import { Hero } from "@/components/landing/Hero"
import { InteractiveSimulator } from "@/components/landing/InteractiveSimulator"
import { FeaturesGrid } from "@/components/landing/FeaturesGrid"
import { HumanDashboardPreview } from "@/components/landing/HumanDashboardPreview"
import { ComparisonSection } from "@/components/landing/ComparisonSection"
import { ArchitectureSection } from "@/components/landing/ArchitectureSection"
import { FAQSection } from "@/components/landing/FAQSection"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#8B5CF6]/20 relative overflow-x-hidden">
      <LandingBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <InteractiveSimulator />
        <FeaturesGrid />
        <HumanDashboardPreview />
        <ComparisonSection />
        <ArchitectureSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
