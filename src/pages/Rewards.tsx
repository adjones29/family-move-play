import { useState, useEffect } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { EarnedRewards } from "@/components/EarnedRewards"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Gift } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCurrentFamily } from "@/hooks/useCurrentFamily"
import FamilyPointsBadge from "@/components/ui/FamilyPointsBadge"
import { useFamilyMembers } from "@/hooks/useFamilyMembers"
import { supabase } from "@/integrations/supabase/client"
import { CarouselRow } from "@/components/ui/CarouselRow"
import { CarouselItem } from "@/components/ui/carousel"
import { ItemCard } from "@/components/ui/ItemCard"
import { fetchRewardsByType } from "@/lib/catalog"
import ItemOverlay, { type OverlayItem } from "@/components/detail/ItemOverlay"
import { redeemFamilyReward, redeemIndividualReward } from "@/lib/points"

type Reward = {
  id: string
  title: string
  description?: string
  image_url?: string
  type: string
  cost: number
}

const Rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { familyId } = useCurrentFamily()
  const { members: familyMembers } = useFamilyMembers()
  const [selectedTab, setSelectedTab] = useState<'store' | 'earned'>('store')
  const [familyRewards, setFamilyRewards] = useState<Reward[]>([])
  const [individualRewards, setIndividualRewards] = useState<Reward[]>([])
  const [specialRewards, setSpecialRewards] = useState<Reward[]>([])
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayItem, setOverlayItem] = useState<OverlayItem | null>(null)

  const loadRewards = async () => {
    const family = await fetchRewardsByType('family')
    const individual = await fetchRewardsByType('individual')
    const special = await fetchRewardsByType('special')
    setFamilyRewards(family)
    setIndividualRewards(individual)
    setSpecialRewards(special)
  }

  useEffect(() => {
    loadRewards()
  }, [])

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

  const handleRewardSelect = (reward: Reward) => {
    // Map database type to overlay type format
    const overlayType = reward.type === 'family' ? 'Family Rewards' :
                        reward.type === 'individual' ? 'Individual Rewards' :
                        'Special Rewards'
    
    setOverlayItem({
      id: reward.id,
      title: reward.title,
      description: reward.description || '',
      type: overlayType as any,
      cost: reward.cost
    })
    setOverlayOpen(true)
  }

  const handleRedeem = async (item: OverlayItem, memberIds: string[]) => {
    if (!familyId) {
      toast({
        title: "Error",
        description: "No family selected",
        variant: "destructive"
      })
      return
    }

    try {
      let result
      if (item.type === 'Individual Rewards') {
        result = await redeemIndividualReward({
          familyId,
          rewardId: item.id,
          rewardTitle: item.title,
          rewardDescription: item.description || '',
          rewardCost: item.cost || 0,
          rewardCategory: item.type,
          rewardRarity: (item.rarity as any) || 'common',
          memberIds
        })
      } else {
        result = await redeemFamilyReward({
          familyId,
          rewardId: item.id,
          rewardTitle: item.title,
          rewardDescription: item.description || '',
          rewardCost: item.cost || 0,
          rewardCategory: item.type || 'Family Rewards',
          rewardRarity: (item.rarity as any) || 'common'
        })
      }

      if (result.success) {
        toast({
          title: "Reward Redeemed!",
          description: result.message
        })
        fetchEarnedRewards()
        setOverlayOpen(false)
      } else {
        toast({
          title: "Redemption Failed",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Redemption error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward",
        variant: "destructive"
      })
    }
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Reward Store</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTab(selectedTab === 'store' ? 'earned' : 'store')}
          >
            {selectedTab === 'store' ? 'My Rewards' : 'Store'}
          </Button>
        </div>

        {selectedTab === 'store' ? (
          <div className="space-y-8 pb-4">
            <CarouselRow title="Family Rewards">
              {familyRewards.map((reward) => (
                <CarouselItem key={reward.id} className="pl-2 md:pl-4 basis-auto">
                  <ItemCard
                    title={reward.title}
                    subtitle={`${reward.cost} pts`}
                    onClick={() => handleRewardSelect(reward)}
                  />
                </CarouselItem>
              ))}
              {familyRewards.length === 0 && (
                <CarouselItem className="pl-2 md:pl-4 basis-auto">
                  <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                    No family rewards
                  </div>
                </CarouselItem>
              )}
            </CarouselRow>

            <CarouselRow title="Individual Rewards">
              {individualRewards.map((reward) => (
                <CarouselItem key={reward.id} className="pl-2 md:pl-4 basis-auto">
                  <ItemCard
                    title={reward.title}
                    subtitle={`${reward.cost} pts`}
                    onClick={() => handleRewardSelect(reward)}
                  />
                </CarouselItem>
              ))}
              {individualRewards.length === 0 && (
                <CarouselItem className="pl-2 md:pl-4 basis-auto">
                  <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                    No individual rewards
                  </div>
                </CarouselItem>
              )}
            </CarouselRow>

            <CarouselRow title="Special Rewards">
              {specialRewards.map((reward) => (
                <CarouselItem key={reward.id} className="pl-2 md:pl-4 basis-auto">
                  <ItemCard
                    title={reward.title}
                    subtitle={`${reward.cost} pts`}
                    onClick={() => handleRewardSelect(reward)}
                  />
                </CarouselItem>
              ))}
              {specialRewards.length === 0 && (
                <CarouselItem className="pl-2 md:pl-4 basis-auto">
                  <div className="w-[280px] h-[200px] flex items-center justify-center text-muted-foreground">
                    No special rewards
                  </div>
                </CarouselItem>
              )}
            </CarouselRow>
          </div>
        ) : (
          <EarnedRewards 
            rewards={earnedRewards}
          />
        )}
      </div>

      <ItemOverlay
        kind="reward"
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        item={overlayItem}
        onRedeem={handleRedeem}
      />
    </div>
  )
}

export default Rewards