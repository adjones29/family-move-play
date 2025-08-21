import { Button } from "@/components/ui/enhanced-button"
import { Play, Info } from "lucide-react"
import heroImage from "@/assets/hero-family-fitness.jpg"

export const HeroSection = () => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Family exercising together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            FitFam
          </h1>
          <p className="text-lg text-white/90 max-w-lg drop-shadow-md">
            Keep your family active together through gamified fitness tracking, collaborative challenges, and shared rewards.
          </p>
          <div className="flex gap-4 mt-6">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-hover">
              <Play className="h-5 w-5 mr-2" />
              Start Challenge
            </Button>
            <Button variant="secondary" size="lg" className="bg-card/90 text-card-foreground hover:bg-card font-semibold px-8 shadow-card">
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}