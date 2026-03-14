import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-white border-transparent",
        secondary: "bg-[var(--bg-raised)] text-[var(--text-secondary)] border-transparent",
        destructive: "bg-red-100 text-red-700 border-transparent",
        outline: "border-[var(--border-default)] text-[var(--text-primary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
