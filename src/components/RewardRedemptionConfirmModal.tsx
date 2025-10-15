import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Gift, Users, User, AlertCircle } from "lucide-react"

interface FamilyMember {
  id: string
  display_name: string | null
  avatar_url?: string | null
  role?: string
  points?: number
}

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: "Family Rewards" | "Individual Rewards" | "Special Rewards"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface RewardRedemptionConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  reward: Reward | null
  familyMembers: FamilyMember[]
  onConfirmRedemption: (rewardId: string, cost: number, selectedMemberId?: string) => void
}

export function RewardRedemptionConfirmModal({ 
  isOpen, 
  onClose, 
  reward, 
  familyMembers, 
  onConfirmRedemption 
}: RewardRedemptionConfirmModalProps) {
  const [selectedMember, setSelectedMember] = useState("")

  if (!reward) return null

  const isFamilyReward = reward.category === "Family Rewards"
  const costPerMember = isFamilyReward ? Math.ceil(reward.cost / familyMembers.length) : reward.cost
  
  const canAfford = isFamilyReward 
    ? familyMembers.every(member => (member.points ?? 0) >= costPerMember)
    : selectedMember 
      ? (familyMembers.find(m => m.id === selectedMember)?.points ?? 0) >= reward.cost
      : false

  const handleConfirm = () => {
    if (canAfford) {
      onConfirmRedemption(reward.id, reward.cost, selectedMember || undefined)
      setSelectedMember("")
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedMember("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Confirm Redemption
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-1">{reward.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {reward.cost} points
            </Badge>
          </div>

          <Separator />

          {isFamilyReward ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">Family Reward</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cost will be split across all family members ({costPerMember} points each)
              </p>
              
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{member.display_name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{member.points ?? 0} points</span>
                      {(member.points ?? 0) < costPerMember && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">Individual Reward</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Select which family member will redeem this reward:
              </p>
              
              <RadioGroup value={selectedMember} onValueChange={setSelectedMember}>
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <Label 
                      htmlFor={member.id} 
                      className={`flex items-center gap-2 cursor-pointer ${(member.points ?? 0) < reward.cost ? 'opacity-50' : ''}`}
                    >
                      <RadioGroupItem 
                        value={member.id} 
                        id={member.id}
                        disabled={(member.points ?? 0) < reward.cost}
                      />
                      {member.display_name || 'Unknown'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{member.points ?? 0} points</span>
                      {(member.points ?? 0) < reward.cost && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {!canAfford && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {isFamilyReward 
                    ? "Not all family members have enough points" 
                    : selectedMember 
                      ? "Selected member doesn't have enough points"
                      : "Please select a family member"
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!canAfford}
          >
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}