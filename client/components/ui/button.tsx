import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-xl font-medium text-sm transition-all duration-150 outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm shadow-[#2563EB]/25",
        ai:
          "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-sm shadow-[#8B5CF6]/30",
        outline:
          "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50 hover:border-slate-300",
        secondary:
          "bg-slate-100 text-[#0F172A] hover:bg-slate-200 border border-slate-200/80",
        ghost:
          "text-[#0F172A] hover:bg-slate-100 hover:text-slate-900",
        link:
          "text-[#2563EB] underline-offset-4 hover:underline p-0 h-auto",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      },
      size: {
        default: "h-10 gap-2 px-4 py-2 text-sm",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-12 gap-2.5 rounded-xl px-6 text-base font-semibold",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
