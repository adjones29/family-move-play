import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { 
  CheckCircle, 
  Clock, 
  Trophy, 
  Calendar,
  RotateCcw,
  AlertTriangle
} from "lucide-react"

interface EarnedReward {
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

interface EarnedRewardsProps {
  rewards: EarnedReward[]
  onUseReward?: (rewardId: string) => void
  className?: string
}

export function EarnedRewards({ rewards, onUseReward, className }: EarnedRewardsProps) {
  const activeRewards = rewards.filter(r => r.status === "active")
  const usedRewards = rewards.filter(r => r.status === "used")
  const expiredRewards = rewards.filter(r => r.status === "expired")

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  const isExpiringSoon = (expiresAt?: Date) => {
    if (!expiresAt) return false
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return expiresAt <= threeDaysFromNow
  }

  const rarityColors = {
    common: "border-muted",
    rare: "border-member-3",
    epic: "border-member-2",
    legendary: "border-member-2"
  }

  const statusConfig = {
    active: {
      badge: "bg-member-3 text-white",
      icon: <CheckCircle className="h-4 w-4" />
    },
    used: {
      badge: "bg-muted text-muted-foreground",
      icon: <RotateCcw className="h-4 w-4" />
    },
    expired: {
      badge: "bg-destructive text-destructive-foreground",
      icon: <AlertTriangle className="h-4 w-4" />
    }
  }

  if (rewards.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No Rewards Yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Start completing challenges to earn your first rewards!
          </p>
        </CardContent>
      </Card>
    )
  }

  const RewardCard = ({ reward }: { reward: EarnedReward }) => {
    const config = statusConfig[reward.status]
    const isExpiring = isExpiringSoon(reward.expiresAt)
    
    return (
      <Card 
        key={reward.id} 
        className={`border-2 ${rarityColors[reward.rarity]} ${
          reward.status === "expired" ? "opacity-60" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {reward.icon}
              <h4 className="font-semibold text-sm">{reward.title}</h4>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className={config.badge}>
                {config.icon}
                <span className="ml-1 text-xs">{reward.status}</span>
              </Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {reward.description}
          </p>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Earned {formatDate(reward.redeemedAt)}</span>
            </div>

            {reward.expiresAt && reward.status === "active" && (
              <div className={`flex items-center ${isExpiring ? "text-destructive" : "text-muted-foreground"}`}>
                <Clock className="h-3 w-3 mr-1" />
                <span>Expires {formatDate(reward.expiresAt)}</span>
              </div>
            )}
          </div>

          {reward.status === "active" && onUseReward && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUseReward(reward.id)}
              className="w-full mt-3 text-xs"
            >
              Mark as Used
            </Button>
          )}

          {isExpiring && reward.status === "active" && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
              <div className="flex items-center text-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="font-medium">Expiring soon!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRewards.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-member-3" />
              Active Rewards ({activeRewards.length})
            </h4>
            <div className="grid gap-3">
              {activeRewards.map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </div>
        )}

        {usedRewards.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center">
              <RotateCcw className="h-4 w-4 mr-1" />
              Used Rewards ({usedRewards.length})
            </h4>
            <div className="grid gap-3">
              {usedRewards.slice(0, 3).map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
              {usedRewards.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  and {usedRewards.length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}

        {expiredRewards.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Expired Rewards ({expiredRewards.length})
            </h4>
            <div className="grid gap-3">
              {expiredRewards.slice(0, 2).map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
              {expiredRewards.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  and {expiredRewards.length - 2} more...
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}