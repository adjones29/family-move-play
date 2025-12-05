import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { getMiniGames, initializeStorage, type MiniGame } from "@/utils/localStorage"
import { Gamepad2, Users, Clock, Trophy, Dumbbell, Heart, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { awardPoints } from "@/lib/points"

interface QuickMiniGamesStoreProps {
  familyMembers: Array<{ id: string; name: string; memberColor: string }>
  onPointsEarned: (points: number) => void
}

export function QuickMiniGamesStore({ familyMembers, onPointsEarned }: QuickMiniGamesStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<"Exercise" | "Fun" | "Adventure">("Exercise")
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    initializeStorage()
    setMiniGames(getMiniGames())
  }, [])

  const filteredGames = miniGames.filter(game => game.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Exercise':
        return <Dumbbell className="h-5 w-5" />
      case 'Fun':
        return <Heart className="h-5 w-5" />
      case 'Adventure':
        return <Zap className="h-5 w-5" />
      default:
        return <Gamepad2 className="h-5 w-5" />
    }
  }

  const handleGameSelect = (game: MiniGame) => {
    setSelectedGame(game)
    setSelectedParticipants([])
    setShowParticipantModal(true)
  }

  const handleStartGame = async () => {
    if (!selectedGame || selectedParticipants.length === 0) return

    try {
      // Award points to each participant
      await Promise.all(
        selectedParticipants.map(participantName => {
          const member = familyMembers.find(m => m.name === participantName)
          if (member) {
            return awardPoints({
              memberId: member.id,
              delta: selectedGame.points,
              source: 'mini_game',
              meta: { 
                gameId: selectedGame.id,
                gameTitle: selectedGame.title 
              }
            })
          }
        })
      )

      const totalPoints = selectedGame.points * selectedParticipants.length
      onPointsEarned(totalPoints)
      
      toast({
        title: "Game Completed! 🎮",
        description: `${selectedParticipants.join(", ")} earned ${selectedGame.points} points each for completing "${selectedGame.title}"`,
      })

      setShowParticipantModal(false)
      setSelectedGame(null)
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
              <Gamepad2 className="h-5 w-5 mr-2 text-primary" />
              Quick Mini-Games
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-sm">
              See All
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <SegmentedControl
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as "Exercise" | "Fun" | "Adventure")}
            options={[
              { label: 'Exercise', value: 'Exercise' },
              { label: 'Fun', value: 'Fun' },
              { label: 'Adventure', value: 'Adventure' },
            ]}
            ariaLabel="Mini-game category filter"
          />
          
          <div className="space-y-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
              {filteredGames.slice(0, 6).map((game) => (
                <Card 
                  key={game.id} 
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-48"
                  onClick={() => handleGameSelect(game)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-primary/20 rounded-md text-primary">
                        {getCategoryIcon(game.category)}
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                        {game.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2">{game.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium">{game.points} pts</span>
                      </div>
                      <Button variant="default" size="sm" className="text-xs px-2 py-1 h-6">
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredGames.length === 0 && (
              <div className="text-center py-6">
                <Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No games available</p>
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
              Choose which family members will participate in "{selectedGame?.title}"
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
              onClick={handleStartGame}
              disabled={selectedParticipants.length === 0}
              className="w-full"
            >
              Start Game ({selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}