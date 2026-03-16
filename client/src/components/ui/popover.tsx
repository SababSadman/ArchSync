import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType>({
  open: false,
  setOpen: () => {},
})

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen, open } = React.useContext(PopoverContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(!open),
    })
  }
  return (
    <button type="button" onClick={() => setOpen(!open)}>
      {children}
    </button>
  )
}

function PopoverContent({
  className,
  children,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "center" | "end"; sideOffset?: number }) {
  const { open, setOpen } = React.useContext(PopoverContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 top-full mt-1 w-64 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-lg",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
