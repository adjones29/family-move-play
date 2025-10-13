import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, Edit2, Trash2, UserPlus, ArrowLeft, MoreVertical, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useFamily } from "@/hooks/useFamily";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
const Family = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { currentFamily, createFamily } = useFamily();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<'Parent' | 'Child'>('Child');
  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      toast({
        title: "Family name required",
        description: "Please enter a name for your family.",
        variant: "destructive"
      });
      return;
    }

    await createFamily(familyName);
    setFamilyName("");
    setShowCreateFamily(false);
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      toast({
        title: "Member name required",
        description: "Please enter a name for the family member.",
        variant: "destructive"
      });
      return;
    }

    if (!currentFamily) {
      toast({
        title: "No family found",
        description: "Please create a family first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('family_members')
        .insert({
          family_id: currentFamily.id,
          display_name: newMemberName.trim(),
          role: newMemberRole,
          status: 'Active'
        });

      if (error) throw error;

      toast({
        title: "Member Created",
        description: `${newMemberName} has been added to your family.`
      });
      
      setShowAddForm(false);
      setNewMemberName("");
      setNewMemberRole('Child');
    } catch (err: any) {
      toast({
        title: "Error creating member",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "Family member has been removed from your family."
      });
    } catch (err: any) {
      toast({
        title: "Error removing member",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Updated",
        description: "Family member role has been updated."
      });
    } catch (err: any) {
      toast({
        title: "Error updating member",
        description: err.message,
        variant: "destructive"
      });
    }
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
  if (membersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">Loading...</div>
          <div className="text-muted-foreground">Fetching family members</div>
        </div>
      </div>
    );
  }

  return <div className="pb-20">
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
                <p className="text-sm text-muted-foreground">
                  {currentFamily ? currentFamily.name : 'No Family'} ({members.length})
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Create Family or Add Member */}
        {!currentFamily ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Create Your Family
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You're not part of any family yet. Create one to get started!
              </p>
              {!showCreateFamily ? (
                <Button onClick={() => setShowCreateFamily(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Family
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="family-name">Family Name</Label>
                    <Input 
                      id="family-name" 
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder="The Johnsons"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateFamily}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateFamily(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="sticky top-[73px] z-30 bg-background py-2 -mx-4 px-4 mb-2">
            <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
            {currentFamily.invite_code && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Family Invite Code:</p>
                <code className="text-sm font-mono font-bold">{currentFamily.invite_code}</code>
              </div>
            )}
          </div>
        )}

        {/* Add Member Form */}
        {showAddForm && currentFamily && <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Family Member
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Note: New members need to sign up and use your family invite code to join.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="member-name">Full Name *</Label>
                  <Input 
                    id="member-name" 
                    value={newMemberName} 
                    onChange={e => setNewMemberName(e.target.value)} 
                    placeholder="Enter full name" 
                  />
                </div>
                <div>
                  <Label htmlFor="member-role">Role</Label>
                  <Select value={newMemberRole} onValueChange={(value: 'Parent' | 'Child') => setNewMemberRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleAddMember} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Family Member
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setNewMemberName('');
                  setNewMemberRole('Child');
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>}

        <Separator />

        {/* Family Members List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Family Members</h3>
          {members.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No family members yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {members.map(member => <Card key={member.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-2.5">
                  <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {(member.display_name || 'U').split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">
                            {member.display_name || 'Unknown'}
                            {member.user_id === user?.id && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                          </h4>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize flex-shrink-0">
                            {member.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(member.status)}`} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
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
                              <span className="text-sm">
                                {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </DropdownMenuItem>
                          {member.user_id !== user?.id && (
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-destructive focus:text-destructive" 
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default Family;