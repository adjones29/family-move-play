import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { MiniGameModal } from "@/components/MiniGameModal"
import { CreateMiniGameModal } from "@/components/CreateMiniGameModal"
import { ArrowLeft, GamepadIcon, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getMiniGames, addMiniGame, initializeStorage, type MiniGame } from "@/utils/localStorage"
import { CarouselRow } from "@/components/ui/CarouselRow"
import { CarouselItem } from "@/components/ui/carousel"
import { ItemCard } from "@/components/ui/ItemCard"

const Games = () => {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [exerciseGames, setExerciseGames] = useState<MiniGame[]>([])
  const [funGames, setFunGames] = useState<MiniGame[]>([])
  const [adventureGames, setAdventureGames] = useState<MiniGame[]>([])

  useEffect(() => {
    initializeStorage()
    const allGames = getMiniGames()
    setExerciseGames(allGames.filter(g => g.category === 'Exercise'))
    setFunGames(allGames.filter(g => g.category === 'Fun'))
    setAdventureGames(allGames.filter(g => g.category === 'Adventure'))
  }, [])

  const handleGameCreated = (newGame: Omit<MiniGame, 'id'>) => {
    addMiniGame(newGame)
    const allGames = getMiniGames()
    setExerciseGames(allGames.filter(g => g.category === 'Exercise'))
    setFunGames(allGames.filter(g => g.category === 'Fun'))
    setAdventureGames(allGames.filter(g => g.category === 'Adventure'))
  }

  const handleGameClick = (game: MiniGame) => {
    setSelectedGame(game)
    setShowGameModal(true)
  }

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

      <div className="py-6 space-y-8">
        <CarouselRow title="Exercise">
          {exerciseGames.map((game) => (
            <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={game.title}
                subtitle={game.description}
                badge={`${game.points} pts`}
                onClick={() => handleGameClick(game)}
              />
            </CarouselItem>
          ))}
          {exerciseGames.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No exercise games
              </div>
            </CarouselItem>
          )}
        </CarouselRow>

        <CarouselRow title="Fun">
          {funGames.map((game) => (
            <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={game.title}
                subtitle={game.description}
                badge={`${game.points} pts`}
                onClick={() => handleGameClick(game)}
              />
            </CarouselItem>
          ))}
          {funGames.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No fun games
              </div>
            </CarouselItem>
          )}
        </CarouselRow>

        <CarouselRow title="Adventure">
          {adventureGames.map((game) => (
            <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={game.title}
                subtitle={game.description}
                badge={`${game.points} pts`}
                onClick={() => handleGameClick(game)}
              />
            </CarouselItem>
          ))}
          {adventureGames.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No adventure games
              </div>
            </CarouselItem>
          )}
        </CarouselRow>
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