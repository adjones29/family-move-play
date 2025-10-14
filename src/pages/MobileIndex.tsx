import { useState, useEffect } from "react"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { FamilyMemberModal } from "@/components/FamilyMemberModal"
import { ActivityStats } from "@/components/ActivityStats"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
import { QuickMiniGamesStore } from "@/components/QuickMiniGamesStore"
import { ActiveChallengesStore } from "@/components/ActiveChallengesStore"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { RewardRedemptionConfirmModal } from "@/components/RewardRedemptionConfirmModal"
import { SettingsModal } from "@/components/SettingsModal"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { FamilyMembersStore } from "@/components/FamilyMembersStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Settings } from "lucide-react"
import { initializeStorage } from "@/utils/localStorage"
import { useFamilyMemberStats } from "@/hooks/useFamilyMemberStats"
import { sumWeeklySteps, sumDailySteps } from "@/lib/steps"

const MobileIndex = () => {
  const { toast } = useToast()
  const { stats: familyMembers, loading: loadingStats } = useFamilyMemberStats()
  const [stepsVersion, setStepsVersion] = useState(0)
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<any>(null)
  const [showRedemptionConfirmModal, setShowRedemptionConfirmModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null)
  const [showFamilyMemberModal, setShowFamilyMemberModal] = useState(false)
  
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

  // Calculate total points from all family members
  const totalFamilyPoints = familyMembers.reduce((sum, member) => sum + member.points, 0)

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

  // Listen for step changes to re-compute weekly totals
  useEffect(() => {
    const handleStepsChange = () => setStepsVersion(v => v + 1)
    window.addEventListener('steps:changed', handleStepsChange)
    return () => window.removeEventListener('steps:changed', handleStepsChange)
  }, [])

  // Compute daily and weekly steps from localStorage for each member
  const familyMembersWithLocalSteps = familyMembers.map(member => ({
    ...member,
    dailySteps: sumDailySteps(member.member_id),
    weeklySteps: sumWeeklySteps(member.member_id)
  }))

  const handleRewardRedemption = (rewardId: string, cost: number, selectedMember?: string) => {
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (!reward) return

    // TODO: Implement point deduction in database

    // Add to earned rewards
    const newReward: EarnedReward = {
      id: `${rewardId}-${Date.now()}`,
      title: reward.title,
      description: reward.description,
      redeemedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "active",
      category: reward.category === "Family Rewards" ? "family" : reward.category === "Individual Rewards" ? "individual" : "special",
      rarity: reward.rarity
    }

    setEarnedRewards(prev => [newReward, ...prev])
    
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
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              {totalFamilyPoints} pts
            </Badge>
          </div>
        </div>
      </header>

      {/* Activity Stats */}
      <div className="px-4 pt-4 pb-2">
        <section>
          <ActivityStats 
            totalSteps={31086}
            activeMinutes={127}
            caloriesBurned={1842}
            goalsAchieved={7}
            totalGoals={12}
          />
        </section>
      </div>

      {/* Family Members - Dedicated Container */}
      <div className="px-4 py-4 bg-white">
        <section>
          <FamilyMembersStore 
            familyMembers={familyMembersWithLocalSteps}
            onMemberClick={handleFamilyMemberClick}
            onSeeAll={() => toast({ title: "Family Overview", description: "Navigate to detailed family stats page" })}
          />
        </section>
      </div>

      {/* Mobile Content - Remaining Sections */}
      <div className="space-y-6 px-4 py-4">
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
          <RewardStore 
            totalPoints={totalFamilyPoints}
            onRewardRedeem={handleRewardSelect}
          />
        </section>

        {/* Earned Rewards */}
        <section>
          <EarnedRewards 
            rewards={earnedRewards}
          />
        </section>
      </div>

      {/* Modals and Drawers - Convert to Bottom Sheets */}
      <RewardRedemptionConfirmModal
        isOpen={showRedemptionConfirmModal}
        onClose={() => setShowRedemptionConfirmModal(false)}
        reward={selectedRewardForRedemption}
        familyMembers={familyMembers}
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

export default MobileIndex;