import { useState, useEffect } from "react"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { FamilyMemberModal } from "@/components/FamilyMemberModal"
import { ChallengeCard } from "@/components/ChallengeCard"
import { ActivityStats } from "@/components/ActivityStats"
import { MiniGameCard } from "@/components/MiniGameCard"
import { RewardStoreCarousel } from "@/components/RewardStoreCarousel"
import { QuickMiniGamesStore } from "@/components/QuickMiniGamesStore"
import { ActiveChallengesStore } from "@/components/ActiveChallengesStore"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { RewardRedemptionConfirmModal } from "@/components/RewardRedemptionConfirmModal"
import { SettingsModal } from "@/components/SettingsModal"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { MiniGameModal } from "@/components/MiniGameModal"
import { HeroSection } from "@/components/HeroSection"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Bell, Settings, Dumbbell, Target, Gamepad2, Users, Zap, Gift, Star, LogOut } from "lucide-react"
import { initializeStorage } from "@/utils/localStorage"
import { useFamilyMemberStats } from "@/hooks/useFamilyMemberStats"
import { onStepsUpdated } from "@/lib/progress"
import { supabase } from "@/integrations/supabase/client"
import { useCurrentFamily } from "@/hooks/useCurrentFamily"
import FamilyPointsBadge from "@/components/ui/FamilyPointsBadge"
import { useFamilyStore } from "@/state/familyStore"

const Index = () => {
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const { stats: familyMembers, loading: loadingStats, refetch } = useFamilyMemberStats()
  const { familyId } = useCurrentFamily()
  const { members: storeFamilyMembers } = useFamilyStore()
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<any>(null)
  const [showRedemptionConfirmModal, setShowRedemptionConfirmModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null)
  const [showFamilyMemberModal, setShowFamilyMemberModal] = useState(false)

  // Calculate total points from all family members
  const totalFamilyPoints = familyMembers.reduce((sum, member) => sum + member.points, 0)
  
  // Calculate family-wide step totals
  const totalDailySteps = familyMembers.reduce((sum, member) => sum + (member.dailySteps || 0), 0)
  const totalWeeklySteps = familyMembers.reduce((sum, member) => sum + (member.weeklySteps || 0), 0)

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

  const handleRewardSelect = (rewardId: string) => {
    // Find the reward from localStorage
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (reward) {
      setSelectedRewardForRedemption(reward)
      setShowRedemptionConfirmModal(true)
    }
  }

  // Initialize localStorage on component mount
  useEffect(() => {
    initializeStorage()
  }, [])

  // Listen to steps:updated events from progress lib
  useEffect(() => {
    const unsubscribe = onStepsUpdated(() => {
      refetch()
    })
    return unsubscribe
  }, [refetch])

  // Midnight rollover - refresh steps at local midnight
  useEffect(() => {
    const scheduleNextMidnightRefresh = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const msUntilMidnight = tomorrow.getTime() - now.getTime()
      
      const timeoutId = setTimeout(() => {
        refetch()
        scheduleNextMidnightRefresh()
      }, msUntilMidnight)
      
      return timeoutId
    }
    
    const timeoutId = scheduleNextMidnightRefresh()
    return () => clearTimeout(timeoutId)
  }, [refetch])

  // Real-time subscription to step_entries changes
  useEffect(() => {
    const channel = supabase
      .channel('step-entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'step_entries'
        },
        () => {
          refetch()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  const handleRewardRedemption = (rewardId: string, cost: number, selectedMember?: string) => {
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (!reward) return

    // TODO: Implement point deduction in database
    
    toast({
      title: "Reward Redeemed! 🎉",
      description: `Successfully redeemed "${reward.title}"${selectedMember ? ` for ${selectedMember}` : ''}`,
    })
  }

  const handlePointsEarned = (points: number) => {
    // TODO: Implement points addition in database
    toast({
      title: "Points Earned! 🎉",
      description: `Earned ${points} points!`,
    })
  }

  const handleFamilyMemberClick = (member: any) => {
    setSelectedFamilyMember(member)
    setShowFamilyMemberModal(true)
  }

  const handleFamilyMemberUpdate = (updatedMember: any) => {
    // TODO: Implement member update in database
    toast({
      title: "Member Updated",
      description: `Updated ${updatedMember.name}'s information`,
    })
  }

  return (
    <div className="pb-20"> {/* Bottom padding for navigation */}
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">FitFam</h1>
            <p className="text-sm text-muted-foreground">Family Fitness</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => setShowSettingsModal(true)}
            >
            <Settings className="h-5 w-5" />
            </Button>
            <FamilyPointsBadge familyId={familyId} />
          </div>
        </div>
      </header>

      {/* Mobile Content - Single Column */}
      <div className="space-y-6 px-4 py-4">
        {/* Activity Stats */}
        <section>
          <ActivityStats 
            totalSteps={totalDailySteps}
            activeMinutes={127}
            caloriesBurned={1842}
            goalsAchieved={7}
            totalGoals={12}
          />
        </section>

        {/* Family Members */}
        <section>
          <Card className="shadow-float">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Family Members
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary text-sm">
                  See All
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 pt-0">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
                {familyMembers.map((member, index) => (
                  <FamilyMemberCard 
                    key={index} 
                    {...member} 
                    onClick={() => handleFamilyMemberClick(member)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Active Challenges */}
        <section>
          <ActiveChallengesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Mini Games */}
        <section>
          <QuickMiniGamesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Reward Store */}
        <section>
        <RewardStoreCarousel 
          familyMembers={familyMembers}
          onRewardRedeem={handleRewardSelect}
        />
        </section>

      </div>

      {/* Modals and Drawers */}
      <RewardRedemptionConfirmModal
        isOpen={showRedemptionConfirmModal}
        onClose={() => setShowRedemptionConfirmModal(false)}
        reward={selectedRewardForRedemption}
        familyMembers={storeFamilyMembers.map(m => ({
          ...m,
          points: familyMembers.find(fm => fm.member_id === m.id)?.points ?? 0
        }))}
        onConfirmRedemption={handleRewardRedemption}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <FamilyMemberModal
        member={selectedFamilyMember}
        isOpen={showFamilyMemberModal}
        onClose={() => setShowFamilyMemberModal(false)}
        onUpdate={handleFamilyMemberUpdate}
      />
    </div>
  );
};

export default Index;
