import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { getMiniGames, initializeStorage, type MiniGame } from "@/utils/localStorage"
import { Gamepad2, Users, Clock, Trophy, Dumbbell, Heart, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickMiniGamesStoreProps {
  familyMembers: Array<{ name: string; memberColor: string }>
  onPointsEarned: (points: number) => void
}

export function QuickMiniGamesStore({ familyMembers, onPointsEarned }: QuickMiniGamesStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Exercise" | "Fun" | "Adventure">("All")
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    initializeStorage()
    setMiniGames(getMiniGames())
  }, [])

  const filteredGames = selectedCategory === "All" 
    ? miniGames 
    : miniGames.filter(game => game.category === selectedCategory)

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

  const handleStartGame = () => {
    if (!selectedGame || selectedParticipants.length === 0) return

    const totalPoints = selectedGame.points * selectedParticipants.length
    onPointsEarned(totalPoints)
    
    toast({
      title: "Game Started! 🎮",
      description: `${selectedParticipants.join(", ")} can earn ${selectedGame.points} points each by completing "${selectedGame.title}"`,
    })

    setShowParticipantModal(false)
    setSelectedGame(null)
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
            <Gamepad2 className="h-6 w-6 mr-2 text-primary" />
            Quick Mini-Games
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="All">All Games</TabsTrigger>
              <TabsTrigger value="Exercise">Exercise</TabsTrigger>
              <TabsTrigger value="Fun">Fun</TabsTrigger>
              <TabsTrigger value="Adventure">Adventure</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedCategory} className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.slice(0, 6).map((game) => (
                  <Card 
                    key={game.id} 
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => handleGameSelect(game)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            {getCategoryIcon(game.category)}
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {game.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{game.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{game.points} points</span>
                        </div>
                        <Button variant="energy" size="sm">
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredGames.length === 0 && (
                <div className="text-center py-8">
                  <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No mini-games available in this category</p>
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