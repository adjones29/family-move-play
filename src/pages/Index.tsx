import { useState, useEffect } from "react"
import { FamilyMemberCard } from "@/components/FamilyMemberCard"
import { FamilyMemberModal } from "@/components/FamilyMemberModal"
import { ChallengeCard } from "@/components/ChallengeCard"
import { ActivityStats } from "@/components/ActivityStats"
import { MiniGameCard } from "@/components/MiniGameCard"
import { RewardStoreCarousel } from "@/components/RewardStoreCarousel"

import { QuickMiniGamesStore } from "@/components/QuickMiniGamesStore"
import { ActiveChallengesStore } from "@/components/ActiveChallengesStore"
import { RewardRedemptionModal } from "@/components/RewardRedemptionModal"
import { RewardRedemptionConfirmModal } from "@/components/RewardRedemptionConfirmModal"
import { SettingsModal } from "@/components/SettingsModal"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { MiniGameModal } from "@/components/MiniGameModal"
import { HeroSection } from "@/components/HeroSection"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Bell, Settings, Dumbbell, Target, Gamepad2, Users, Zap, Gift, Star, LogOut } from "lucide-react"
import { initializeStorage } from "@/utils/localStorage"

const Index = () => {
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<any>(null)
  const [showRedemptionConfirmModal, setShowRedemptionConfirmModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null)
  const [showFamilyMemberModal, setShowFamilyMemberModal] = useState(false)

  // Mock family data with individual point balances
  const [familyMembers, setFamilyMembers] = useState([
    {
      name: "Dad",
      avatar: "",
      dailySteps: 8542,
      stepGoal: 10000,
      weeklyScore: 325,
      memberColor: "member-1" as const,
      points: 325
    },
    {
      name: "Mom", 
      avatar: "",
      dailySteps: 11234,
      stepGoal: 10000,
      weeklyScore: 412,
      memberColor: "member-2" as const,
      points: 412
    },
    {
      name: "Alex",
      avatar: "",
      dailySteps: 6789,
      stepGoal: 8000,
      weeklyScore: 245,
      memberColor: "member-3" as const,
      points: 245
    },
    {
      name: "Sam",
      avatar: "",
      dailySteps: 4521,
      stepGoal: 6000,
      weeklyScore: 156,
      memberColor: "member-4" as const,
      points: 156
    }
  ])

  // Calculate total points from all family members
  const totalFamilyPoints = familyMembers.reduce((sum, member) => sum + member.points, 0)

  const challenges = [
    {
      title: "Family Walk Week",
      description: "Take 50,000 steps together as a family this week!",
      type: "weekly" as const,
      participants: 4,
      progress: 32150,
      totalGoal: 50000,
      daysLeft: 3,
      reward: "Movie Night",
      difficulty: "medium" as const
    },
    {
      title: "Dance Party Daily",
      description: "Dance for 15 minutes every day this week",
      type: "daily" as const, 
      participants: 4,
      progress: 4,
      totalGoal: 7,
      daysLeft: 3,
      reward: "Ice Cream Trip",
      difficulty: "easy" as const
    },
    {
      title: "Fitness Champions",
      description: "Complete 5 different mini-games this month",
      type: "special" as const,
      participants: 4,
      progress: 3,
      totalGoal: 5,
      daysLeft: 12,
      reward: "Theme Park Visit",
      difficulty: "hard" as const
    }
  ]

  const miniGames = [
    {
      title: "Push-up Challenge",
      description: "See who can do the most push-ups in 60 seconds!",
      duration: "1-2 min",
      participants: "2-4 players",
      difficulty: "medium" as const,
      points: 50,
      icon: <Dumbbell className="h-6 w-6" />
    },
    {
      title: "Animal Yoga",
      description: "Copy fun animal poses and movements together",
      duration: "5-10 min", 
      participants: "1-4 players",
      difficulty: "easy" as const,
      points: 30,
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Obstacle Course",
      description: "Navigate through a living room obstacle course",
      duration: "3-5 min",
      participants: "1-4 players", 
      difficulty: "hard" as const,
      points: 75,
      icon: <Zap className="h-6 w-6" />
    }
  ]

  const handleRewardSelect = (rewardId: string) => {
    // Find the reward from localStorage
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (reward) {
      setSelectedRewardForRedemption(reward)
      setShowRedemptionConfirmModal(true)
    }
  }

  // Initialize localStorage on component mount
  useEffect(() => {
    initializeStorage()
  }, [])

  const handleRewardRedemption = (rewardId: string, cost: number, selectedMember?: string) => {
    const rewards = JSON.parse(localStorage.getItem('fitfam-rewards') || '[]')
    const reward = rewards.find((r: any) => r.id === rewardId)
    if (!reward) return

    // Handle point deduction
    if (reward.category === "Family Rewards") {
      // Divide cost across all family members
      const costPerMember = Math.ceil(cost / familyMembers.length)
      setFamilyMembers(prev => 
        prev.map(member => ({
          ...member,
          points: member.points - costPerMember
        }))
      )
    } else if (selectedMember) {
      // Deduct from selected member
      setFamilyMembers(prev => 
        prev.map(member => 
          member.name === selectedMember 
            ? { ...member, points: member.points - cost }
            : member
        )
      )
    }

    
    toast({
      title: "Reward Redeemed! 🎉",
      description: `Successfully redeemed "${reward.title}"${selectedMember ? ` for ${selectedMember}` : ''}`,
    })
  }


  const handlePointsEarned = (points: number) => {
    // For now, add points equally to all family members
    const pointsPerMember = Math.ceil(points / familyMembers.length)
    setFamilyMembers(prev => 
      prev.map(member => ({
        ...member,
        points: member.points + pointsPerMember
      }))
    )
  }

  const handleFamilyMemberClick = (member: any) => {
    setSelectedFamilyMember(member)
    setShowFamilyMemberModal(true)
  }

  const handleFamilyMemberUpdate = (updatedMember: any) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.name === updatedMember.name 
          ? updatedMember
          : member
      )
    )
  }

  return (
    <div className="pb-20"> {/* Bottom padding for navigation */}
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">FitFam</h1>
            <p className="text-sm text-muted-foreground">Family Fitness</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              {totalFamilyPoints} pts
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={signOut}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Content - Single Column */}
      <div className="space-y-6 px-4 py-4">
        {/* Activity Stats */}
        <section>
          <ActivityStats 
            totalSteps={31086}
            activeMinutes={127}
            caloriesBurned={1842}
            goalsAchieved={7}
            totalGoals={12}
          />
        </section>

        {/* Family Members */}
        <section>
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
            
            <CardContent className="p-6 pt-0">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
                {familyMembers.map((member, index) => (
                  <FamilyMemberCard 
                    key={index} 
                    {...member} 
                    onClick={() => handleFamilyMemberClick(member)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Active Challenges */}
        <section>
          <ActiveChallengesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Mini Games */}
        <section>
          <QuickMiniGamesStore 
            familyMembers={familyMembers}
            onPointsEarned={handlePointsEarned}
          />
        </section>

        {/* Reward Store */}
        <section>
        <RewardStoreCarousel 
          totalPoints={totalFamilyPoints}
          onRewardRedeem={handleRewardSelect}
        />
        </section>

      </div>

      {/* Modals and Drawers */}
      <RewardRedemptionConfirmModal
        isOpen={showRedemptionConfirmModal}
        onClose={() => setShowRedemptionConfirmModal(false)}
        reward={selectedRewardForRedemption}
        familyMembers={familyMembers}
        onConfirmRedemption={handleRewardRedemption}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <FamilyMemberModal
        member={selectedFamilyMember}
        isOpen={showFamilyMemberModal}
        onClose={() => setShowFamilyMemberModal(false)}
        onUpdate={handleFamilyMemberUpdate}
      />
    </div>
  );
};

export default Index;
