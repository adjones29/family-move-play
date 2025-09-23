import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { RewardCard } from "./RewardCard"
import { getRewards, initializeStorage, type Reward } from "@/utils/localStorage"
import { Gift, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RewardStoreCarouselProps {
  totalPoints: number
  onRewardRedeem: (rewardId: string) => void
}

export function RewardStoreCarousel({ totalPoints, onRewardRedeem }: RewardStoreCarouselProps) {
  const [rewards, setRewards] = useState<Reward[]>([])

  useEffect(() => {
    initializeStorage()
    setRewards(getRewards())
  }, [])

  // Get a mix of rewards from all categories for the carousel
  const allRewards = rewards.slice(0, 8) // Limit to 8 items for better performance

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
      
      <CardContent className="px-2">
        {allRewards.length > 0 ? (
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {allRewards.map((reward) => (
                <CarouselItem key={reward.id} className="pl-2 md:pl-4 basis-[78%] min-w-[260px] max-w-[320px]">
                  <RewardCard
                    title={reward.title}
                    description={reward.description}
                    cost={reward.cost}
                    category={getCategoryDisplayName(reward.category) as any}
                    rarity={reward.rarity}
                    available={totalPoints >= reward.cost}
                    onRedeem={() => onRewardRedeem(reward.id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="text-center py-6">
            <Gift className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No rewards available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}