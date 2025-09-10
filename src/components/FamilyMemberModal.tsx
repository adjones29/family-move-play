import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Target, TrendingUp, Calendar as CalendarIcon, Trophy, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { 
  upsertStepEntry, 
  getTodaySteps, 
  getWeeklySteps,
  formatToLocalDate 
} from "@/utils/stepTracking"

interface FamilyMember {
  name: string
  avatar: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
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
  const { toast } = useToast()
  const [stepsToAdd, setStepsToAdd] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [todaySteps, setTodaySteps] = useState(0)
  const [weeklySteps, setWeeklySteps] = useState(0)
  const [isAddingSteps, setIsAddingSteps] = useState(false)

  useEffect(() => {
    if (member) {
      setNewGoal(member.stepGoal.toString())
      loadStepData()
    }
  }, [member])

  const loadStepData = async () => {
    if (!member) return
    
    try {
      const [todayTotal, weeklyTotal] = await Promise.all([
        getTodaySteps(member.name),
        getWeeklySteps(member.name)
      ])
      
      setTodaySteps(todayTotal)
      setWeeklySteps(weeklyTotal)
    } catch (error) {
      console.error('Error loading step data:', error)
    }
  }

  const handleAddSteps = async () => {
    const steps = parseInt(stepsToAdd)
    if (isNaN(steps) || steps <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of steps",
        variant: "destructive"
      })
      return
    }

    if (steps > 100000) {
      toast({
        title: "Invalid Input",
        description: "Steps cannot exceed 100,000 per entry",
        variant: "destructive"
      })
      return
    }

    setIsAddingSteps(true)
    
    try {
      await upsertStepEntry(member.name, selectedDate, steps)
      
      // Reload step data
      await loadStepData()
      
      // Update member points (1 point per 100 steps)
      const updatedMember = {
        ...member,
        points: member.points + Math.floor(steps / 100)
      }
      onUpdate(updatedMember)
      
      setStepsToAdd("")
      
      const dateStr = formatToLocalDate(selectedDate)
      const isToday = dateStr === formatToLocalDate(new Date())
      
      toast({
        title: "Steps Added! 🎯",
        description: `Added ${steps.toLocaleString()} steps for ${member.name} on ${format(selectedDate, 'MMM d, yyyy')}${isToday ? ' (today)' : ''}`,
      })
    } catch (error) {
      console.error('Error adding steps:', error)
      toast({
        title: "Error",
        description: "Failed to add steps. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAddingSteps(false)
    }
  }

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal)
    if (isNaN(goal) || goal <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid step goal",
        variant: "destructive"
      })
      return
    }

    const updatedMember = {
      ...member,
      stepGoal: goal
    }

    onUpdate(updatedMember)
    
    toast({
      title: "Goal Updated! 🎯",
      description: `Daily step goal set to ${goal.toLocaleString()} for ${member.name}`,
    })
  }

  if (!member) return null

  const dailyProgressPercentage = Math.min((todaySteps / member.stepGoal) * 100, 100)
  const weeklyGoal = member.stepGoal * 7
  const weeklyProgressPercentage = Math.min((weeklySteps / weeklyGoal) * 100, 100)
  
  // Date picker constraints
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 1)
  const maxDate = new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-${member.memberColor} flex items-center justify-center`}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-card-foreground" />
              )}
            </div>
            <div>
              <div className="text-xl font-bold">{member.name}'s Progress</div>
              <div className="text-sm text-muted-foreground font-normal">
                {member.points} points
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Progress Tracking
            </h3>
            
            {/* Today's Steps */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Today's Steps</span>
                  <span className="text-2xl font-bold text-primary">
                    {todaySteps.toLocaleString()}
                  </span>
                </div>
                <Progress value={dailyProgressPercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Goal: {member.stepGoal.toLocaleString()}</span>
                  <span>{Math.round(dailyProgressPercentage)}% Complete</span>
                </div>
                {dailyProgressPercentage >= 100 && (
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs mt-2">
                    Daily Goal Complete! 🎉
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Progress (Sun-Sat)</span>
                  <span className="text-2xl font-bold text-green-600">
                    {weeklySteps.toLocaleString()}
                  </span>
                </div>
                <Progress value={weeklyProgressPercentage} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Goal: {weeklyGoal.toLocaleString()}</span>
                  <span>{Math.round(weeklyProgressPercentage)}% Complete</span>
                </div>
                {weeklyProgressPercentage >= 100 && (
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs mt-2">
                    Weekly Goal Complete! 🏆
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Add Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Add Steps
            </h3>
            
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date > maxDate || date < minDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Steps Input */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter steps to add"
                value={stepsToAdd}
                onChange={(e) => setStepsToAdd(e.target.value)}
                className="flex-1"
                min="1"
                max="100000"
              />
              <Button 
                onClick={handleAddSteps} 
                className="px-6"
                disabled={isAddingSteps}
              >
                {isAddingSteps ? "Adding..." : "Add"}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Adding steps for {format(selectedDate, "MMM d, yyyy")}
              {formatToLocalDate(selectedDate) === formatToLocalDate(new Date()) && " (today)"}
            </div>
          </div>

          <Separator />

          {/* Update Goal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Daily Step Goal
            </h3>
            
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={member.stepGoal.toString()}
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="flex-1"
                min="1"
                max="50000"
              />
              <Button onClick={handleUpdateGoal} variant="outline" className="px-6">
                Update
              </Button>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{member.points} points</span>
              </div>
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