import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Select({ value, onValueChange, children, open: controlledOpen, onOpenChange }: SelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [setOpen])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center justify-between gap-2 h-9 rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-1 text-sm text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--bg-raised)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("size-4 text-[var(--text-tertiary)] transition-transform", open && "rotate-180")} />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return (
    <span className={cn("flex-1 text-left truncate", !value && "text-[var(--text-tertiary)]")}>
      {value || placeholder}
    </span>
  )
}

function SelectContent({ className, children }: React.ComponentProps<"div">) {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-full min-w-[8rem] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg overflow-auto max-h-60",
        className
      )}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
}

function SelectItem({
  value: itemValue,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value, onValueChange, setOpen } = React.useContext(SelectContext)
  const isSelected = value === itemValue

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(itemValue)
        setOpen(false)
      }}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left cursor-default hover:bg-[var(--bg-raised)] transition-colors",
        isSelected && "text-[var(--accent)] font-medium",
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {isSelected && <Check className="size-4 text-[var(--accent)]" />}
    </button>
  )
}

function SelectGroup({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("py-1", className)}>{children}</div>
}

function SelectLabel({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-2 py-1 text-xs font-semibold text-[var(--text-tertiary)]", className)}>
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue }
