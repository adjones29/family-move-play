import { useState, useEffect } from "react"
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
import { useFamilyMembers } from "@/hooks/useFamilyMembers"
import { supabase } from "@/integrations/supabase/client"

const Rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { familyId } = useCurrentFamily()
  const { members: familyMembers } = useFamilyMembers()
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
  }

  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([])
  const [loadingRewards, setLoadingRewards] = useState(true)

  useEffect(() => {
    if (familyId) {
      fetchEarnedRewards()
      
      // Subscribe to realtime changes
      const channel = supabase
        .channel(`redeemed_rewards:${familyId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'redeemed_rewards',
            filter: `family_id=eq.${familyId}`
          },
          () => {
            fetchEarnedRewards()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [familyId])

  const fetchEarnedRewards = async () => {
    if (!familyId) return

    try {
      setLoadingRewards(true)
      const { data, error } = await supabase
        .from('redeemed_rewards')
        .select('*')
        .eq('family_id', familyId)
        .order('redeemed_at', { ascending: false })

      if (error) throw error

      const formattedRewards: EarnedReward[] = (data || []).map(reward => ({
        id: reward.id,
        title: reward.reward_title,
        description: reward.reward_description || '',
        redeemedAt: new Date(reward.redeemed_at),
        expiresAt: reward.expires_at ? new Date(reward.expires_at) : undefined,
        status: reward.status as "active" | "used" | "expired",
        category: reward.reward_category === "Family Rewards" ? "family" : 
                  reward.reward_category === "Individual Rewards" ? "individual" : "special",
        rarity: reward.reward_rarity as "common" | "rare" | "epic" | "legendary"
      }))

      setEarnedRewards(formattedRewards)
    } catch (error: any) {
      console.error('Error fetching earned rewards:', error)
      toast({
        title: "Error",
        description: "Failed to load earned rewards",
        variant: "destructive"
      })
    } finally {
      setLoadingRewards(false)
    }
  }

  const handleRewardSelect = (rewardId: string) => {
    // Find the reward from localStorage
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (reward) {
      setSelectedRewardForRedemption(reward)
      setShowRedemptionConfirmModal(true)
    }
  }

  const handleRewardRedemption = () => {
    // Refresh the earned rewards after successful redemption
    fetchEarnedRewards()
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