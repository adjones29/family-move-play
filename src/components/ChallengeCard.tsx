import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Calendar, Users, Trophy, ChevronRight } from "lucide-react"

interface ChallengeCardProps {
  title: string
  description: string
  type: "daily" | "weekly" | "special"
  participants: number
  progress: number
  totalGoal: number
  daysLeft: number
  reward: string
  difficulty: "easy" | "medium" | "hard"
}

export const ChallengeCard = ({
  title,
  description,
  type,
  participants,
  progress,
  totalGoal,
  daysLeft,
  reward,
  difficulty
}: ChallengeCardProps) => {
  const progressPercentage = (progress / totalGoal) * 100
  
  const typeColors = {
    daily: "bg-green-500/20 text-green-400 border-green-500/30",
    weekly: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
    special: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  }
  
  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400"
  }

  return (
    <Card className="min-w-[320px] shadow-card hover:shadow-hover hover:scale-105 transition-all duration-300 bg-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge className={typeColors[type]} variant="outline">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          <Badge className={difficultyColors[difficulty]} variant="secondary">
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">{description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-white">
              {type === "daily" ? `${progress}/${totalGoal} days` : `${progress.toLocaleString()}/${totalGoal.toLocaleString()}`}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {participants} family members
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {daysLeft} days left
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-sm">
            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-medium text-white">{reward}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}