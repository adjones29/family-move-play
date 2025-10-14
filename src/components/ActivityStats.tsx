import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Flame, Target } from "lucide-react"

interface ActivityStatsProps {
  totalSteps: number
  weeklySteps: number
  activeMinutes: number
  caloriesBurned: number
  goalsAchieved: number
  totalGoals: number
}

export function ActivityStats({
  totalSteps,
  weeklySteps,
  activeMinutes,
  caloriesBurned,
  goalsAchieved,
  totalGoals
}: ActivityStatsProps) {
  const stats = [
    {
      title: "Daily Family Steps",
      value: totalSteps.toLocaleString(),
      icon: Activity,
      color: "bg-member-1",
      subtext: "Today"
    },
    {
      title: "Weekly Family Steps",
      value: weeklySteps.toLocaleString(),
      icon: Activity,
      color: "bg-member-2", 
      subtext: "Sun - Sat"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-card hover:shadow-float transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-secondary/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} text-white shadow-sm`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <Badge variant="secondary" className="text-xs mt-2">
              {stat.subtext}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}