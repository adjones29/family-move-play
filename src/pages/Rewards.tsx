import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { RewardStore } from "@/components/RewardStore"
import { EarnedRewards } from "@/components/EarnedRewards"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { RewardRedemptionConfirmModal } from "@/components/RewardRedemptionConfirmModal"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Gift } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Rewards = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<any>(null)
  const [showRedemptionConfirmModal, setShowRedemptionConfirmModal] = useState(false)

  // Mock family members with points
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Dad", points: 325, memberColor: "member-1" },
    { name: "Mom", points: 412, memberColor: "member-2" },
    { name: "Alex", points: 245, memberColor: "member-3" },
    { name: "Sam", points: 156, memberColor: "member-4" }
  ])

  const totalFamilyPoints = familyMembers.reduce((sum, member) => sum + member.points, 0)

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
              {totalFamilyPoints} points
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
              totalPoints={totalFamilyPoints}
              onRewardRedeem={handleRewardSelect}
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