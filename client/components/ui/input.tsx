import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 transition-all duration-150 outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
