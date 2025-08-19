import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface RewardCardProps {
  title: string
  description: string
  cost: number
  category: "family" | "individual" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  timeLimit?: string
  participantsRequired?: number
  icon?: React.ReactNode
  available: boolean
  onRedeem: () => void
  className?: string
}

const rarityConfig = {
  common: {
    border: "border-muted",
    bg: "bg-card",
    badge: "bg-muted text-muted-foreground"
  },
  rare: {
    border: "border-member-3",
    bg: "bg-gradient-to-br from-card to-member-3/5",
    badge: "bg-member-3 text-white"
  },
  epic: {
    border: "border-member-2",
    bg: "bg-gradient-to-br from-card to-member-2/5", 
    badge: "bg-member-2 text-white"
  },
  legendary: {
    border: "border-badge-gold",
    bg: "bg-gradient-to-br from-card to-badge-gold/10",
    badge: "bg-badge-gold text-white"
  }
}

const categoryIcons = {
  family: <Users className="h-4 w-4" />,
  individual: <Star className="h-4 w-4" />,
  special: <Gift className="h-4 w-4" />
}

export function RewardCard({
  title,
  description,
  cost,
  category,
  rarity,
  timeLimit,
  participantsRequired,
  icon,
  available,
  onRedeem,
  className
}: RewardCardProps) {
  const config = rarityConfig[rarity]
  
  return (
    <Card className={cn(
      "shadow-card hover:shadow-float transition-all duration-300 border-2",
      config.border,
      config.bg,
      !available && "opacity-60 cursor-not-allowed",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {icon || categoryIcons[category]}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className={config.badge}>
            {rarity}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {timeLimit && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeLimit}
            </Badge>
          )}
          {participantsRequired && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {participantsRequired}+ players
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-badge-gold fill-badge-gold" />
            <span className="font-semibold text-foreground">{cost} points</span>
          </div>
          
          <Button
            variant={available ? "energy" : "outline"}
            size="sm"
            onClick={onRedeem}
            disabled={!available}
            className="text-xs"
          >
            {available ? "Redeem" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}