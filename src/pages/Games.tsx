import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MiniGameModal } from "@/components/MiniGameModal"
import { CreateMiniGameModal } from "@/components/CreateMiniGameModal"
import { ArrowLeft, Users, Clock, Trophy, Target, Dumbbell, Zap, Heart, GamepadIcon, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getMiniGames, addMiniGame, initializeStorage, type MiniGame } from "@/utils/localStorage"

const Games = () => {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Exercise' | 'Fun' | 'Adventure'>('All')

  useEffect(() => {
    initializeStorage()
    setMiniGames(getMiniGames())
  }, [])

  const handleGameCreated = (newGame: Omit<MiniGame, 'id'>) => {
    addMiniGame(newGame)
    setMiniGames(getMiniGames())
  }

  const filteredGames = selectedCategory === 'All' 
    ? miniGames 
    : miniGames.filter(game => game.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Exercise':
        return <Dumbbell className="h-6 w-6" />
      case 'Fun':
        return <Heart className="h-6 w-6" />
      case 'Adventure':
        return <Zap className="h-6 w-6" />
      default:
        return <GamepadIcon className="h-6 w-6" />
    }
  }

  const handleGameClick = (game: MiniGame) => {
    setSelectedGame(game)
    setShowGameModal(true)
  }

  const GameCard = ({ game }: { game: MiniGame }) => (
    <Card 
      className="cursor-pointer transition-all duration-300 active:scale-95"
      onClick={() => handleGameClick(game)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              {getCategoryIcon(game.category)}
            </div>
            <div>
              <CardTitle className="text-base">{game.title}</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs mt-1">
                {game.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-sm">{game.points} points</span>
          </div>
          <Button variant="energy" size="sm" className="h-8">
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="pb-20"> {/* Bottom padding for navigation */}
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GamepadIcon className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Games</h1>
                <p className="text-sm text-muted-foreground">Mini Activities</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>
      </header>

      <div className="px-4 py-4">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Exercise" className="text-xs">Exercise</TabsTrigger>
            <TabsTrigger value="Fun" className="text-xs">Fun</TabsTrigger>
            <TabsTrigger value="Adventure" className="text-xs">Adventure</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MiniGameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        game={selectedGame}
      />

      <CreateMiniGameModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGameCreated={handleGameCreated}
      />
    </div>
  )
}

export default Games