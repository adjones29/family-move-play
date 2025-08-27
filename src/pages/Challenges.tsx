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
              <h1 className="text-2xl font-bold">Family Challenges</h1>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="bg-white text-black hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="All">All Challenges</TabsTrigger>
            <TabsTrigger value="Easy">Easy</TabsTrigger>
            <TabsTrigger value="Medium">Medium</TabsTrigger>
            <TabsTrigger value="Hard">Hard</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedDifficulty}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Badge className={difficultyColors[challenge.difficulty]} variant="outline">
                      {challenge.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{challenge.points} points</span>
                    </div>
                    <Button variant="energy" size="sm">
                      Start Challenge
                    </Button>
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