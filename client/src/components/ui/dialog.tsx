import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div data-slot="dialog" className="relative z-50">
      {children}
    </div>
  )
}

function DialogOverlay({ onClick }: { onClick?: () => void }) {
  return (
    <div
      data-slot="dialog-overlay"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      onClick={onClick}
    />
  )
}

function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <>
      <DialogOverlay onClick={onClose} />
      <div
        role="dialog"
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-xl p-6 animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-[var(--text-tertiary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 mb-4", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex justify-end gap-2 pt-2", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold text-[var(--text-primary)]", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm text-[var(--text-secondary)]", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
}
