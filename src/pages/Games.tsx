import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MiniGameModal } from "@/components/MiniGameModal"
import { CreateMiniGameModal } from "@/components/CreateMiniGameModal"
import { ArrowLeft, Users, Clock, Trophy, Target, Dumbbell, Zap, Heart, GamepadIcon, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Games = () => {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [customGames, setCustomGames] = useState<any[]>([])

  const quickGames = [
    {
      title: "Push-up Challenge",
      description: "See who can do the most push-ups in 60 seconds!",
      duration: "1-2 min",
      participants: "2-4 players",
      difficulty: "medium" as const,
      points: 50,
      icon: <Dumbbell className="h-6 w-6" />,
      category: "strength"
    },
    {
      title: "Animal Yoga",
      description: "Copy fun animal poses and movements together",
      duration: "5-10 min",
      participants: "1-4 players",
      difficulty: "easy" as const,
      points: 30,
      icon: <Target className="h-6 w-6" />,
      category: "flexibility"
    },
    {
      title: "Obstacle Course", 
      description: "Navigate through a living room obstacle course",
      duration: "3-5 min",
      participants: "1-4 players",
      difficulty: "hard" as const,
      points: 75,
      icon: <Zap className="h-6 w-6" />,
      category: "agility"
    }
  ]

  const cardioGames = [
    {
      title: "Dance Battle",
      description: "Follow the rhythm and dance moves for 3 minutes",
      duration: "3-5 min",
      participants: "1-4 players",
      difficulty: "medium" as const,
      points: 60,
      icon: <Heart className="h-6 w-6" />,
      category: "cardio"
    },
    {
      title: "Jumping Jacks Race",
      description: "Who can do 100 jumping jacks the fastest?",
      duration: "2-3 min",
      participants: "2-4 players",
      difficulty: "easy" as const,
      points: 40,
      icon: <Zap className="h-6 w-6" />,
      category: "cardio"
    }
  ]

  const teamGames = [
    {
      title: "Family Fitness Relay",
      description: "Complete stations together as a team",
      duration: "10-15 min",
      participants: "3-4 players",
      difficulty: "hard" as const,
      points: 100,
      icon: <Users className="h-6 w-6" />,
      category: "team"
    },
    {
      title: "Mirror Exercise",
      description: "Copy each other's movements in sync",
      duration: "5-7 min",
      participants: "2-4 players", 
      difficulty: "easy" as const,
      points: 35,
      icon: <Target className="h-6 w-6" />,
      category: "team"
    }
  ]

  const handleGameCreated = (newGame: any) => {
    setCustomGames([...customGames, newGame])
  }

  const allQuickGames = [...quickGames, ...customGames.filter(g => g.category === 'quick' || !g.category)]
  const allCardioGames = [...cardioGames, ...customGames.filter(g => g.category === 'cardio')]
  const allTeamGames = [...teamGames, ...customGames.filter(g => g.category === 'team')]

  const difficultyColors = {
    easy: "bg-green-500/10 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    hard: "bg-red-500/10 text-red-600 border-red-500/30"
  }

  const handleGameClick = (game: any) => {
    setSelectedGame(game)
    setShowGameModal(true)
  }

  const GameCard = ({ game }: { game: any }) => (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => handleGameClick(game)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              {game.icon || <GamepadIcon className="h-6 w-6" />}
            </div>
            <CardTitle className="text-lg">{game.title}</CardTitle>
          </div>
          <Badge className={difficultyColors[game.difficulty]} variant="outline">
            {game.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{game.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{game.duration}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{game.participants}</span>
          </div>
        </div>

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
        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Quick Games</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="team">Team Games</TabsTrigger>
          </TabsList>

          <TabsContent value="quick">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allQuickGames.map((game, index) => (
                <GameCard key={game.id || index} game={game} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cardio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCardioGames.map((game, index) => (
                <GameCard key={game.id || index} game={game} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTeamGames.map((game, index) => (
                <GameCard key={game.id || index} game={game} />
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