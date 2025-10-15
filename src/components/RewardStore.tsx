import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { RewardCard } from "./RewardCard"
import { getRewards, initializeStorage, type Reward } from "@/utils/localStorage"
import { Gift, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFamilyPoints } from "@/lib/points"
import { useCurrentFamily } from "@/hooks/useCurrentFamily"

interface RewardStoreProps {
  onRewardRedeem: (rewardId: string) => void
}

export function RewardStore({ onRewardRedeem }: RewardStoreProps) {
  const { familyId } = useCurrentFamily()
  const { points: totalPoints } = useFamilyPoints(familyId)
  const [selectedCategory, setSelectedCategory] = useState<"Family Rewards" | "Individual Rewards" | "Special Rewards">("Family Rewards")
  const [rewards, setRewards] = useState<Reward[]>([])

  useEffect(() => {
    initializeStorage()
    setRewards(getRewards())
  }, [])

  const filteredRewards = rewards.filter(reward => reward.category === selectedCategory)

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'Family Rewards':
        return 'family'
      case 'Individual Rewards':
        return 'individual'
      case 'Special Rewards':
        return 'special'
      default:
        return category.toLowerCase()
    }
  }

  return (
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
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value as "Family Rewards" | "Individual Rewards" | "Special Rewards")}
          options={[
            { label: 'Family', value: 'Family Rewards' },
            { label: 'Individual', value: 'Individual Rewards' },
            { label: 'Special', value: 'Special Rewards' },
          ]}
          ariaLabel="Reward category filter"
        />
        
        <div className="space-y-4">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              title={reward.title}
              description={reward.description}
              cost={reward.cost}
              category={getCategoryDisplayName(reward.category) as any}
              rarity={reward.rarity}
              available={totalPoints >= reward.cost}
              onRedeem={() => onRewardRedeem(reward.id)}
            />
          ))}
          
          {filteredRewards.length === 0 && (
            <div className="text-center py-6">
              <Gift className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No rewards available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}