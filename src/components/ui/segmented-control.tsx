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
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 0,
        background: 'var(--surface-2)',
        borderRadius: '9999px',
        padding: '4px',
        height: '40px',
        overflow: 'hidden',
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
              all: 'unset',
              boxSizing: 'border-box',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              background: isSelected ? 'var(--accent)' : 'transparent',
              color: isSelected ? 'var(--on-accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: isSelected ? 600 : 400,
              fontSize: '14px',
              lineHeight: 1,
              margin: 0,
              border: 0,
              transform: 'none !important' as any,
              top: 'auto',
              WebkitTapHighlightColor: 'transparent',
              appearance: 'none',
              transition: 'background-color 150ms ease-out, color 150ms ease-out'
            }}
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
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--focus)'
              e.currentTarget.style.outline = 'none'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
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