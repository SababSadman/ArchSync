import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        outline: "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-raised)]",
        secondary: "bg-[var(--bg-raised)] text-[var(--text-primary)] hover:bg-[var(--bg-sunken)]",
        ghost: "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]",
        destructive: "bg-red-100 text-red-700 hover:bg-red-200",
        link: "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
