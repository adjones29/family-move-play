import { ReactNode } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselRowProps {
  title: string
  children: ReactNode
}

export function CarouselRow({ title, children }: CarouselRowProps) {
  return (
    <div className="space-y-3 pb-4">
      <h2 className="text-xl font-bold px-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 px-4 pb-2">
          {children}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  )
}
