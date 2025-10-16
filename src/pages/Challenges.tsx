import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { ArrowLeft, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CreateChallengeModal } from "@/components/CreateChallengeModal"
import { getChallenges, addChallenge, initializeStorage, type Challenge } from "@/utils/localStorage"
import { CarouselRow } from "@/components/ui/CarouselRow"
import { CarouselItem } from "@/components/ui/carousel"
import { ItemCard } from "@/components/ui/ItemCard"
import ItemOverlay, { type OverlayItem } from "@/components/detail/ItemOverlay"
import { useToast } from "@/hooks/use-toast"

const Challenges = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [easyChallenges, setEasyChallenges] = useState<Challenge[]>([])
  const [mediumChallenges, setMediumChallenges] = useState<Challenge[]>([])
  const [hardChallenges, setHardChallenges] = useState<Challenge[]>([])
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayItem, setOverlayItem] = useState<OverlayItem | null>(null)

  useEffect(() => {
    initializeStorage()
    const allChallenges = getChallenges()
    setEasyChallenges(allChallenges.filter(c => c.difficulty === 'Easy'))
    setMediumChallenges(allChallenges.filter(c => c.difficulty === 'Medium'))
    setHardChallenges(allChallenges.filter(c => c.difficulty === 'Hard'))
  }, [])

  const handleChallengeCreated = (newChallenge: Omit<Challenge, 'id'>) => {
    addChallenge(newChallenge)
    const allChallenges = getChallenges()
    setEasyChallenges(allChallenges.filter(c => c.difficulty === 'Easy'))
    setMediumChallenges(allChallenges.filter(c => c.difficulty === 'Medium'))
    setHardChallenges(allChallenges.filter(c => c.difficulty === 'Hard'))
  }

  const handleChallengeClick = (challenge: Challenge) => {
    setOverlayItem({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      points: challenge.points
    })
    setOverlayOpen(true)
  }

  const handlePlay = (item: OverlayItem, memberIds: string[]) => {
    // Start challenge logic here
    toast({
      title: "Challenge Started!",
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
            <div>
              <h1 className="text-xl font-bold">Challenges</h1>
              <p className="text-sm text-muted-foreground">Family Activities</p>
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
        <CarouselRow title="Easy">
          {easyChallenges.map((challenge) => (
            <CarouselItem key={challenge.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={challenge.title}
                subtitle={`${challenge.points} pts`}
                onClick={() => handleChallengeClick(challenge)}
              />
            </CarouselItem>
          ))}
          {easyChallenges.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No easy challenges
              </div>
            </CarouselItem>
          )}
        </CarouselRow>

        <CarouselRow title="Medium">
          {mediumChallenges.map((challenge) => (
            <CarouselItem key={challenge.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={challenge.title}
                subtitle={`${challenge.points} pts`}
                onClick={() => handleChallengeClick(challenge)}
              />
            </CarouselItem>
          ))}
          {mediumChallenges.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No medium challenges
              </div>
            </CarouselItem>
          )}
        </CarouselRow>

        <CarouselRow title="Hard">
          {hardChallenges.map((challenge) => (
            <CarouselItem key={challenge.id} className="pl-2 md:pl-4 basis-auto">
              <ItemCard
                title={challenge.title}
                subtitle={`${challenge.points} pts`}
                onClick={() => handleChallengeClick(challenge)}
              />
            </CarouselItem>
          ))}
          {hardChallenges.length === 0 && (
            <CarouselItem className="pl-2 md:pl-4 basis-auto">
              <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                No hard challenges
              </div>
            </CarouselItem>
          )}
        </CarouselRow>
      </div>

      <CreateChallengeModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChallengeCreated={handleChallengeCreated}
      />

      <ItemOverlay
        kind="challenge"
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        item={overlayItem}
        onPlay={handlePlay}
      />
    </div>
  )
}

export default Challenges