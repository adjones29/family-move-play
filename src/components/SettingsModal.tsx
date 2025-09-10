import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Volume2, Clock, Users } from "lucide-react"
import { FamilyManagement } from "./FamilyManagement"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [volume, setVolume] = useState([75])
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("english")
  const [showFamilyManagement, setShowFamilyManagement] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="family-name">Family Name</Label>
                <Select value="johnson-family">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="johnson-family">Johnson Family</SelectItem>
                    <SelectItem value="smith-family">Smith Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="manage-family">Manage Family</Label>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove family members</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFamilyManagement(true)}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Push Notifications</Label>
                <Switch 
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-reminders">Daily Activity Reminders</Label>
                <Switch 
                  id="daily-reminders"
                  checked={dailyReminders}
                  onCheckedChange={setDailyReminders}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display & Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Display & Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <Switch 
                  id="sound-effects"
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
              <div className="space-y-2">
                <Label>Volume</Label>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Privacy & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="parental-controls">Parental Controls</Label>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="data-sharing">Data Sharing</Label>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="default" onClick={onClose}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>

      {/* Family Management Modal */}
      <FamilyManagement 
        isOpen={showFamilyManagement} 
        onClose={() => setShowFamilyManagement(false)} 
      />
    </Dialog>
  )
}