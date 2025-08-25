import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Gift } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [totalPoints, setTotalPoints] = useState(125)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showRedemptionModal, setShowRedemptionModal] = useState(false)

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

  const handleRewardRedeem = (rewardId: string, cost: number) => {
    const rewardDetails = {
      "movie-night": { title: "Family Movie Night", description: "Choose any movie for tonight's family viewing with snacks included!", rarity: "common" as const, category: "family" as const },
      "ice-cream-trip": { title: "Ice Cream Shop Visit", description: "Family trip to your favorite ice cream parlor - everyone gets two scoops!", rarity: "rare" as const, category: "family" as const },
      "extra-screen-time": { title: "Extra Screen Time", description: "Earn 30 minutes of bonus screen time for games or videos", rarity: "common" as const, category: "individual" as const },
      "skip-chore": { title: "Skip One Chore", description: "Get out of doing one assigned household chore this week", rarity: "common" as const, category: "special" as const }
    }

    const reward = rewardDetails[rewardId as keyof typeof rewardDetails]
    if (!reward) return

    const newReward: EarnedReward = {
      id: `${rewardId}-${Date.now()}`,
      title: reward.title,
      description: reward.description,
      redeemedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Reward Center</h1>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {totalPoints} points
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store">Reward Store</TabsTrigger>
            <TabsTrigger value="earned">My Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <RewardStore 
              totalPoints={totalPoints}
              onRewardRedeem={handleRewardRedeem}
            />
          </TabsContent>

          <TabsContent value="earned">
            <EarnedRewards 
              rewards={earnedRewards}
              onUseReward={handleUseReward}
            />
          </TabsContent>
        </Tabs>
      </div>

      <RewardRedemptionModal
        isOpen={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        reward={selectedReward}
        currentPoints={totalPoints}
        onConfirmRedeem={handleRewardRedeem}
      />
    </div>
  )
}

export default Rewards