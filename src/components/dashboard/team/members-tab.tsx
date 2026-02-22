
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MoreVertical, Mail, Shield, UserX, Edit2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { InviteMemberModal } from './invite-member-modal';

const members = [
  { name: 'Sarah Jenkins', email: 's.jenkins@innovate.io', role: 'Owner', lastActive: 'Online', files: 482, img: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'Marcus Thorne', email: 'm.thorne@innovate.io', role: 'Admin', lastActive: '2 mins ago', files: 124, img: 'https://picsum.photos/seed/marcus/100/100' },
  { name: 'Elena Rodriguez', email: 'e.rod@innovate.io', role: 'Editor', lastActive: '1 hour ago', files: 89, img: 'https://picsum.photos/seed/elena/100/100' },
  { name: 'James Wilson', email: 'j.wilson@innovate.io', role: 'Viewer', lastActive: 'Yesterday', files: 12, img: 'https://picsum.photos/seed/james/100/100' },
  { name: 'Linda Chen', email: 'l.chen@innovate.io', role: 'Editor', lastActive: '2 days ago', files: 156, img: 'https://picsum.photos/seed/linda/100/100' },
];

export function MembersTab() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Active Members</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Managing 12 seats in this workspace</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="bg-primary hover:bg-primary/90 font-black text-xs gap-2 px-6 shadow-xl shadow-primary/20">
          <UserPlus className="w-4 h-4" /> INVITE MEMBER
        </Button>
      </div>

      <Card className="bg-card/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member, i) => (
                <tr key={i} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white/10">
                        <AvatarImage src={member.img} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 h-5 border-none",
                      member.role === 'Owner' ? "bg-amber-500/20 text-amber-500" :
                      member.role === 'Admin' ? "bg-primary/20 text-primary" :
                      member.role === 'Editor' ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", member.lastActive === 'Online' ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                      <span className="font-bold text-muted-foreground">{member.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black">{member.files}</span>
                    <span className="text-[9px] text-muted-foreground uppercase ml-1.5 font-bold">files processed</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card/90 backdrop-blur-xl border-white/10">
                        <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase"><Edit2 className="w-3.5 h-3.5" /> Edit Role</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase"><Mail className="w-3.5 h-3.5" /> Message</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase"><Shield className="w-3.5 h-3.5" /> Permissions</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase text-destructive"><UserX className="w-3.5 h-3.5" /> Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <InviteMemberModal open={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}

import { cn } from '@/lib/utils';
