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
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => handleGameClick(game)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              {getCategoryIcon(game.category)}
            </div>
            <CardTitle className="text-lg">{game.title}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {game.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{game.description}</p>
        
        <div className="flex items-center justify-between pt-2">
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
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm text-white sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <GamepadIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Mini Games</h1>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="bg-white text-black hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Game
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="All">All Games</TabsTrigger>
            <TabsTrigger value="Exercise">Exercise</TabsTrigger>
            <TabsTrigger value="Fun">Fun</TabsTrigger>
            <TabsTrigger value="Adventure">Adventure</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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