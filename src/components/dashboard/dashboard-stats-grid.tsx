
"use client";

import { FileIcon, Repeat, BrainCircuit, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { label: 'Session Files', value: '0', icon: FileIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Network Load', value: 'OPTIMAL', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Conversions', value: '0', sub: 'this session', icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'AI Credits', value: '10', sub: 'available', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10' },
];

export function DashboardStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between relative h-full">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
                  {stat.sub && <span className="text-[10px] font-bold text-muted-foreground/40">{stat.sub}</span>}
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} relative z-10 shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
