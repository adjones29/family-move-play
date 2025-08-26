import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Plus, Trophy, Coins, Users, Target } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onChallengeCreated?: (challenge: any) => void
}

interface FamilyMember {
  id: string
  name: string
  role: string
}

interface Reward {
  id: string
  name: string
  description: string
  pointCost: number
}

const mockFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'John Johnson', role: 'parent' },
  { id: '2', name: 'Sarah Johnson', role: 'parent' },
  { id: '3', name: 'Emma Johnson', role: 'child' },
  { id: '4', name: 'Alex Johnson', role: 'child' }
]

const mockRewards: Reward[] = [
  { id: '1', name: 'Movie Night', description: 'Family movie night with popcorn', pointCost: 100 },
  { id: '2', name: 'Ice Cream Trip', description: 'Trip to favorite ice cream shop', pointCost: 50 },
  { id: '3', name: 'Extra Screen Time', description: '30 minutes extra screen time', pointCost: 25 },
  { id: '4', name: 'Choose Dinner', description: 'Pick the family dinner for the week', pointCost: 75 }
]

export function CreateChallengeModal({ isOpen, onClose, onChallengeCreated }: CreateChallengeModalProps) {
  const { toast } = useToast()
  const [challengeData, setChallengeData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    rewardType: 'points' as 'points' | 'reward',
    pointValue: 50,
    selectedReward: '',
    customReward: {
      name: '',
      description: ''
    }
  })
  
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showCustomReward, setShowCustomReward] = useState(false)

  const handleMemberSelection = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId])
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId))
    }
  }

  const handleCreateChallenge = () => {
    if (!challengeData.title || !challengeData.description || !startDate || !endDate || selectedMembers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one family member.",
        variant: "destructive"
      })
      return
    }

    if (challengeData.rewardType === 'reward' && !challengeData.selectedReward && !showCustomReward) {
      toast({
        title: "Missing Reward",
        description: "Please select a reward or create a custom reward.",
        variant: "destructive"
      })
      return
    }

    if (showCustomReward && (!challengeData.customReward.name || !challengeData.customReward.description)) {
      toast({
        title: "Missing Custom Reward",
        description: "Please fill in custom reward name and description.",
        variant: "destructive"
      })
      return
    }

    const newChallenge = {
      id: Date.now().toString(),
      title: challengeData.title,
      description: challengeData.description,
      category: challengeData.category,
      difficulty: challengeData.difficulty,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      participants: selectedMembers,
      rewardType: challengeData.rewardType,
      ...(challengeData.rewardType === 'points' 
        ? { pointValue: challengeData.pointValue }
        : showCustomReward 
          ? { customReward: challengeData.customReward }
          : { rewardId: challengeData.selectedReward }
      ),
      status: 'active',
      progress: 0,
      createdBy: 'current-user',
      createdAt: new Date().toISOString()
    }

    onChallengeCreated?.(newChallenge)
    
    // Reset form
    setChallengeData({
      title: '',
      description: '',
      category: '',
      difficulty: 'medium',
      rewardType: 'points',
      pointValue: 50,
      selectedReward: '',
      customReward: { name: '', description: '' }
    })
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedMembers([])
    setShowCustomReward(false)
    
    toast({
      title: "Challenge Created!",
      description: `${challengeData.title} has been created successfully.`,
    })
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5" />
            Create New Challenge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Challenge Title *</Label>
                <Input
                  id="title"
                  value={challengeData.title}
                  onChange={(e) => setChallengeData({ ...challengeData, title: e.target.value })}
                  placeholder="Enter challenge title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={challengeData.description}
                  onChange={(e) => setChallengeData({ ...challengeData, description: e.target.value })}
                  placeholder="Describe the challenge objectives and rules"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={challengeData.category} onValueChange={(value) => setChallengeData({ ...challengeData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="family-time">Family Time</SelectItem>
                      <SelectItem value="outdoor">Outdoor Activities</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="creativity">Creativity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={challengeData.difficulty} onValueChange={(value) => setChallengeData({ ...challengeData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date <= (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Participants *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockFamilyMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => handleMemberSelection(member.id, !!checked)}
                    />
                    <Label htmlFor={member.id} className="flex items-center gap-2">
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">({member.role})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reward System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reward System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={challengeData.rewardType}
                onValueChange={(value: 'points' | 'reward') => setChallengeData({ ...challengeData, rewardType: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="points" id="points" />
                  <Label htmlFor="points" className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Points Reward
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reward" id="reward" />
                  <Label htmlFor="reward" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Item Reward
                  </Label>
                </div>
              </RadioGroup>

              {challengeData.rewardType === 'points' && (
                <div>
                  <Label htmlFor="point-value">Point Value</Label>
                  <Input
                    id="point-value"
                    type="number"
                    value={challengeData.pointValue}
                    onChange={(e) => setChallengeData({ ...challengeData, pointValue: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="1000"
                    className="w-32"
                  />
                </div>
              )}

              {challengeData.rewardType === 'reward' && (
                <div className="space-y-4">
                  <div>
                    <Label>Select Reward</Label>
                    <Select 
                      value={showCustomReward ? 'custom' : challengeData.selectedReward} 
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setShowCustomReward(true)
                          setChallengeData({ ...challengeData, selectedReward: '' })
                        } else {
                          setShowCustomReward(false)
                          setChallengeData({ ...challengeData, selectedReward: value })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a reward" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRewards.map((reward) => (
                          <SelectItem key={reward.id} value={reward.id}>
                            {reward.name} ({reward.pointCost} points)
                          </SelectItem>
                        ))}
                        <Separator />
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Custom Reward
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showCustomReward && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Custom Reward</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label htmlFor="custom-reward-name">Reward Name *</Label>
                          <Input
                            id="custom-reward-name"
                            value={challengeData.customReward.name}
                            onChange={(e) => setChallengeData({
                              ...challengeData,
                              customReward: { ...challengeData.customReward, name: e.target.value }
                            })}
                            placeholder="Enter reward name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="custom-reward-description">Description *</Label>
                          <Textarea
                            id="custom-reward-description"
                            value={challengeData.customReward.description}
                            onChange={(e) => setChallengeData({
                              ...challengeData,
                              customReward: { ...challengeData.customReward, description: e.target.value }
                            })}
                            placeholder="Describe the reward"
                            rows={2}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This custom reward will only be visible to your family.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateChallenge}>
              Create Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}