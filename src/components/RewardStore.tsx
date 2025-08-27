import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardCard } from "./RewardCard"
import { 
  Gift, 
  Star, 
  Users, 
  Gamepad2, 
  Home, 
  MapPin, 
  Pizza, 
  Popcorn,
  Car,
  ShoppingBag,
  Cake
} from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: "family" | "individual" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  timeLimit?: string
  participantsRequired?: number
  icon?: React.ReactNode
  available: boolean
}

interface RewardStoreProps {
  totalPoints: number
  onRewardRedeem: (rewardId: string, cost: number) => void
}

export function RewardStore({ totalPoints, onRewardRedeem }: RewardStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const rewards: Reward[] = [
    // Family Rewards
    {
      id: "movie-night",
      title: "Family Movie Night",
      description: "Choose any movie for tonight's family viewing with snacks included!",
      cost: 50,
      category: "family",
      rarity: "common",
      participantsRequired: 2,
      icon: <Popcorn className="h-4 w-4" />,
      available: totalPoints >= 50
    },
    {
      id: "ice-cream-trip",
      title: "Ice Cream Shop Visit",
      description: "Family trip to your favorite ice cream parlor - everyone gets two scoops!",
      cost: 75,
      category: "family", 
      rarity: "rare",
      timeLimit: "Valid for 7 days",
      participantsRequired: 3,
      icon: <Gift className="h-4 w-4" />,
      available: totalPoints >= 75
    },
    {
      id: "theme-park",
      title: "Theme Park Adventure",
      description: "Full day at the local theme park with fast passes included!",
      cost: 200,
      category: "family",
      rarity: "legendary",
      timeLimit: "Valid for 30 days",
      participantsRequired: 4,
      icon: <Car className="h-4 w-4" />,
      available: totalPoints >= 200
    },
    
    // Individual Rewards
    {
      id: "extra-screen-time",
      title: "Extra Screen Time",
      description: "Earn 30 minutes of bonus screen time for games or videos",
      cost: 25,
      category: "individual",
      rarity: "common",
      timeLimit: "Use within 3 days",
      icon: <Gamepad2 className="h-4 w-4" />,
      available: totalPoints >= 25
    },
    {
      id: "choose-dinner",
      title: "Pick Tonight's Dinner",
      description: "Choose what the whole family has for dinner (within reason!)",
      cost: 40,
      category: "individual",
      rarity: "rare",
      timeLimit: "Valid today only",
      icon: <Pizza className="h-4 w-4" />,
      available: totalPoints >= 40
    },
    {
      id: "shopping-choice",
      title: "Special Purchase",
      description: "Pick one small item during our next shopping trip",
      cost: 60,
      category: "individual",
      rarity: "epic",
      timeLimit: "Valid for 14 days",
      icon: <ShoppingBag className="h-4 w-4" />,
      available: totalPoints >= 60
    },
    
    // Special Rewards
    {
      id: "skip-chore",
      title: "Skip One Chore",
      description: "Get out of doing one assigned household chore this week",
      cost: 30,
      category: "special",
      rarity: "common",
      timeLimit: "Use this week",
      icon: <Home className="h-4 w-4" />,
      available: totalPoints >= 30
    },
    {
      id: "plan-outing",
      title: "Plan Family Outing",
      description: "You get to plan and choose our next family adventure!",
      cost: 100,
      category: "special",
      rarity: "epic",
      timeLimit: "Valid for 21 days",
      participantsRequired: 4,
      icon: <MapPin className="h-4 w-4" />,
      available: totalPoints >= 100
    },
    {
      id: "birthday-bonus",
      title: "Birthday Week Special",
      description: "Extra special privileges during your birthday week!",
      cost: 150,
      category: "special",
      rarity: "legendary",
      timeLimit: "Save for birthday",
      icon: <Cake className="h-4 w-4" />,
      available: totalPoints >= 150
    }
  ]

  const filteredRewards = selectedCategory === "all" 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory)

  const handleRedeem = (rewardId: string, cost: number) => {
    onRewardRedeem(rewardId, cost)
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
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Rewards</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  {...reward}
                  onRedeem={() => handleRedeem(reward.id, reward.cost)}
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