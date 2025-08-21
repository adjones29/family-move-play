import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Clock, Users, Play } from "lucide-react"
import { ReactNode } from "react"

interface MiniGameCardProps {
  title: string
  description: string
  duration: string
  participants: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  icon: ReactNode
}

export const MiniGameCard = ({
  title,
  description,
  duration,
  participants,
  difficulty,
  points,
  icon
}: MiniGameCardProps) => {
  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400"
  }

  return (
    <Card className="min-w-[300px] shadow-card hover:shadow-hover hover:scale-105 transition-all duration-300 bg-card border-border/30 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              {icon}
            </div>
            <CardTitle className="text-lg text-card-foreground">{title}</CardTitle>
          </div>
          <Badge className={difficultyColors[difficulty]} variant="secondary">
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{participants}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
            +{points} points
          </Badge>
          <Button 
            size="sm" 
            className="group-hover:scale-105 transition-transform bg-primary hover:bg-primary/90"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}