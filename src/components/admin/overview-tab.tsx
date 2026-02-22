
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  CreditCard, 
  Zap, 
  Activity, 
  MousePointerClick,
  UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function OverviewTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Global Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '0', sub: 'Awaiting first signups', icon: Users, color: 'text-white' },
          { label: 'MRR', value: '$0', sub: 'No active subs', icon: CreditCard, color: 'text-white' },
          { label: 'Jobs Total', value: '0', sub: 'Engine idle', icon: Zap, color: 'text-white' },
          { label: 'System Health', value: 'OPTIMAL', sub: 'All nodes green', icon: Activity, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5 hover:border-white/20 transition-all group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
              <p className="text-[9px] font-bold text-muted-foreground/40 mt-2 uppercase">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 flex flex-col items-center justify-center p-20 text-center">
          <Activity className="w-12 h-12 text-muted-foreground/10 mb-4" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">No Acquisition Data</h3>
          <p className="text-[10px] font-bold text-muted-foreground/20 uppercase mt-1">Growth charts will populate as users enter the junction.</p>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter">Engagement Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Visitors', value: '0', percent: 0, icon: MousePointerClick },
              { label: 'Signups', value: '0', percent: 0, icon: UserPlus },
              { label: 'First Job', value: '0', percent: 0, icon: Zap },
            ].map((step, i) => (
              <div key={step.label} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2">
                    <step.icon className="w-3 h-3 text-muted-foreground" />
                    <span>{step.label}</span>
                  </div>
                  <span>{step.value}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
