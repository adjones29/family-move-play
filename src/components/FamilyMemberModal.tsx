import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User, Target, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface FamilyMember {
  name: string
  avatar: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
  badges: number
  memberColor: "member-1" | "member-2" | "member-3" | "member-4"
  points: number
  weeklySteps?: number
}

interface FamilyMemberModalProps {
  member: FamilyMember | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedMember: FamilyMember) => void
}

export const FamilyMemberModal = ({ member, isOpen, onClose, onUpdate }: FamilyMemberModalProps) => {
  const [steps, setSteps] = useState("")
  const [dailyGoal, setDailyGoal] = useState("")

  if (!member) return null

  const weeklyGoal = member.stepGoal * 7
  const currentWeeklySteps = member.weeklySteps || member.dailySteps * 3 + Math.floor(Math.random() * member.stepGoal * 2) // Mock weekly data
  const weeklyProgress = Math.min((currentWeeklySteps / weeklyGoal) * 100, 100)
  const dailyProgress = Math.min((member.dailySteps / member.stepGoal) * 100, 100)

  const handleAddSteps = () => {
    if (!steps || isNaN(Number(steps))) {
      toast.error("Please enter a valid number of steps")
      return
    }

    const additionalSteps = Number(steps)
    const newDailySteps = member.dailySteps + additionalSteps
    const newWeeklySteps = currentWeeklySteps + additionalSteps
    
    // Calculate points earned
    let pointsEarned = 0
    const wasDaily = member.dailySteps >= member.stepGoal
    const isDaily = newDailySteps >= member.stepGoal
    const wasWeekly = currentWeeklySteps >= weeklyGoal
    const isWeekly = newWeeklySteps >= weeklyGoal
    
    if (!wasDaily && isDaily) pointsEarned += 1
    if (!wasWeekly && isWeekly) pointsEarned += 5

    const updatedMember = {
      ...member,
      dailySteps: newDailySteps,
      weeklySteps: newWeeklySteps,
      points: member.points + pointsEarned
    }

    onUpdate(updatedMember)
    setSteps("")
    
    if (pointsEarned > 0) {
      toast.success(`${member.name} earned ${pointsEarned} points!`)
    } else {
      toast.success(`Added ${additionalSteps.toLocaleString()} steps for ${member.name}`)
    }
  }

  const handleUpdateGoal = () => {
    if (!dailyGoal || isNaN(Number(dailyGoal)) || Number(dailyGoal) <= 0) {
      toast.error("Please enter a valid daily step goal")
      return
    }

    const updatedMember = {
      ...member,
      stepGoal: Number(dailyGoal)
    }

    onUpdate(updatedMember)
    setDailyGoal("")
    toast.success(`Daily goal updated to ${Number(dailyGoal).toLocaleString()} steps`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-${member.memberColor} flex items-center justify-center`}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-card-foreground" />
              )}
            </div>
            {member.name}'s Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stats */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Steps</span>
                <span className="font-medium">{member.dailySteps.toLocaleString()}</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Goal: {member.stepGoal.toLocaleString()}</span>
                <span>{dailyProgress.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Weekly Progress</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium">{currentWeeklySteps.toLocaleString()}</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Goal: {weeklyGoal.toLocaleString()}</span>
                <span>{weeklyProgress.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Add Steps */}
          <div className="space-y-2">
            <Label htmlFor="steps">Enter Steps</Label>
            <div className="flex gap-2">
              <Input
                id="steps"
                type="number"
                placeholder="e.g. 2500"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
              <Button onClick={handleAddSteps} variant="default">
                Add
              </Button>
            </div>
          </div>

          {/* Update Daily Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Daily Step Goal
            </Label>
            <div className="flex gap-2">
              <Input
                id="goal"
                type="number"
                placeholder={member.stepGoal.toString()}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
              />
              <Button onClick={handleUpdateGoal} variant="outline">
                Update
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Total Points: <span className="font-medium text-foreground">{member.points}</span>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}