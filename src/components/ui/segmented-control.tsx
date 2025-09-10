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
      className={cn(className)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 0,
        background: 'var(--surface-2)',
        borderRadius: '9999px',
        padding: '4px',
        height: '40px',
        alignItems: 'stretch'
      }}
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
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isSelected ? 'var(--accent)' : 'transparent',
              color: isSelected ? 'var(--on-accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: isSelected ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
              margin: 0
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'var(--surface-3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
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