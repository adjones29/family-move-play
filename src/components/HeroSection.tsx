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
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            FitFam
          </h1>
          <p className="text-lg text-gray-200 max-w-lg">
            Keep your family active together through gamified fitness tracking, collaborative challenges, and shared rewards.
          </p>
          <div className="flex gap-4 mt-6">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8">
              <Play className="h-5 w-5 mr-2" />
              Start Challenge
            </Button>
            <Button variant="secondary" size="lg" className="bg-gray-600/80 text-white hover:bg-gray-500/80 font-semibold px-8">
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}