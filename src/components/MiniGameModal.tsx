import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Play, Users, Clock, Trophy, Star, CheckCircle } from "lucide-react"

interface MiniGameModalProps {
  isOpen: boolean
  onClose: () => void
  game: {
    title: string
    description: string
    duration: string
    participants: string
    difficulty: "easy" | "medium" | "hard"
    points: number
    icon: React.ReactNode
  } | null
}

export function MiniGameModal({ isOpen, onClose, game }: MiniGameModalProps) {
  const { toast } = useToast()
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">("ready")
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  if (!game) return null

  const difficultyColors = {
    easy: "bg-green-500/10 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", 
    hard: "bg-red-500/10 text-red-600 border-red-500/30"
  }

  const startGame = () => {
    setGameState("playing")
    setProgress(0)
    setTimeLeft(60)
    
    // Simulate game progress
    const gameTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(gameTimer)
          setGameState("completed")
          toast({
            title: "Game Completed! 🎉",
            description: `You earned ${game.points} points!`,
          })
          return 100
        }
        return prev + 2
      })
      
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer)
          return 0
        }
        return prev - 1
      })
    }, 100)
  }

  const playAgain = () => {
    setGameState("ready")
    setProgress(0)
    setTimeLeft(60)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {game.icon}
            {game.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {gameState === "ready" && (
            <>
              <div className="space-y-4">
                <p className="text-muted-foreground">{game.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{game.duration}</span>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{game.participants}</span>
                    </div>
                  </Card>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={difficultyColors[game.difficulty]} variant="outline">
                    {game.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    {game.points} points
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button variant="energy" onClick={startGame} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </>
          )}

          {gameState === "playing" && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {timeLeft}s
                  </div>
                  <p className="text-muted-foreground">Time remaining</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm text-center font-medium">
                    Keep going! Follow the instructions and complete the exercise!
                  </p>
                </Card>
              </div>
            </>
          )}

          {gameState === "completed" && (
            <>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Great Job!</h3>
                  <p className="text-muted-foreground">You completed the {game.title}!</p>
                </div>

                <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">+{game.points} points earned!</span>
                  </div>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button variant="success" onClick={playAgain} className="flex-1">
                  Play Again
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}