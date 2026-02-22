
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Users, HardDrive, Zap, Files, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active Members', value: '12', sub: '2 pending invites', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Shared Storage', value: '124 GB', sub: 'of 1 TB pooled', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Credits Used', value: '4,820', sub: 'of 10,000 this month', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Team Files', value: '1,248', sub: 'across 42 projects', icon: Files, color: 'text-orange-400', bg: 'bg-orange-400/10' },
];

export function TeamOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
                <p className="text-[10px] font-bold text-muted-foreground/40">{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase">+14% THIS WEEK</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
