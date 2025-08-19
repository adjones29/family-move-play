import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Gift, 
  Star, 
  CheckCircle, 
  Clock, 
  Users,
  Sparkles
} from "lucide-react"

interface RewardRedemptionModalProps {
  isOpen: boolean
  onClose: () => void
  reward: {
    id: string
    title: string
    description: string
    cost: number
    category: "family" | "individual" | "special"
    rarity: "common" | "rare" | "epic" | "legendary"
    timeLimit?: string
    participantsRequired?: number
    icon?: React.ReactNode
  } | null
  currentPoints: number
  onConfirmRedeem: (rewardId: string, cost: number) => void
}

export function RewardRedemptionModal({ 
  isOpen, 
  onClose, 
  reward, 
  currentPoints,
  onConfirmRedeem 
}: RewardRedemptionModalProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!reward) return null

  const canAfford = currentPoints >= reward.cost
  const remainingPoints = currentPoints - reward.cost

  const handleRedeem = async () => {
    if (!canAfford) return
    
    setIsRedeeming(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onConfirmRedeem(reward.id, reward.cost)
    setIsRedeeming(false)
    setShowSuccess(true)
    
    // Auto close after success animation
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 2000)
  }

  const rarityColors = {
    common: "text-muted-foreground",
    rare: "text-member-3",
    epic: "text-member-2", 
    legendary: "text-badge-gold"
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-member-3" />
              <Sparkles className="h-6 w-6 text-badge-gold absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Reward Redeemed!</h3>
            <p className="text-muted-foreground">
              Enjoy your <span className="font-semibold">{reward.title}</span>!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-primary" />
            <span>Redeem Reward</span>
          </DialogTitle>
          <DialogDescription>
            Confirm your reward redemption details
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {reward.icon}
                <h4 className="font-semibold text-foreground">{reward.title}</h4>
              </div>
              <Badge variant="outline" className={rarityColors[reward.rarity]}>
                {reward.rarity}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {reward.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {reward.timeLimit && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {reward.timeLimit}
                </Badge>
              )}
              {reward.participantsRequired && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {reward.participantsRequired}+ players
                </Badge>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted-foreground">Cost:</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-badge-gold fill-badge-gold" />
                  <span className="font-semibold">{reward.cost}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted-foreground">Current Points:</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-badge-gold fill-badge-gold" />
                  <span className="font-semibold">{currentPoints}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">After Redemption:</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-badge-gold fill-badge-gold" />
                  <span className={`font-semibold ${remainingPoints < 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {remainingPoints}
                  </span>
                </div>
              </div>
            </div>

            {!canAfford && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-destructive text-sm font-medium">
                  Insufficient points! You need {reward.cost - currentPoints} more points.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleRedeem}
            disabled={!canAfford || isRedeeming}
            className="flex items-center space-x-2"
          >
            {isRedeeming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Redeeming...</span>
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                <span>Redeem Reward</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}