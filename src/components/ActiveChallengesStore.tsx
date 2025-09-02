import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/enhanced-button"
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    initializeStorage()
    setChallenges(getChallenges())
  }, [])

  const filteredChallenges = selectedDifficulty === "All" 
    ? challenges 
    : challenges.filter(challenge => challenge.difficulty === selectedDifficulty)

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
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Target className="h-6 w-6 mr-2 text-primary" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="All">All Challenges</TabsTrigger>
              <TabsTrigger value="Easy">Easy</TabsTrigger>
              <TabsTrigger value="Medium">Medium</TabsTrigger>
              <TabsTrigger value="Hard">Hard</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedDifficulty} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredChallenges.slice(0, 4).map((challenge) => (
                  <Card 
                    key={challenge.id} 
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                          <p className="text-muted-foreground">{challenge.description}</p>
                        </div>
                        <Badge 
                          className={difficultyColors[challenge.difficulty]} 
                          variant="outline"
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{challenge.points} points</span>
                        </div>
                        <Button variant="energy" size="sm">
                          Start Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredChallenges.length === 0 && (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No challenges available in this difficulty</p>
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