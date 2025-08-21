import { ReactNode, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HorizontalScrollProps {
  title: string
  children: ReactNode
}

export const HorizontalScroll = ({ title, children }: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="group relative px-8 py-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      
      {/* Scroll Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-card"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-card"
        onClick={scrollRight}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}