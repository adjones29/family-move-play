import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { Users } from "lucide-react"

interface FamilyMember {
  name: string
  avatar: string
  dailySteps: number
  stepGoal: number
  weeklyScore: number
  badges: number
  memberColor: "member-1" | "member-2" | "member-3" | "member-4"
  points: number
  weeklySteps?: number
}

interface FamilyMembersStoreProps {
  familyMembers: FamilyMember[]
  onMemberClick: (member: FamilyMember) => void
}

export const FamilyMembersStore = ({ familyMembers, onMemberClick }: FamilyMembersStoreProps) => {
  return (
    <Card className="shadow-float">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Family Members
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary text-sm">
            See All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
          {familyMembers.map((member, index) => (
            <FamilyMemberCard 
              key={index}
              {...member} 
              onClick={() => onMemberClick(member)}
            />
          ))}
        </div>
        
        {familyMembers.length === 0 && (
          <div className="text-center py-6">
            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No family members added</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}