import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { ChallengeCard } from "@/components/ChallengeCard"
import { ActivityStats } from "@/components/ActivityStats"
import { MiniGameCard } from "@/components/MiniGameCard"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Plus, Dumbbell, Target, Gamepad2, Users, Zap } from "lucide-react"
import heroImage from "@/assets/hero-family-fitness.jpg"

const Index = () => {
  // Mock family data
  const familyMembers = [
    {
      name: "Dad",
      avatar: "",
      dailySteps: 8542,
      stepGoal: 10000,
      weeklyScore: 325,
      badges: 12,
      memberColor: "member-1" as const
    },
    {
      name: "Mom", 
      avatar: "",
      dailySteps: 11234,
      stepGoal: 10000,
      weeklyScore: 412,
      badges: 18,
      memberColor: "member-2" as const
    },
    {
      name: "Alex",
      avatar: "",
      dailySteps: 6789,
      stepGoal: 8000,
      weeklyScore: 245,
      badges: 8,
      memberColor: "member-3" as const
    },
    {
      name: "Sam",
      avatar: "",
      dailySteps: 4521,
      stepGoal: 6000,
      weeklyScore: 156,
      badges: 5,
      memberColor: "member-4" as const
    }
  ]

  const challenges = [
    {
      title: "Family Walk Week",
      description: "Take 50,000 steps together as a family this week!",
      type: "weekly" as const,
      participants: 4,
      progress: 32150,
      totalGoal: 50000,
      daysLeft: 3,
      reward: "Movie Night",
      difficulty: "medium" as const
    },
    {
      title: "Dance Party Daily",
      description: "Dance for 15 minutes every day this week",
      type: "daily" as const, 
      participants: 4,
      progress: 4,
      totalGoal: 7,
      daysLeft: 3,
      reward: "Ice Cream Trip",
      difficulty: "easy" as const
    },
    {
      title: "Fitness Champions",
      description: "Complete 5 different mini-games this month",
      type: "special" as const,
      participants: 4,
      progress: 3,
      totalGoal: 5,
      daysLeft: 12,
      reward: "Theme Park Visit",
      difficulty: "hard" as const
    }
  ]

  const miniGames = [
    {
      title: "Push-up Challenge",
      description: "See who can do the most push-ups in 60 seconds!",
      duration: "1-2 min",
      participants: "2-4 players",
      difficulty: "medium" as const,
      points: 50,
      icon: <Dumbbell className="h-6 w-6" />
    },
    {
      title: "Animal Yoga",
      description: "Copy fun animal poses and movements together",
      duration: "5-10 min", 
      participants: "1-4 players",
      difficulty: "easy" as const,
      points: 30,
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Obstacle Course",
      description: "Navigate through a living room obstacle course",
      duration: "3-5 min",
      participants: "1-4 players", 
      difficulty: "hard" as const,
      points: 75,
      icon: <Zap className="h-6 w-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-gradient-energy text-white shadow-float">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">🏃‍♀️ FitFam</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Premium Family
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <Card className="shadow-float bg-gradient-to-r from-card to-secondary/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Keep Your Family 
                    <span className="bg-gradient-energy bg-clip-text text-transparent"> Active Together!</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Turn fitness into a fun family adventure with challenges, games, and rewards that bring everyone together.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="energy" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Start New Challenge
                  </Button>
                  <Button variant="outline" size="lg">
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Quick Game
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Family exercising together"
                  className="w-full h-80 lg:h-96 object-cover rounded-r-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/20 rounded-r-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            Family Overview
          </h2>
          <ActivityStats 
            totalSteps={31086}
            activeMinutes={127}
            caloriesBurned={1842}
            goalsAchieved={7}
            totalGoals={12}
          />
        </section>

        {/* Family Members */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            Family Members
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {familyMembers.map((member, index) => (
              <FamilyMemberCard key={index} {...member} />
            ))}
          </div>
        </section>

        {/* Active Challenges */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-primary" />
            Active Challenges
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <ChallengeCard key={index} {...challenge} />
            ))}
          </div>
        </section>

        {/* Mini Games */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Gamepad2 className="h-6 w-6 mr-2 text-primary" />
            Quick Mini-Games
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game, index) => (
              <MiniGameCard key={index} {...game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
