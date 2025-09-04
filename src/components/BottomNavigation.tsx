import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Target, Gamepad2, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

export const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      badge: null
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Target,
      path: '/challenges',
      badge: '3'
    },
    {
      id: 'games',
      label: 'Games',
      icon: Gamepad2,
      path: '/games',
      badge: null
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: Gift,
      path: '/rewards',
      badge: null
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="safe-area-inset-bottom">
        <div className="flex justify-around items-center px-4 py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[44px] transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(tab.path)}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {tab.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}