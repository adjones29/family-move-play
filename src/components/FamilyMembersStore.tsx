import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
    <Card className="shadow-card bg-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Family Members
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 p-4 pt-0">
            {familyMembers.map((member, index) => (
              <div key={index} className="flex-shrink-0 w-64">
                <FamilyMemberCard 
                  {...member} 
                  onClick={() => onMemberClick(member)}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}