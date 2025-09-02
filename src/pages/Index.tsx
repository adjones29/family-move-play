import { useState } from "react"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { ChallengeCard } from "@/components/ChallengeCard"
import { ActivityStats } from "@/components/ActivityStats"
import { MiniGameCard } from "@/components/MiniGameCard"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
import { QuickMiniGamesStore } from "@/components/QuickMiniGamesStore"
import { ActiveChallengesStore } from "@/components/ActiveChallengesStore"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { SettingsModal } from "@/components/SettingsModal"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { MiniGameModal } from "@/components/MiniGameModal"
import { HeroSection } from "@/components/HeroSection"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Bell, Settings, Dumbbell, Target, Gamepad2, Users, Zap, Gift, Star } from "lucide-react"

const Index = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [totalPoints, setTotalPoints] = useState(125) // Mock starting points
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showRedemptionModal, setShowRedemptionModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [showGameModal, setShowGameModal] = useState(false)
  type EarnedReward = {
    id: string
    title: string
    description: string
    redeemedAt: Date
    expiresAt?: Date
    status: "active" | "used" | "expired"
    category: "family" | "individual" | "special"
    rarity: "common" | "rare" | "epic" | "legendary"
    icon?: React.ReactNode
  }

  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([
    {
      id: "movie-night-1",
      title: "Family Movie Night",
      description: "Choose any movie for tonight's family viewing with snacks included!",
      redeemedAt: new Date(2024, 11, 15),
      expiresAt: new Date(2024, 11, 22),
      status: "active",
      category: "family",
      rarity: "common"
    },
    {
      id: "extra-screen-time-1", 
      title: "Extra Screen Time",
      description: "Earn 30 minutes of bonus screen time for games or videos",
      redeemedAt: new Date(2024, 11, 10),
      status: "used",
      category: "individual",
      rarity: "common"
    }
  ])

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

  const handleRewardRedeem = (rewardId: string, cost: number) => {
    // Find the reward details (in a real app, this would come from an API)
    const rewardDetails = {
      "movie-night": { title: "Family Movie Night", description: "Choose any movie for tonight's family viewing with snacks included!", rarity: "common" as const, category: "family" as const },
      "ice-cream-trip": { title: "Ice Cream Shop Visit", description: "Family trip to your favorite ice cream parlor - everyone gets two scoops!", rarity: "rare" as const, category: "family" as const },
      "extra-screen-time": { title: "Extra Screen Time", description: "Earn 30 minutes of bonus screen time for games or videos", rarity: "common" as const, category: "individual" as const },
      "skip-chore": { title: "Skip One Chore", description: "Get out of doing one assigned household chore this week", rarity: "common" as const, category: "special" as const }
    }

    const reward = rewardDetails[rewardId as keyof typeof rewardDetails]
    if (!reward) return

    // Add to earned rewards
    const newReward: EarnedReward = {
      id: `${rewardId}-${Date.now()}`,
      title: reward.title,
      description: reward.description,
      redeemedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "active",
      category: reward.category,
      rarity: reward.rarity
    }

    setEarnedRewards(prev => [newReward, ...prev])
    setTotalPoints(prev => prev - cost)
    
    toast({
      title: "Reward Redeemed! 🎉",
      description: `You've successfully redeemed "${reward.title}"`,
    })
  }

  const handleUseReward = (rewardId: string) => {
    setEarnedRewards(prev => 
      prev.map(reward => 
        reward.id === rewardId 
          ? { ...reward, status: "used" as const }
          : reward
      )
    )
    
    toast({
      title: "Reward Used! ✅",
      description: "Hope you enjoyed your reward!",
    })
  }

  const handlePointsEarned = (points: number) => {
    setTotalPoints(prev => prev + points)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Netflix-style Header */}
      <div className="bg-black/90 backdrop-blur-sm text-white sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-primary">FitFam</div>
              <nav className="hidden md:flex space-x-6">
                <button className="hover:text-gray-300 transition-colors">Home</button>
                <button 
                  className="hover:text-gray-300 transition-colors"
                  onClick={() => navigate("/challenges")}
                >
                  Challenges
                </button>
                <button 
                  className="hover:text-gray-300 transition-colors"
                  onClick={() => navigate("/games")}
                >
                  Games
                </button>
                <button 
                  className="hover:text-gray-300 transition-colors"
                  onClick={() => navigate("/rewards")}
                >
                  Rewards
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {totalPoints} points
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Content Sections with Horizontal Scrolling */}
      <div className="space-y-8">
        {/* Activity Stats - Full Width */}
        <section className="px-8">
          <ActivityStats 
            totalSteps={31086}
            activeMinutes={127}
            caloriesBurned={1842}
            goalsAchieved={7}
            totalGoals={12}
          />
        </section>

        {/* Family Members - Horizontal Scroll */}
        <HorizontalScroll title="Family Members">
          {familyMembers.map((member, index) => (
            <div 
              key={index}
              onClick={() => {
                toast({
                  title: `${member.name}'s Profile`,
                  description: `Daily steps: ${member.dailySteps.toLocaleString()} | Weekly score: ${member.weeklyScore} | Badges: ${member.badges}`,
                })
              }}
              className="cursor-pointer"
            >
              <FamilyMemberCard {...member} />
            </div>
          ))}
        </HorizontalScroll>

        {/* Active Challenges - Full Width */}
        <section className="px-8">
          <ActiveChallengesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Mini Games - Full Width */}
        <section className="px-8">
          <QuickMiniGamesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Reward Store - Full Width */}
        <section className="px-8">
          <RewardStore 
            totalPoints={totalPoints}
            onRewardRedeem={handleRewardRedeem}
          />
        </section>

        {/* Earned Rewards - Full Width */}
        <section className="px-8 pb-8">
          <EarnedRewards 
            rewards={earnedRewards}
            onUseReward={handleUseReward}
          />
        </section>
      </div>

      {/* Modals and Drawers */}
      <RewardRedemptionModal
        isOpen={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        reward={selectedReward}
        currentPoints={totalPoints}
        onConfirmRedeem={handleRewardRedeem}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      <MiniGameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        game={selectedGame}
      />
    </div>
  );
};

export default Index;
