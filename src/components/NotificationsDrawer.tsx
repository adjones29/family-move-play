import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trophy, Users, Target, Gift, Clock, X, CheckCircle, Star } from "lucide-react"

interface NotificationsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface Notification {
  id: string
  type: "achievement" | "challenge" | "reward" | "reminder"
  title: string
  message: string
  time: string
  isRead: boolean
  icon?: React.ReactNode
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "achievement",
      title: "New Achievement Unlocked!",
      message: "You've completed your 7-day walking streak! 🎉",
      time: "2 minutes ago",
      isRead: false,
      icon: <Trophy className="h-4 w-4 text-yellow-500" />
    },
    {
      id: "2", 
      type: "challenge",
      title: "Family Challenge Update",
      message: "Your family is 80% complete with this week's walking challenge!",
      time: "1 hour ago",
      isRead: false,
      icon: <Users className="h-4 w-4 text-blue-500" />
    },
    {
      id: "3",
      type: "reward",
      title: "Reward Expiring Soon",
      message: "Your 'Family Movie Night' reward expires in 2 days",
      time: "3 hours ago",
      isRead: true,
      icon: <Gift className="h-4 w-4 text-purple-500" />
    },
    {
      id: "4",
      type: "reminder",
      title: "Daily Activity Reminder",
      message: "Don't forget to log your afternoon workout!",
      time: "5 hours ago",
      isRead: true,
      icon: <Target className="h-4 w-4 text-green-500" />
    },
    {
      id: "5",
      type: "achievement",
      title: "Points Milestone!",
      message: "Congratulations! You've earned over 100 points this week",
      time: "1 day ago",
      isRead: true,
      icon: <Star className="h-4 w-4 text-orange-500" />
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[600px]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle className="flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {unreadCount} new
              </Badge>
            )}
          </DrawerTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>All caught up!</p>
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      !notification.isRead 
                        ? "bg-primary/5 border border-primary/10" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {notification.icon}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${
                          !notification.isRead ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}