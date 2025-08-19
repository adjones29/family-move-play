import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, Star } from "lucide-react"

interface ChallengeCardProps {
  title: string
  description: string
  type: "weekly" | "daily" | "special"
  participants: number
  progress: number
  totalGoal: number
  daysLeft: number
  reward: string
  difficulty: "easy" | "medium" | "hard"
}

export function ChallengeCard({
  title,
  description,
  type,
  participants,
  progress,
  totalGoal,
  daysLeft,
  reward,
  difficulty
}: ChallengeCardProps) {
  const progressPercentage = Math.min((progress / totalGoal) * 100, 100)
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy": return "bg-gradient-success"
      case "medium": return "bg-gradient-warm" 
      case "hard": return "bg-gradient-energy"
      default: return "bg-gradient-success"
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "weekly": return <Calendar className="h-4 w-4" />
      case "daily": return <Star className="h-4 w-4" />
      case "special": return <Trophy className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Card className="shadow-card hover:shadow-float transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-secondary/10 overflow-hidden">
      <div className={`h-2 w-full ${getDifficultyColor()}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize text-xs">
                {getTypeIcon()}
                <span className="ml-1">{type}</span>
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {difficulty}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground leading-tight">{title}</h3>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {participants}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {progress.toLocaleString()} / {totalGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Reward: </span>
            <span className="font-medium text-accent">{reward}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {daysLeft} days left
          </Badge>
        </div>
        
        <Button 
          variant={progressPercentage === 100 ? "success" : "energy"} 
          className="w-full"
        >
          {progressPercentage === 100 ? "Completed! 🎉" : "Join Challenge"}
        </Button>
      </CardContent>
    </Card>
  )
}