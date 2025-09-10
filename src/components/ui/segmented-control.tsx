import { useState, useEffect, useRef } from "react"

interface SegmentedControlProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  className?: string
}

export const SegmentedControl = ({ value, onChange, options, className = "" }: SegmentedControlProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const activeIndex = options.findIndex(option => option.value === value)

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index
    
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      newIndex = index > 0 ? index - 1 : options.length - 1
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      newIndex = index < options.length - 1 ? index + 1 : 0
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onChange(options[index].value)
      return
    }
    
    if (newIndex !== index) {
      setFocusedIndex(newIndex)
      // Focus the button
      const buttons = containerRef.current?.querySelectorAll('button')
      buttons?.[newIndex]?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`
        grid grid-cols-4 gap-0
        bg-muted rounded-full p-1.5 h-11
        overflow-hidden items-stretch
        ${className}
      `}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          tabIndex={value === option.value || focusedIndex === index ? 0 : -1}
          onClick={() => onChange(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          className={`
            all-unset box-border w-full h-full
            flex items-center justify-center
            rounded-full border-0 leading-none
            cursor-pointer text-sm font-medium
            transition-all duration-150 ease-out
            -webkit-tap-highlight-transparent
            ${value === option.value 
              ? 'bg-primary/10 text-primary font-semibold' 
              : 'bg-transparent text-muted-foreground hover:bg-secondary'
            }
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
          `}
          style={{
            transform: 'none',
            margin: 0,
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}