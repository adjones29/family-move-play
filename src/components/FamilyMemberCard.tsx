import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Zap } from "lucide-react"

interface FamilyMemberCardProps {
  name: string
  avatar?: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
  badges: number
  memberColor: "member-1" | "member-2" | "member-3" | "member-4"
}

export function FamilyMemberCard({
  name,
  avatar,
  dailySteps,
  stepGoal,
  weeklyScore,
  badges,
  memberColor
}: FamilyMemberCardProps) {
  const progressPercentage = Math.min((dailySteps / stepGoal) * 100, 100)
  
  return (
    <Card className="shadow-card hover:shadow-float transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-secondary/20">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`relative`}>
            <Avatar className="h-16 w-16 border-4 border-${memberColor} shadow-lg">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className={`bg-${memberColor} text-white text-lg font-bold`}>
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {progressPercentage === 100 && (
              <div className="absolute -top-2 -right-2 bg-gradient-success rounded-full p-1">
                <Target className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">{name}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                {badges} badges
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {weeklyScore} pts
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Daily Steps</span>
            <span className="font-semibold">
              {dailySteps.toLocaleString()} / {stepGoal.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  )
}