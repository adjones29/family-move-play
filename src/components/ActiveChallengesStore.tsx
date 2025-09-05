import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { getChallenges, initializeStorage, type Challenge } from "@/utils/localStorage"
import { Target, Trophy, Calendar, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ActiveChallengesStoreProps {
  familyMembers: Array<{ name: string; memberColor: string }>
  onPointsEarned: (points: number) => void
}

export function ActiveChallengesStore({ familyMembers, onPointsEarned }: ActiveChallengesStoreProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    initializeStorage()
    setChallenges(getChallenges())
  }, [])

  const filteredChallenges = challenges.filter(challenge => challenge.difficulty === selectedDifficulty)

  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-600 border-green-500/30",
    Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", 
    Hard: "bg-red-500/10 text-red-600 border-red-500/30"
  }

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setSelectedParticipants([])
    setShowParticipantModal(true)
  }

  const handleStartChallenge = () => {
    if (!selectedChallenge || selectedParticipants.length === 0) return

    const totalPoints = selectedChallenge.points * selectedParticipants.length
    onPointsEarned(totalPoints)
    
    toast({
      title: "Challenge Started! 🎯",
      description: `${selectedParticipants.join(", ")} can earn ${selectedChallenge.points} points each by completing "${selectedChallenge.title}"`,
    })

    setShowParticipantModal(false)
    setSelectedChallenge(null)
    setSelectedParticipants([])
  }

  const toggleParticipant = (memberName: string) => {
    setSelectedParticipants(prev => 
      prev.includes(memberName)
        ? prev.filter(name => name !== memberName)
        : [...prev, memberName]
    )
  }

  return (
    <>
      <Card className="shadow-float">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Active Challenges
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-sm">
              See All
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Easy" className="text-xs">Easy</TabsTrigger>
              <TabsTrigger value="Medium" className="text-xs">Medium</TabsTrigger>
              <TabsTrigger value="Hard" className="text-xs">Hard</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedDifficulty} className="space-y-3">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
                {filteredChallenges.slice(0, 6).map((challenge) => (
                  <Card 
                    key={challenge.id} 
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-48"
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          className={difficultyColors[challenge.difficulty]} 
                          variant="outline"
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="text-sm font-semibold mb-1 line-clamp-2">{challenge.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{challenge.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">{challenge.points} pts</span>
                        </div>
                        <Button variant="default" size="sm" className="text-xs px-2 py-1 h-6">
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredChallenges.length === 0 && (
                <div className="text-center py-6">
                  <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No challenges available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Participants</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose which family members will participate in "{selectedChallenge?.title}"
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.name} className="flex items-center space-x-3">
                <Checkbox
                  id={member.name}
                  checked={selectedParticipants.includes(member.name)}
                  onCheckedChange={() => toggleParticipant(member.name)}
                />
                <label 
                  htmlFor={member.name}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <div className={`w-4 h-4 rounded-full bg-${member.memberColor}`} />
                  <span>{member.name}</span>
                </label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button 
              onClick={handleStartChallenge}
              disabled={selectedParticipants.length === 0}
              className="w-full"
            >
              Start Challenge ({selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}