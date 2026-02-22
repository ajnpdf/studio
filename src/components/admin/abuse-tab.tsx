
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  UserX, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Bug, 
  Globe,
  MoreVertical,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const flaggedAccounts = [
  { id: 'f1', user: 'bot_99@proxy.ru', reason: 'High API Vol (>1000/m)', risk: 'CRITICAL', time: '14 mins ago', type: 'API_SPIKE' },
  { id: 'f2', user: 'hacker_one@protonmail.com', reason: 'Virus Upload Detected', risk: 'HIGH', time: '1 hour ago', type: 'VIRUS' },
  { id: 'f3', user: 'j.smith@company.com', reason: 'Multiple IP Auth Failure', risk: 'MEDIUM', time: '3 hours ago', type: 'AUTH_BRUTE' },
  { id: 'f4', user: 'anonymous_user_7a', reason: 'Large Batch (>500 files)', risk: 'LOW', time: 'Yesterday', type: 'RESOURCE_ABUSE' },
];

export function AbuseTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-red-500">14</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Threats</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <Bug className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-orange-500">82</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Malicious Files Blocked</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-primary">482</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Blacklisted IPs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-sm font-black uppercase tracking-tighter">Security Incident Queue</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search threats..." className="h-8 pl-8 w-48 bg-white/5 border-white/10 text-[10px] font-bold" />
            </div>
            <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest border-white/10">Manage Blacklist</Button>
          </div>
        </div>

        <div className="bg-card/40 border border-white/5 rounded-[2rem] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <tr>
                <th className="px-6 py-4">Account / ID</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Detected</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {flaggedAccounts.map((inc) => (
                <tr key={inc.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{inc.user}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-black">{inc.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black">{inc.type}</Badge>
                      <p className="text-[10px] font-medium opacity-80">{inc.reason}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 h-5 border-none",
                      inc.risk === 'CRITICAL' ? "bg-red-600 text-white" :
                      inc.risk === 'HIGH' ? "bg-red-500/20 text-red-500" :
                      inc.risk === 'MEDIUM' ? "bg-orange-500/20 text-orange-500" : "bg-muted text-muted-foreground"
                    )}>
                      {inc.risk}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-bold">{inc.time}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 px-3 text-[10px] font-black text-muted-foreground hover:text-white uppercase">Dismiss</Button>
                      <Button size="sm" className="h-8 px-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">Suspend</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
