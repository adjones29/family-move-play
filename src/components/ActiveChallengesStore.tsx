import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { awardPoints } from "@/lib/points"
import { ItemCard } from "@/components/ui/ItemCard"
import { fetchChallengesByDifficulty } from "@/lib/catalog"

interface ActiveChallengesStoreProps {
  familyMembers: Array<{ id: string; name: string; memberColor: string }>
  onPointsEarned: (points: number) => void
}

type Challenge = {
  id: string
  title: string
  description?: string | null
  points: number
  difficulty: string
  image_url?: string | null
}

export function ActiveChallengesStore({ familyMembers, onPointsEarned }: ActiveChallengesStoreProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  const loadChallenges = async () => {
    const data = await fetchChallengesByDifficulty(selectedDifficulty)
    setChallenges(data as Challenge[])
  }

  useEffect(() => {
    loadChallenges()
  }, [selectedDifficulty])

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setSelectedParticipants([])
    setShowParticipantModal(true)
  }

  const handleStartChallenge = async () => {
    if (!selectedChallenge || selectedParticipants.length === 0) return

    try {
      await Promise.all(
        selectedParticipants.map(participantName => {
          const member = familyMembers.find(m => m.name === participantName)
          if (member) {
            return awardPoints({
              memberId: member.id,
              delta: selectedChallenge.points,
              source: 'challenge',
              meta: { 
                challengeId: selectedChallenge.id,
                challengeTitle: selectedChallenge.title 
              }
            })
          }
        })
      )

      const totalPoints = selectedChallenge.points * selectedParticipants.length
      onPointsEarned(totalPoints)
      
      toast({
        title: "Challenge Completed! 🎯",
        description: `${selectedParticipants.join(", ")} earned ${selectedChallenge.points} points each for completing "${selectedChallenge.title}"`,
      })

      setShowParticipantModal(false)
      setSelectedChallenge(null)
      setSelectedParticipants([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to award points. Please try again.",
        variant: "destructive"
      })
    }
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
        
        <CardContent className="space-y-4">
          <SegmentedControl
            value={selectedDifficulty}
            onChange={(value) => setSelectedDifficulty(value as "easy" | "medium" | "hard")}
            options={[
              { label: 'Easy', value: 'easy' },
              { label: 'Medium', value: 'medium' },
              { label: 'Hard', value: 'hard' },
            ]}
            ariaLabel="Challenge difficulty filter"
          />
          
          <div className="space-y-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
              {challenges.slice(0, 6).map((challenge) => (
                <ItemCard
                  key={challenge.id}
                  title={challenge.title}
                  subtitle={`${challenge.points} pts`}
                  itemId={challenge.id}
                  itemType="challenge"
                  row={challenge}
                  onClick={() => handleChallengeSelect(challenge)}
                  className="flex-shrink-0"
                />
              ))}
            </div>
            
            {challenges.length === 0 && (
              <div className="text-center py-6">
                <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No challenges available</p>
              </div>
            )}
          </div>
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
                  className="cursor-pointer flex-1"
                >
                  {member.name}
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
