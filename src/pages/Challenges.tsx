import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Calendar, Trophy, Target, Clock, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CreateChallengeModal } from "@/components/CreateChallengeModal"

const Challenges = () => {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [customChallenges, setCustomChallenges] = useState<any[]>([])
  
  const activeChallenges = [
    {
      id: "1",
      title: "Family Walk Week",
      description: "Take 50,000 steps together as a family this week!",
      type: "weekly",
      participants: 4,
      progress: 32150,
      totalGoal: 50000,
      daysLeft: 3,
      reward: "Movie Night",
      difficulty: "medium" as const,
      category: "steps"
    },
    {
      id: "2", 
      title: "Dance Party Daily",
      description: "Dance for 15 minutes every day this week",
      type: "daily",
      participants: 4,
      progress: 4,
      totalGoal: 7,
      daysLeft: 3,
      reward: "Ice Cream Trip",
      difficulty: "easy" as const,
      category: "activity"
    }
  ]

  const availableChallenges = [
    {
      id: "3",
      title: "Weekend Warriors",
      description: "Complete 3 different activities this weekend",
      type: "weekend",
      participants: "2-4",
      duration: "2 days",
      reward: "Extra Screen Time",
      difficulty: "medium" as const,
      points: 150
    },
    {
      id: "4",
      title: "Yoga Master",
      description: "Practice yoga for 30 minutes, 5 days this week",
      type: "weekly", 
      participants: "1-4",
      duration: "7 days",
      reward: "Special Breakfast",
      difficulty: "hard" as const,
      points: 200
    }
  ]

  const completedChallenges = [
    {
      id: "5",
      title: "Step Challenge Pro",
      description: "Walk 10,000 steps every day for a week",
      completedDate: "2024-12-10",
      reward: "Pizza Night",
      points: 300
    }
  ]

  const handleChallengeCreated = (newChallenge: any) => {
    setCustomChallenges([...customChallenges, newChallenge])
  }

  const allActiveChallenges = [...activeChallenges, ...customChallenges.filter(c => c.status === 'active')]
  const allAvailableChallenges = [...availableChallenges, ...customChallenges.filter(c => c.status === 'available')]

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
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {allActiveChallenges.map((challenge) => (
              <Card key={challenge.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Badge className={difficultyColors[challenge.difficulty]} variant="outline">
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>{challenge.reward}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {challenge.type === "daily" 
                          ? `${challenge.progress}/${challenge.totalGoal} days`
                          : `${challenge.progress.toLocaleString()}/${challenge.totalGoal.toLocaleString()}`
                        }
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.totalGoal) * 100} 
                      className="h-3"
                    />
                  </div>

                  <Button variant="energy" className="w-full">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {allAvailableChallenges.map((challenge) => (
              <Card key={challenge.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Badge className={difficultyColors[challenge.difficulty]} variant="outline">
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.points} points</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{challenge.reward}</span>
                    </div>
                    <Button variant="success">
                      <Plus className="h-4 w-4 mr-2" />
                      Join Challenge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="p-6 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground">{challenge.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed on {new Date(challenge.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{challenge.reward}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      +{challenge.points} points earned
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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