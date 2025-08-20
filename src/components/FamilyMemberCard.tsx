import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, Zap } from "lucide-react"

interface FamilyMemberCardProps {
  name: string
  avatar: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
  badges: number
  memberColor: "member-1" | "member-2" | "member-3" | "member-4"
}

export const FamilyMemberCard = ({
  name,
  avatar,
  dailySteps,
  stepGoal,
  weeklyScore,
  badges,
  memberColor
}: FamilyMemberCardProps) => {
  const progressPercentage = Math.min((dailySteps / stepGoal) * 100, 100)
  
  return (
    <Card className="min-w-[280px] shadow-card hover:shadow-hover hover:scale-105 transition-all duration-300 bg-card border-border/30">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full bg-${memberColor} flex items-center justify-center`}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{dailySteps.toLocaleString()} steps</span>
              <span>•</span>
              <span className="flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                {badges} badges
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Daily Goal</span>
            <span className={`font-medium ${progressPercentage >= 100 ? 'text-green-400' : 'text-white'}`}>
              {dailySteps.toLocaleString()} / {stepGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Badge variant="secondary" className="bg-secondary/50 text-gray-300">
            Weekly: {weeklyScore} pts
          </Badge>
          {progressPercentage >= 100 && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Goal Complete!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}