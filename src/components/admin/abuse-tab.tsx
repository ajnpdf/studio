
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { 
  ShieldAlert, 
  Bug, 
  Globe,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AbuseTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-2xl font-black text-muted-foreground/40">0</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Threats</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <Bug className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-2xl font-black text-muted-foreground/40">0</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Blocked Files</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-2xl font-black text-muted-foreground/40">0</p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Blacklisted IPs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-sm font-black uppercase tracking-tighter">Security Incident Queue</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Filter threats..." className="h-8 pl-8 w-48 bg-white/5 border-white/10 text-[10px] font-bold" />
          </div>
        </div>

        <div className="py-32 text-center bg-white/5 border border-white/5 rounded-[2rem]">
          <ShieldAlert className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No incidents detected in the current cycle.</p>
        </div>
      </div>
    </div>
  );
}
