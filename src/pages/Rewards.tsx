import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { RewardRedemptionConfirmModal } from "@/components/RewardRedemptionConfirmModal"
import { Badge } from "@/components/ui/badge"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Gift } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCurrentFamily } from "@/hooks/useCurrentFamily"
import FamilyPointsBadge from "@/components/ui/FamilyPointsBadge"
import { useFamilyStore } from "@/state/familyStore"

const Rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { familyId } = useCurrentFamily()
  const { members: familyMembers } = useFamilyStore()
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<any>(null)
  const [showRedemptionConfirmModal, setShowRedemptionConfirmModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'store' | 'earned'>('store')

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
    },
    {
      id: "pizza-night-1",
      title: "Pizza Night",
      description: "Family pizza night with everyone's favorite toppings",
      redeemedAt: new Date(2024, 11, 5),
      status: "used",
      category: "family",
      rarity: "rare"
    }
  ])

  const handleRewardSelect = (rewardId: string) => {
    // Find the reward from localStorage
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (reward) {
      setSelectedRewardForRedemption(reward)
      setShowRedemptionConfirmModal(true)
    }
  }

  const handleRewardRedemption = (rewardId: string, cost: number, selectedMemberId?: string) => {
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (!reward) return

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
    
    const memberName = familyMembers.find(m => m.id === selectedMemberId)?.display_name
    toast({
      title: "Reward Redeemed! 🎉",
      description: `Successfully redeemed "${reward.title}"${memberName ? ` for ${memberName}` : ''}`,
    })
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
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Rewards</h1>
                <p className="text-sm text-muted-foreground">Reward Center</p>
              </div>
            </div>
          </div>
          <FamilyPointsBadge familyId={familyId} />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <SegmentedControl
          value={selectedTab}
          onChange={(value) => setSelectedTab(value as 'store' | 'earned')}
          options={[
            { label: 'Store', value: 'store' },
            { label: 'My Rewards', value: 'earned' },
          ]}
          ariaLabel="Rewards section"
        />

        {selectedTab === 'store' && (
          <RewardStore 
            onRewardRedeem={handleRewardSelect}
          />
        )}

        {selectedTab === 'earned' && (
          <EarnedRewards 
            rewards={earnedRewards}
          />
        )}
      </div>

      <RewardRedemptionConfirmModal
        isOpen={showRedemptionConfirmModal}
        onClose={() => setShowRedemptionConfirmModal(false)}
        reward={selectedRewardForRedemption}
        familyMembers={familyMembers}
        onConfirmRedemption={handleRewardRedemption}
      />
    </div>
  )
}

export default Rewards