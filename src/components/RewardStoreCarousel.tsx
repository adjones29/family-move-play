import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Gift, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ItemCard } from "@/components/ui/ItemCard"
import { fetchRewardsByType } from "@/lib/catalog"
import { useFamilyPoints } from "@/lib/points"
import { useCurrentFamily } from "@/hooks/useCurrentFamily"

interface RewardStoreCarouselProps {
  familyMembers: Array<{ id: string; name: string; memberColor: string }>
  onRewardRedeem: (rewardId: string) => void
}

type Reward = {
  id: string
  title: string
  description?: string | null
  cost: number
  type: string
  image_url?: string | null
}

export function RewardStoreCarousel({ familyMembers, onRewardRedeem }: RewardStoreCarouselProps) {
  const { familyId } = useCurrentFamily()
  const { points: totalPoints } = useFamilyPoints(familyId)
  const [selectedType, setSelectedType] = useState<"family" | "individual" | "special">("family")
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const { toast } = useToast()

  const loadRewards = async () => {
    const data = await fetchRewardsByType(selectedType)
    setRewards(data as Reward[])
  }

  useEffect(() => {
    loadRewards()
  }, [selectedType])

  const handleRewardSelect = (reward: Reward) => {
    if (totalPoints < reward.cost) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.cost - totalPoints} more points to redeem this reward.`,
        variant: "destructive"
      })
      return
    }
    setSelectedReward(reward)
    setSelectedParticipants([])
    setShowParticipantModal(true)
  }

  const handleRedeemReward = async () => {
    if (!selectedReward || selectedParticipants.length === 0) return

    try {
      onRewardRedeem(selectedReward.id)
      
      toast({
        title: "Reward Redeemed! 🎁",
        description: `${selectedParticipants.join(", ")} redeemed "${selectedReward.title}" for ${selectedReward.cost} points`,
      })

      setShowParticipantModal(false)
      setSelectedReward(null)
      setSelectedParticipants([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive"
      })
    }
  }

  const toggleParticipant = (memberName: string) => {
    setSelectedParticipants(prev => 
      prev.includes(memberName)
        ? prev.filter(name => name !== memberName)
        : [...prev, memberName]
    )
  }

  return (
    <>
      <Card className="shadow-float">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Gift className="h-5 w-5 mr-2 text-primary" />
              Reward Store
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                See All
              </Button>
              <Badge variant="secondary" className="bg-gradient-energy text-white px-3 py-1">
                <Star className="h-3 w-3 mr-1 fill-white" />
                {totalPoints}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <SegmentedControl
            value={selectedType}
            onChange={(value) => setSelectedType(value as "family" | "individual" | "special")}
            options={[
              { label: 'Family', value: 'family' },
              { label: 'Individual', value: 'individual' },
              { label: 'Special', value: 'special' },
            ]}
            ariaLabel="Reward type filter"
          />
          
          <div className="space-y-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
              {rewards.slice(0, 6).map((reward) => (
                <ItemCard
                  key={reward.id}
                  title={reward.title}
                  subtitle={`${reward.cost} pts`}
                  itemId={reward.id}
                  itemType="reward"
                  row={reward}
                  onClick={() => handleRewardSelect(reward)}
                  className="flex-shrink-0"
                />
              ))}
            </div>
            
            {rewards.length === 0 && (
              <div className="text-center py-6">
                <Gift className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No rewards available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Participants</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose who will redeem "{selectedReward?.title}" for {selectedReward?.cost} points
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.name} className="flex items-center space-x-3">
                <Checkbox
                  id={`reward-${member.name}`}
                  checked={selectedParticipants.includes(member.name)}
                  onCheckedChange={() => toggleParticipant(member.name)}
                />
                <label 
                  htmlFor={`reward-${member.name}`}
                  className="cursor-pointer flex-1"
                >
                  {member.name}
                </label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button 
              onClick={handleRedeemReward}
              disabled={selectedParticipants.length === 0}
              className="w-full"
            >
              Redeem Reward ({selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
