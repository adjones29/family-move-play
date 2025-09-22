import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, Edit2, Trash2, Mail, MessageSquare, UserPlus, ArrowLeft, MoreVertical, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'parent' | 'child' | 'guardian';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedDate: string;
}
const Family = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{
    id: '1',
    name: 'John Johnson',
    email: 'john@johnson.com',
    phone: '+1234567890',
    role: 'parent',
    status: 'active',
    joinedDate: '2024-01-15'
  }, {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@johnson.com',
    phone: '+1234567891',
    role: 'parent',
    status: 'active',
    joinedDate: '2024-01-15'
  }, {
    id: '3',
    name: 'Emma Johnson',
    email: 'emma@johnson.com',
    phone: '+1234567892',
    role: 'child',
    status: 'active',
    joinedDate: '2024-02-01'
  }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'child' as 'parent' | 'child' | 'guardian',
    inviteMethod: 'email' as 'email' | 'sms'
  });
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and email fields.",
        variant: "destructive"
      });
      return;
    }
    if (familyMembers.length >= 8) {
      toast({
        title: "Family Size Limit",
        description: "Maximum 8 family members allowed.",
        variant: "destructive"
      });
      return;
    }
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setFamilyMembers([...familyMembers, member]);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: 'child',
      inviteMethod: 'email'
    });
    setShowAddForm(false);
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${member.name} via ${newMember.inviteMethod}.`
    });
  };
  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      inviteMethod: 'email'
    });
  };
  const handleUpdateMember = () => {
    if (!editingMember) return;
    const updatedMembers = familyMembers.map(member => member.id === editingMember.id ? {
      ...member,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role
    } : member);
    setFamilyMembers(updatedMembers);
    setEditingMember(null);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: 'child',
      inviteMethod: 'email'
    });
    toast({
      title: "Member Updated",
      description: "Family member information has been updated."
    });
  };
  const handleDeleteMember = (memberId: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Family member has been removed from your family."
    });
  };
  const handleResendInvite = (member: FamilyMember) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation resent to ${member.name} via email.`
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent':
        return '👨‍👩‍👧‍👦';
      case 'child':
        return '🧒';
      case 'guardian':
        return '👨‍⚕️';
      default:
        return '👤';
    }
  };
  return <div className="pb-20"> {/* Bottom padding for navigation */}
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-10 w-10">
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
        <div className="sticky top-[73px] z-30 bg-background py-2 -mx-4 px-4 mb-2">
          <Button onClick={() => setShowAddForm(!showAddForm)} disabled={familyMembers.length >= 8} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Add/Edit Member Form */}
        {(showAddForm || editingMember) && <Card>
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
                  <Input id="member-name" value={newMember.name} onChange={e => setNewMember({
                ...newMember,
                name: e.target.value
              })} placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="member-role">Role</Label>
                  <Select value={newMember.role} onValueChange={(value: 'parent' | 'child' | 'guardian') => setNewMember({
                ...newMember,
                role: value
              })}>
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
                
                
              </div>

              {!editingMember}

              <div className="flex gap-3 pt-2">
                <Button onClick={editingMember ? handleUpdateMember : handleAddMember} className="flex items-center gap-2">
                  {editingMember ? <>
                      <Edit2 className="h-4 w-4" />
                      Update Member
                    </> : <>
                      <Mail className="h-4 w-4" />
                      Send Invitation
                    </>}
                </Button>
                <Button variant="outline" onClick={() => {
              setShowAddForm(false);
              setEditingMember(null);
              setNewMember({
                name: '',
                email: '',
                phone: '',
                role: 'child',
                inviteMethod: 'email'
              });
            }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>}

        <Separator />

        {/* Family Members List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Family Members</h3>
          <div className="space-y-2">
            {familyMembers.map(member => <Card key={member.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-2.5">
                  <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize flex-shrink-0">
                            {member.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(member.status)}`} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {member.status === 'pending' && <Button size="icon" variant="ghost" onClick={() => handleResendInvite(member)} className="h-8 w-8" title="Resend Invitation">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>}
                      <Button size="icon" variant="ghost" onClick={() => handleEditMember(member)} className="h-8 w-8" title="Edit Member">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="More Options">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Joined</span>
                              <span className="text-sm">{new Date(member.joinedDate).toLocaleDateString()}</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive" onClick={() => handleDeleteMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Family;