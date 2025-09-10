import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, TrendingUp } from "lucide-react"

interface FamilyMemberCardProps {
  name: string
  avatar: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
  memberColor: "member-1" | "member-2" | "member-3" | "member-4"
  points: number
  weeklySteps?: number
  onClick: () => void
}

export const FamilyMemberCard = ({
  name,
  avatar,
  dailySteps,
  stepGoal,
  weeklyScore,
  memberColor,
  points,
  weeklySteps,
  onClick
}: FamilyMemberCardProps) => {
  const dailyProgressPercentage = Math.min((dailySteps / stepGoal) * 100, 100)
  const weeklyGoal = stepGoal * 7
  const currentWeeklySteps = weeklySteps || dailySteps * 3 + Math.floor(Math.random() * stepGoal * 2) // Mock weekly data
  const weeklyProgressPercentage = Math.min((currentWeeklySteps / weeklyGoal) * 100, 100)
  
  return (
    <Card 
      className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-48"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-full bg-${memberColor} flex items-center justify-center`}>
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-card-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{name}</h3>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span>{dailySteps.toLocaleString()}</span>
                <span>•</span>
                <span className="flex items-center">
                  <TrendingUp className="h-2 w-2 mr-1" />
                  {points}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Daily Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Daily</span>
              <span className={`font-medium ${dailyProgressPercentage >= 100 ? 'text-green-600' : 'text-card-foreground'}`}>
                {dailySteps.toLocaleString()} / {stepGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={dailyProgressPercentage} className="h-1" />
          </div>

          {/* Weekly Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Weekly</span>
              <span className={`font-medium ${weeklyProgressPercentage >= 100 ? 'text-green-600' : 'text-card-foreground'}`}>
                {currentWeeklySteps.toLocaleString()} / {weeklyGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={weeklyProgressPercentage} className="h-1" />
          </div>
        </div>
        
        {(dailyProgressPercentage >= 100 || weeklyProgressPercentage >= 100) && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-2">
            {dailyProgressPercentage >= 100 && weeklyProgressPercentage >= 100 ? 'Both Complete!' : 
             weeklyProgressPercentage >= 100 ? 'Weekly Complete!' : 'Daily Complete!'}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}