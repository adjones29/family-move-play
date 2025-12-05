import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Gamepad2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { awardPoints } from "@/lib/points"
import { ItemCard } from "@/components/ui/ItemCard"
import { fetchGamesByCategory } from "@/lib/catalog"

interface QuickMiniGamesStoreProps {
  familyMembers: Array<{ id: string; name: string; memberColor: string }>
  onPointsEarned: (points: number) => void
}

type Game = {
  id: string
  title: string | null
  description?: string | null
  points: number | null
  category: string
  image_url?: string | null
}

export function QuickMiniGamesStore({ familyMembers, onPointsEarned }: QuickMiniGamesStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<"exercise" | "fun" | "adventure">("exercise")
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  const loadGames = async () => {
    const data = await fetchGamesByCategory(selectedCategory)
    setGames(data as Game[])
  }

  useEffect(() => {
    loadGames()
  }, [selectedCategory])

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
    setSelectedParticipants([])
    setShowParticipantModal(true)
  }

  const handleStartGame = async () => {
    if (!selectedGame || selectedParticipants.length === 0) return

    try {
      const points = selectedGame.points || 0
      await Promise.all(
        selectedParticipants.map(participantName => {
          const member = familyMembers.find(m => m.name === participantName)
          if (member) {
            return awardPoints({
              memberId: member.id,
              delta: points,
              source: 'mini_game',
              meta: { 
                gameId: selectedGame.id,
                gameTitle: selectedGame.title 
              }
            })
          }
        })
      )

      const totalPoints = points * selectedParticipants.length
      onPointsEarned(totalPoints)
      
      toast({
        title: "Game Completed! 🎮",
        description: `${selectedParticipants.join(", ")} earned ${points} points each for completing "${selectedGame.title}"`,
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
            onChange={(value) => setSelectedCategory(value as "exercise" | "fun" | "adventure")}
            options={[
              { label: 'Exercise', value: 'exercise' },
              { label: 'Fun', value: 'fun' },
              { label: 'Adventure', value: 'adventure' },
            ]}
            ariaLabel="Mini-game category filter"
          />
          
          <div className="space-y-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
              {games.slice(0, 6).map((game) => (
                <ItemCard
                  key={game.id}
                  title={game.title || 'Untitled'}
                  subtitle={`${game.points || 0} pts`}
                  itemId={game.id}
                  itemType="game"
                  row={game}
                  onClick={() => handleGameSelect(game)}
                  className="flex-shrink-0"
                />
              ))}
            </div>
            
            {games.length === 0 && (
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
