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
  badges: number
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
  badges,
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
      className="w-full shadow-card hover:shadow-hover active:scale-95 transition-all duration-300 bg-card border-border/30 cursor-pointer min-h-[120px]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-${memberColor} flex items-center justify-center`}>
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-card-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-card-foreground text-lg">{name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{dailySteps.toLocaleString()} steps</span>
                <span>•</span>
                <span className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {points} pts
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Daily Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Goal</span>
              <span className={`font-medium ${dailyProgressPercentage >= 100 ? 'text-green-600' : 'text-card-foreground'}`}>
                {dailySteps.toLocaleString()} / {stepGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={dailyProgressPercentage} className="h-2" />
          </div>

          {/* Weekly Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weekly Goal</span>
              <span className={`font-medium ${weeklyProgressPercentage >= 100 ? 'text-green-600' : 'text-card-foreground'}`}>
                {currentWeeklySteps.toLocaleString()} / {weeklyGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={weeklyProgressPercentage} className="h-2" />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground text-xs">
            Tap to manage
          </Badge>
          {(dailyProgressPercentage >= 100 || weeklyProgressPercentage >= 100) && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              {dailyProgressPercentage >= 100 && weeklyProgressPercentage >= 100 ? 'Both Complete!' : 
               weeklyProgressPercentage >= 100 ? 'Weekly Complete!' : 'Daily Complete!'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}