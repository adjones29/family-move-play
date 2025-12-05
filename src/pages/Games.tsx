import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { CreateMiniGameModal } from "@/components/CreateMiniGameModal"
import { ArrowLeft, GamepadIcon, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { fetchGamesByCategory } from "@/lib/catalog"
import { CarouselRow } from "@/components/ui/CarouselRow"
import { CarouselItem } from "@/components/ui/carousel"
import { ItemCard } from "@/components/ui/ItemCard"
import ItemOverlay, { type OverlayItem } from "@/components/detail/ItemOverlay"
import { useToast } from "@/hooks/use-toast"

type Game = {
  id: string
  title: string
  description?: string
  image_url?: string
  category: string
}

const Games = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [exerciseGames, setExerciseGames] = useState<Game[]>([])
  const [funGames, setFunGames] = useState<Game[]>([])
  const [adventureGames, setAdventureGames] = useState<Game[]>([])
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayItem, setOverlayItem] = useState<OverlayItem | null>(null)

  const loadGames = async () => {
    const exercise = await fetchGamesByCategory('exercise')
    const fun = await fetchGamesByCategory('fun')
    const adventure = await fetchGamesByCategory('adventure')
    setExerciseGames(exercise)
    setFunGames(fun)
    setAdventureGames(adventure)
  }

  useEffect(() => {
    loadGames()
  }, [])

  const handleGameCreated = () => {
    loadGames()
  }

  const handleGameClick = (game: Game) => {
    setOverlayItem({
      id: game.id,
      title: game.title,
      description: game.description || '',
      category: game.category
    })
    setOverlayOpen(true)
  }

  const handlePlay = (item: OverlayItem, memberIds: string[]) => {
    // Start game logic here
    toast({
      title: "Game Started!",
      description: `${item.title} has been started for ${memberIds.length} member${memberIds.length > 1 ? 's' : ''}.`
    })
    setOverlayOpen(false)
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
                subtitle="Exercise"
                row={game}
                itemId={game.id}
                itemType="game"
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
                subtitle="Fun"
                row={game}
                itemId={game.id}
                itemType="game"
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
                subtitle="Adventure"
                row={game}
                itemId={game.id}
                itemType="game"
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

      <CreateMiniGameModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGameCreated={handleGameCreated}
      />

      <ItemOverlay
        kind="game"
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        item={overlayItem}
        onPlay={handlePlay}
      />
    </div>
  )
}

export default Games