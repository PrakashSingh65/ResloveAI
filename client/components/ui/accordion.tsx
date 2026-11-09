"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemContextValue {
  isOpen: boolean
  toggle: () => void
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined)

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  defaultValue?: string
}

function Accordion({ className, children, ...props }: AccordionProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {children}
    </div>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  defaultOpen?: boolean
}

function AccordionItem({
  value,
  defaultOpen = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle }}>
      <div
        className={cn(
          "rounded-xl border border-[#E2E8F0] bg-white transition-all overflow-hidden",
          isOpen ? "border-[#8B5CF6]/40 shadow-sm" : "hover:border-slate-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AccordionItemContext)
  if (!context) throw new Error("AccordionTrigger must be used inside AccordionItem")

  return (
    <button
      type="button"
      onClick={context.toggle}
      aria-expanded={context.isOpen}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left text-base font-medium text-[#0F172A] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "size-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4",
          context.isOpen && "rotate-180 text-[#8B5CF6]"
        )}
      />
    </button>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(AccordionItemContext)
  if (!context) throw new Error("AccordionContent must be used inside AccordionItem")

  if (!context.isOpen) return null

  return (
    <div
      className={cn(
        "px-5 pb-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1",
        className
      )}
      {...props}
    >
      <div className="pt-3">{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
