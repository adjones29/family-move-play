import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardCard } from "./RewardCard"
import { getRewards, initializeStorage, type Reward } from "@/utils/localStorage"
import { Gift, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RewardStoreProps {
  totalPoints: number
  onRewardRedeem: (rewardId: string, cost: number) => void
}

export function RewardStore({ totalPoints, onRewardRedeem }: RewardStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Family Rewards" | "Individual Rewards" | "Special Rewards">("All")
  const [rewards, setRewards] = useState<Reward[]>([])

  useEffect(() => {
    initializeStorage()
    setRewards(getRewards())
  }, [])

  const filteredRewards = selectedCategory === "All" 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory)

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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center">
            <Gift className="h-6 w-6 mr-2 text-primary" />
            Reward Store
          </CardTitle>
          <Badge variant="secondary" className="bg-gradient-energy text-white px-4 py-2">
            <Star className="h-4 w-4 mr-1 fill-white" />
            {totalPoints} Points
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="All">All Rewards</TabsTrigger>
            <TabsTrigger value="Family Rewards">Family</TabsTrigger>
            <TabsTrigger value="Individual Rewards">Individual</TabsTrigger>
            <TabsTrigger value="Special Rewards">Special</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  title={reward.title}
                  description={reward.description}
                  cost={reward.cost}
                  category={getCategoryDisplayName(reward.category) as any}
                  rarity={reward.rarity}
                  available={totalPoints >= reward.cost}
                  onRedeem={() => onRewardRedeem(reward.id, reward.cost)}
                />
              ))}
            </div>
            
            {filteredRewards.length === 0 && (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rewards available in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}