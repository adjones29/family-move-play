import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { redeemFamilyReward, redeemIndividualReward, formatPts } from "@/lib/points"
import { useToast } from "@/hooks/use-toast"

interface FamilyMember {
  id: string
  display_name: string | null
  points?: number
}

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: string
  rarity: string
  timeLimit?: string
  participantsRequired?: number
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
  const { toast } = useToast()
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [membersWithBalances, setMembersWithBalances] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(false)
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    if (isOpen && reward) {
      fetchMemberBalances()
      setSelectedMemberIds([])
    }
  }, [isOpen, reward])

  const fetchMemberBalances = async () => {
    setLoading(true)
    try {
      const memberIds = familyMembers.map(m => m.id)
      const { data: balances, error } = await supabase
        .from('v_points_balances')
        .select('member_id, points')
        .in('member_id', memberIds)

      if (error) throw error

      const membersWithPoints = familyMembers.map(member => ({
        ...member,
        points: balances?.find(b => b.member_id === member.id)?.points || 0
      }))

      setMembersWithBalances(membersWithPoints)
    } catch (error: any) {
      console.error('Error fetching balances:', error)
      toast({
        title: "Error",
        description: "Failed to load member balances",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedMemberIds([])
    onClose()
  }

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleConfirm = async () => {
    if (!reward) return

    setRedeeming(true)
    try {
      // Get family ID from first family member
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('id', familyMembers[0].id)
        .single()

      if (memberError || !memberData) throw memberError || new Error('Could not find family')

      const isFamilyReward = reward.category === "Family Rewards"
      
      let result
      if (isFamilyReward) {
        result = await redeemFamilyReward({
          familyId: memberData.family_id,
          rewardId: reward.id,
          rewardTitle: reward.title,
          rewardDescription: reward.description,
          rewardCost: reward.cost,
          rewardCategory: reward.category,
          rewardRarity: reward.rarity
        })
      } else {
        if (selectedMemberIds.length === 0) {
          toast({
            title: "No members selected",
            description: "Please select at least one member to redeem this reward",
            variant: "destructive"
          })
          setRedeeming(false)
          return
        }

        result = await redeemIndividualReward({
          familyId: memberData.family_id,
          rewardId: reward.id,
          rewardTitle: reward.title,
          rewardDescription: reward.description,
          rewardCost: reward.cost,
          rewardCategory: reward.category,
          rewardRarity: reward.rarity,
          memberIds: selectedMemberIds
        })
      }

      if (result.success) {
        toast({
          title: "Reward Redeemed! 🎉",
          description: result.message
        })
        onConfirmRedemption(reward.id, reward.cost)
        handleClose()
      } else {
        toast({
          title: "Cannot redeem",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Redemption error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward",
        variant: "destructive"
      })
    } finally {
      setRedeeming(false)
    }
  }

  if (!reward) return null

  const isFamilyReward = reward.category === "Family Rewards"
  const totalFamilyPoints = membersWithBalances.reduce((sum, m) => sum + (m.points || 0), 0)
  const canAffordFamily = totalFamilyPoints >= reward.cost
  
  const selectedMembersCanAfford = selectedMemberIds.every(id => {
    const member = membersWithBalances.find(m => m.id === id)
    return (member?.points || 0) >= reward.cost
  })

  const rarityColors: Record<string, string> = {
    common: "text-muted-foreground",
    rare: "text-blue-500",
    epic: "text-purple-500",
    legendary: "text-amber-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Redeem Reward</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${rarityColors[reward.rarity]}`}>
              {reward.title}
            </h3>
            <p className="text-sm text-muted-foreground">{reward.description}</p>
            
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{reward.category}</Badge>
              <Badge variant="outline" className={rarityColors[reward.rarity]}>
                {reward.rarity}
              </Badge>
              {reward.timeLimit && (
                <Badge variant="outline">{reward.timeLimit}</Badge>
              )}
              {reward.participantsRequired && (
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {reward.participantsRequired}+
                </Badge>
              )}
            </div>
          </div>

          {isFamilyReward ? (
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reward Cost:</span>
                  <span className="font-semibold">{formatPts(reward.cost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Family Points:</span>
                  <span className="font-semibold">{formatPts(totalFamilyPoints)}</span>
                </div>
              </div>

              {!canAffordFamily && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient family points. Need {formatPts(reward.cost - totalFamilyPoints)} more.
                  </AlertDescription>
                </Alert>
              )}

              {canAffordFamily && (
                <Alert>
                  <AlertDescription>
                    Points will be deducted evenly across all family members.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Cost per person: {formatPts(reward.cost)}</p>
                <p className="text-xs text-muted-foreground">Select who will redeem this reward:</p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading balances...</p>
                ) : (
                  membersWithBalances.map(member => {
                    const canAfford = (member.points || 0) >= reward.cost
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={member.id}
                            checked={selectedMemberIds.includes(member.id)}
                            onCheckedChange={() => toggleMemberSelection(member.id)}
                            disabled={!canAfford}
                          />
                          <Label
                            htmlFor={member.id}
                            className={`cursor-pointer ${!canAfford ? 'text-muted-foreground' : ''}`}
                          >
                            {member.display_name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${!canAfford ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {formatPts(member.points || 0)}
                          </span>
                          {!canAfford && (
                            <Badge variant="destructive" className="text-xs">
                              Can't afford
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {selectedMemberIds.length > 0 && !selectedMembersCanAfford && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Some selected members cannot afford this reward.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={redeeming}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              redeeming ||
              loading ||
              (isFamilyReward ? !canAffordFamily : selectedMemberIds.length === 0 || !selectedMembersCanAfford)
            }
          >
            {redeeming ? "Redeeming..." : "Confirm Redemption"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
