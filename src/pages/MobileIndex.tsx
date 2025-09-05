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
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Settings } from "lucide-react"
import { initializeStorage } from "@/utils/localStorage"

const MobileIndex = () => {
  const { toast } = useToast()
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

  // Mock family data with individual point balances
  const [familyMembers, setFamilyMembers] = useState([
    {
      name: "Dad",
      avatar: "",
      dailySteps: 8542,
      stepGoal: 10000,
      weeklyScore: 325,
      badges: 12,
      memberColor: "member-1" as const,
      points: 325
    },
    {
      name: "Mom", 
      avatar: "",
      dailySteps: 11234,
      stepGoal: 10000,
      weeklyScore: 412,
      badges: 18,
      memberColor: "member-2" as const,
      points: 412
    },
    {
      name: "Alex",
      avatar: "",
      dailySteps: 6789,
      stepGoal: 8000,
      weeklyScore: 245,
      badges: 8,
      memberColor: "member-3" as const,
      points: 245
    },
    {
      name: "Sam",
      avatar: "",
      dailySteps: 4521,
      stepGoal: 6000,
      weeklyScore: 156,
      badges: 5,
      memberColor: "member-4" as const,
      points: 156
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

  const handleRewardRedemption = (rewardId: string, cost: number, selectedMember?: string) => {
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (!reward) return

    // Handle point deduction
    if (reward.category === "Family Rewards") {
      // Divide cost across all family members
      const costPerMember = Math.ceil(cost / familyMembers.length)
      setFamilyMembers(prev => 
        prev.map(member => ({
          ...member,
          points: member.points - costPerMember
        }))
      )
    } else if (selectedMember) {
      // Deduct from selected member
      setFamilyMembers(prev => 
        prev.map(member => 
          member.name === selectedMember 
            ? { ...member, points: member.points - cost }
            : member
        )
      )
    }

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
    // For now, add points equally to all family members
    const pointsPerMember = Math.ceil(points / familyMembers.length)
    setFamilyMembers(prev => 
      prev.map(member => ({
        ...member,
        points: member.points + pointsPerMember
      }))
    )
  }

  const handleFamilyMemberClick = (member: any) => {
    setSelectedFamilyMember(member)
    setShowFamilyMemberModal(true)
  }

  const handleFamilyMemberUpdate = (updatedMember: any) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.name === updatedMember.name 
          ? updatedMember
          : member
      )
    )
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

      {/* Mobile Content - Single Column */}
      <div className="space-y-6 px-4 py-4">
        {/* Activity Stats */}
        <section>
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
          <h2 className="text-lg font-semibold mb-3">Family Members</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
            {familyMembers.map((member, index) => (
              <div key={index} className="flex-shrink-0 w-64">
                <FamilyMemberCard 
                  {...member} 
                  onClick={() => handleFamilyMemberClick(member)}
                />
              </div>
            ))}
          </div>
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
          <RewardStore 
            totalPoints={totalFamilyPoints}
            onRewardRedeem={handleRewardSelect}
          />
        </section>

        {/* Earned Rewards */}
        <section>
          <EarnedRewards 
            rewards={earnedRewards}
            onUseReward={handleUseReward}
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