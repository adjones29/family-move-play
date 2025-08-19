import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Timer, Award } from "lucide-react"

interface MiniGameCardProps {
  title: string
  description: string
  duration: string
  participants: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  icon: React.ReactNode
}

export function MiniGameCard({
  title,
  description,
  duration,
  participants,
  difficulty,
  points,
  icon
}: MiniGameCardProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-50"
      case "medium": return "text-orange-600 bg-orange-50"
      case "hard": return "text-red-600 bg-red-50"
      default: return "text-green-600 bg-green-50"
    }
  }

  return (
    <Card className="shadow-card hover:shadow-float transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-secondary/10 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-energy rounded-xl text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getDifficultyColor()}`}>
                  {difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {points} pts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Timer className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{participants}</span>
          </div>
        </div>
        
        <Button variant="playful" className="w-full group-hover:scale-105 transition-transform duration-300">
          <Play className="h-4 w-4 mr-2" />
          Start Game
        </Button>
      </CardContent>
    </Card>
  )
}