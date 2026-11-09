import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
        ai:
          "bg-[#8B5CF6]/10 text-[#7C3AED] border border-[#8B5CF6]/30 font-medium",
        "ai-solid":
          "bg-[#8B5CF6] text-white shadow-sm shadow-[#8B5CF6]/30",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning:
          "bg-amber-50 text-amber-700 border border-amber-200",
        outline:
          "border border-[#E2E8F0] text-[#0F172A] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
