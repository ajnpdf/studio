
"use client";

import { FileIcon, HardDrive, Repeat, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'Total Files', value: '124', icon: FileIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Storage Used', value: '2.3 GB', sub: 'of 50 GB', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-400/10', progress: 75 },
  { label: 'Conversions', value: '45', sub: 'this month', icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'AI Tasks', value: '8', sub: 'remaining today', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10' },
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
            {stat.progress !== undefined && (
              <div className="mt-auto space-y-1.5 pt-2">
                <Progress value={stat.progress} className="h-1.5 bg-white/5" />
                <div className="flex justify-between text-[8px] font-bold text-muted-foreground/40 tracking-widest">
                  <span>CAPACITY</span>
                  <span>{stat.progress}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
