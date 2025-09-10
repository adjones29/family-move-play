import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedControlOption {
  label: string
  value: string
}

export interface SegmentedControlProps {
  value: string
  onChange: (value: string) => void
  options: SegmentedControlOption[]
  className?: string
}

const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(({ value, onChange, options, className }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "relative flex w-full rounded-full bg-surface-2 p-1",
        className
      )}
    >
      {options.map((option, index) => {
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${option.value}`}
            tabIndex={isSelected ? 0 : -1}
            className={cn(
              "relative flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out",
              "h-9 min-h-9 flex items-center justify-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              isSelected
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-surface-3 hover:text-foreground"
            )}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" && index > 0) {
                onChange(options[index - 1].value)
              } else if (e.key === "ArrowRight" && index < options.length - 1) {
                onChange(options[index + 1].value)
              }
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
})

SegmentedControl.displayName = "SegmentedControl"

export { SegmentedControl }