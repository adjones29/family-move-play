import { useState } from "react"
import { useChallenges, useMiniGames, useRewards } from "@/hooks/useSupabaseData"
import { getIconComponent } from "@/utils/iconMapping"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { ChallengeCard } from "@/components/ChallengeCard"
import { ActivityStats } from "@/components/ActivityStats"
import { MiniGameCard } from "@/components/MiniGameCard"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
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
import { Challenge, MiniGame, Reward } from "@/lib/supabase"

const Index = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { challenges, loading: challengesLoading, error: challengesError } = useChallenges()
  const { miniGames, loading: miniGamesLoading, error: miniGamesError } = useMiniGames()
  const { rewards, loading: rewardsLoading, error: rewardsError } = useRewards()
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

  // Mock family data (keeping this local as requested)
  const familyMembers = [
    {
      name: "Dad",
      dailySteps: 8234,
      weeklyScore: 89,
      badges: 12,
      avatar: "👨",
      isActive: true,
      currentActivity: "Morning jog"
    },
    {
      name: "Mom",
      dailySteps: 9876,
      weeklyScore: 95,
      badges: 15,
      avatar: "👩",
      isActive: true,
      currentActivity: "Yoga session"
    },
    {
      name: "Alex",
      dailySteps: 6543,
      weeklyScore: 72,
      badges: 8,
      avatar: "🧒",
      isActive: false,
      currentActivity: "At school"
    },
    {
      name: "Sam",
      dailySteps: 5432,
      weeklyScore: 68,
      badges: 6,
      avatar: "👶",
      isActive: true,
      currentActivity: "Playing outside"
    }
  ]

  // Transform Supabase data to match component expectations
  const transformedChallenges = challenges.map(challenge => ({
    title: challenge.title,
    description: challenge.description,
    type: challenge.type,
    participants: challenge.participants,
    progress: challenge.progress,
    totalGoal: challenge.total_goal,
    daysLeft: challenge.days_left,
    reward: challenge.reward,
    difficulty: challenge.difficulty
  }))

  const transformedMiniGames = miniGames.map(game => {
    const IconComponent = getIconComponent(game.icon_name)
    return {
      title: game.title,
      description: game.description,
      duration: game.duration,
      participants: game.participants,
      difficulty: game.difficulty,
      points: game.points,
      icon: <IconComponent className="h-6 w-6" />
    }
  })

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

  // Show loading state
  if (challengesLoading || miniGamesLoading || rewardsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading FitFam data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (challengesError || miniGamesError || rewardsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading data from Supabase</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
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

        {/* Active Challenges - Horizontal Scroll */}
        <HorizontalScroll title="Active Challenges">
          {transformedChallenges.map((challenge, index) => (
            <div 
              key={index}
              onClick={() => navigate("/challenges")}
              className="cursor-pointer"
            >
              <ChallengeCard {...challenge} />
            </div>
          ))}
        </HorizontalScroll>

        {/* Mini Games - Horizontal Scroll */}
        <HorizontalScroll title="Quick Mini-Games">
          {transformedMiniGames.map((game, index) => (
            <div 
              key={index} 
              onClick={() => {
                setSelectedGame(game)
                setShowGameModal(true)
              }}
            >
              <MiniGameCard {...game} />
            </div>
          ))}
        </HorizontalScroll>

        {/* Reward Store - Full Width */}
        <section className="px-8">
          <RewardStore 
            totalPoints={totalPoints}
            onRewardRedeem={handleRewardRedeem}
            supabaseRewards={rewards}
          />
        </section>

        {/* Earned Rewards - Full Width */}
        <section className="px-8 pb-8">
          <EarnedRewards 
            earnedRewards={earnedRewards}
            onUseReward={handleUseReward}
          />
        </section>
      </div>

      {/* Modals */}
      {selectedReward && (
        <RewardRedemptionModal
          reward={selectedReward}
          isOpen={showRedemptionModal}
          onClose={() => {
            setShowRedemptionModal(false)
            setSelectedReward(null)
          }}
          onRedeem={handleRewardRedeem}
          totalPoints={totalPoints}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {selectedGame && (
        <MiniGameModal
          game={selectedGame}
          isOpen={showGameModal}
          onClose={() => {
            setShowGameModal(false)
            setSelectedGame(null)
          }}
          onComplete={(points) => {
            setTotalPoints(prev => prev + points)
            toast({
              title: "Game Completed! 🎉",
              description: `You earned ${points} points!`,
            })
          }}
        />
      )}
    </div>
  )
}

export default Index