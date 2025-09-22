import { useState } from "react"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Plus, Edit2, Trash2, Mail, MessageSquare, UserPlus, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface FamilyMember {
  id: string
  name: string
  email: string
  phone: string
  role: 'parent' | 'child' | 'guardian'
  avatar?: string
  status: 'active' | 'pending' | 'inactive'
  joinedDate: string
}

const Family = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'John Johnson',
      email: 'john@johnson.com',
      phone: '+1234567890',
      role: 'parent',
      status: 'active',
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@johnson.com',
      phone: '+1234567891',
      role: 'parent',
      status: 'active',
      joinedDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Emma Johnson',
      email: 'emma@johnson.com',
      phone: '+1234567892',
      role: 'child',
      status: 'active',
      joinedDate: '2024-02-01'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'child' as 'parent' | 'child' | 'guardian',
    inviteMethod: 'email' as 'email' | 'sms'
  })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and email fields.",
        variant: "destructive"
      })
      return
    }

    if (familyMembers.length >= 8) {
      toast({
        title: "Family Size Limit",
        description: "Maximum 8 family members allowed.",
        variant: "destructive"
      })
      return
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0]
    }

    setFamilyMembers([...familyMembers, member])
    setNewMember({ name: '', email: '', phone: '', role: 'child', inviteMethod: 'email' })
    setShowAddForm(false)

    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${member.name} via ${newMember.inviteMethod}.`,
    })
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      inviteMethod: 'email'
    })
  }

  const handleUpdateMember = () => {
    if (!editingMember) return

    const updatedMembers = familyMembers.map(member =>
      member.id === editingMember.id
        ? { ...member, name: newMember.name, email: newMember.email, phone: newMember.phone, role: newMember.role }
        : member
    )

    setFamilyMembers(updatedMembers)
    setEditingMember(null)
    setNewMember({ name: '', email: '', phone: '', role: 'child', inviteMethod: 'email' })

    toast({
      title: "Member Updated",
      description: "Family member information has been updated.",
    })
  }

  const handleDeleteMember = (memberId: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId))
    toast({
      title: "Member Removed",
      description: "Family member has been removed from your family.",
    })
  }

  const handleResendInvite = (member: FamilyMember) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation resent to ${member.name} via email.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent': return '👨‍👩‍👧‍👦'
      case 'child': return '🧒'
      case 'guardian': return '👨‍⚕️'
      default: return '👤'
    }
  }

  return (
    <div className="pb-20"> {/* Bottom padding for navigation */}
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Family</h1>
                <p className="text-sm text-muted-foreground">Manage Members ({familyMembers.length}/8)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Add New Member Button */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Manage your family members and send invitations to join your fitness journey.
          </p>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={familyMembers.length >= 8}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Add/Edit Member Form */}
        {(showAddForm || editingMember) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {editingMember ? 'Edit Family Member' : 'Add New Family Member'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="member-name">Full Name *</Label>
                  <Input
                    id="member-name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="member-role">Role</Label>
                  <Select value={newMember.role} onValueChange={(value: 'parent' | 'child' | 'guardian') => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="member-email">Email Address *</Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="member-phone">Phone Number</Label>
                  <Input
                    id="member-phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {!editingMember && (
                <div>
                  <Label>Invitation Method</Label>
                  <Select value={newMember.inviteMethod} onValueChange={(value: 'email' | 'sms') => setNewMember({ ...newMember, inviteMethod: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={editingMember ? handleUpdateMember : handleAddMember}
                  className="flex items-center gap-2"
                >
                  {editingMember ? (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Update Member
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingMember(null)
                    setNewMember({ name: '', email: '', phone: '', role: 'child', inviteMethod: 'email' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Family Members List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Family Members</h3>
          <div className="grid gap-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{member.name}</h4>
                          <span className="text-lg">{getRoleIcon(member.role)}</span>
                          <Badge variant="secondary" className="capitalize">
                            {member.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {member.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        {member.phone && (
                          <p className="text-sm text-muted-foreground">{member.phone}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(member.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {member.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendInvite(member)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Resend
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMember(member)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMember(member.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Family