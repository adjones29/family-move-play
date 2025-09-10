import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Calendar, Trophy, Target, Clock, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CreateChallengeModal } from "@/components/CreateChallengeModal"
import { getChallenges, addChallenge, initializeStorage, type Challenge } from "@/utils/localStorage"

const Challenges = () => {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')

  useEffect(() => {
    initializeStorage()
    setChallenges(getChallenges())
  }, [])

  const handleChallengeCreated = (newChallenge: Omit<Challenge, 'id'>) => {
    addChallenge(newChallenge)
    setChallenges(getChallenges())
  }

  const filteredChallenges = selectedDifficulty === 'All' 
    ? challenges 
    : challenges.filter(challenge => challenge.difficulty === selectedDifficulty)

  const difficultyColors = {
    easy: "bg-green-500/10 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    hard: "bg-red-500/10 text-red-600 border-red-500/30"
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

      <div className="px-4 py-4">
        <Tabs value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Easy" className="text-xs">Easy</TabsTrigger>
            <TabsTrigger value="Medium" className="text-xs">Medium</TabsTrigger>
            <TabsTrigger value="Hard" className="text-xs">Hard</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedDifficulty} className="mt-4">
            <div className="space-y-4">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4 cursor-pointer transition-all duration-300 active:scale-95">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                      </div>
                      <Badge className={difficultyColors[challenge.difficulty]} variant="outline">
                        {challenge.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">{challenge.points} points</span>
                      </div>
                      <Button variant="energy" size="sm" className="h-8">
                        Start
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateChallengeModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChallengeCreated={handleChallengeCreated}
      />
    </div>
  )
}

export default Challenges