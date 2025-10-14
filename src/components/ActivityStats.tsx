import { Activity } from "lucide-react"
import MetricCard from "@/components/ui/MetricCard"

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      <MetricCard
        title="Daily Family Steps"
        value={totalSteps.toLocaleString()}
        subLabel="Today"
        accent="pink"
        icon={<Activity />}
      />
      <MetricCard
        title="Weekly Family Steps"
        value={weeklySteps.toLocaleString()}
        subLabel="Sun - Sat"
        accent="green"
        icon={<Activity />}
      />
    </div>
  )
}