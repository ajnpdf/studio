"use client";

import { FileIcon, HardDrive, Repeat, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { label: 'Total Files', value: '124', icon: FileIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Storage Used', value: '2.3 GB', sub: 'of 50 GB', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Conversions', value: '45', sub: 'this month', icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'AI Tasks', value: '8', sub: 'remaining today', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10' },
];

export function DashboardStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-card/40 backdrop-blur-md border-primary/5 hover:border-primary/20 transition-all group overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between relative">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-bold tracking-tight">{stat.value}</h4>
                {stat.sub && <span className="text-[10px] font-medium text-muted-foreground/40">{stat.sub}</span>}
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} relative z-10`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
