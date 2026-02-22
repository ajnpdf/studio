
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserX, 
  ShieldCheck, 
  ExternalLink, 
  Key, 
  Trash2,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

const mockUsers = [
  { id: 'u1', name: 'Sarah Jenkins', email: 's.jenkins@innovate.io', tier: 'BUSINESS', joined: 'Jan 12, 2025', lastActive: '2 mins ago', storage: '124 GB', status: 'Active', api: true, img: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 'u2', name: 'Marcus Thorne', email: 'm.thorne@cloudflow.com', tier: 'PRO', joined: 'Jan 5, 2025', lastActive: '1 hour ago', storage: '1.2 GB', status: 'Active', api: true, img: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 'u3', name: 'Alex Rivera', email: 'alex.r@gmail.com', tier: 'FREE', joined: 'Feb 1, 2025', lastActive: 'Yesterday', storage: '45 MB', status: 'Active', api: false, img: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'u4', name: 'Bad Actor', email: 'spam@bot.net', tier: 'FREE', joined: 'Feb 10, 2025', lastActive: '2 days ago', storage: '0 B', status: 'Suspended', api: false, img: 'https://picsum.photos/seed/bad/100/100' },
];

export function UsersTab() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 bg-white/5 border-white/10 font-bold text-xs" 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold text-[10px] gap-2">
            <Filter className="w-3.5 h-3.5" /> FILTERS
          </Button>
          <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold text-[10px] gap-2">
            <ArrowUpDown className="w-3.5 h-3.5" /> SORT
          </Button>
          <Button className="h-11 bg-primary hover:bg-primary/90 font-black text-[10px] px-6 shadow-xl shadow-primary/20 uppercase tracking-widest">
            EXPORT CSV
          </Button>
        </div>
      </div>

      <Card className="bg-card/40 border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Storage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10">
                          <AvatarImage src={user.img} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 h-5 border-none",
                        user.tier === 'BUSINESS' ? "bg-amber-500/20 text-amber-500" :
                        user.tier === 'PRO' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {user.tier}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      <p>{user.joined}</p>
                      <p className="text-[9px] opacity-40">Last: {user.lastActive}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black">{user.storage}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 h-5 border-none",
                        user.status === 'Active' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                      )}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card/90 backdrop-blur-xl border-white/10">
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase"><ExternalLink className="w-3.5 h-3.5" /> View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase"><ShieldCheck className="w-3.5 h-3.5" /> Change Tier</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase text-primary"><Key className="w-3.5 h-3.5" /> Impersonate</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase text-orange-400"><Lock className="w-3.5 h-3.5" /> Force Reset</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase text-red-400">
                            {user.status === 'Active' ? <><UserX className="w-3.5 h-3.5" /> Suspend</> : <><ShieldCheck className="w-3.5 h-3.5" /> Unsuspend</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[10px] font-black uppercase text-red-600"><Trash2 className="w-3.5 h-3.5" /> DELETE ACCOUNT</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from '@/lib/utils';
