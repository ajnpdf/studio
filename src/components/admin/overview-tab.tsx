
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  CreditCard, 
  Zap, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  MousePointerClick,
  UserPlus,
  Repeat
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const signupData = [
  { day: '01', users: 120 }, { day: '02', users: 145 }, { day: '03', users: 132 },
  { day: '04', users: 180 }, { day: '05', users: 210 }, { day: '06', users: 190 },
  { day: '07', users: 245 }, { day: '08', users: 220 }, { day: '09', users: 310 },
  { day: '10', users: 280 }, { day: '11', users: 340 }, { day: '12', users: 390 },
];

export function OverviewTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Global Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '42,804', sub: '12% Business', icon: Users, color: 'text-blue-400', trend: '+8.4%', up: true },
          { label: 'MRR', value: '$84,210', sub: '+$4.2k this mo', icon: CreditCard, color: 'text-emerald-400', trend: '+12.1%', up: true },
          { label: 'Jobs Today', value: '8,412', sub: '99.9% Success', icon: Zap, color: 'text-orange-400', trend: '+4.2%', up: true },
          { label: 'System Health', value: 'OPTIMAL', sub: 'All clusters up', icon: Activity, color: 'text-red-400', trend: 'STABLE', up: true },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5 hover:border-red-500/20 transition-all group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-bold text-muted-foreground/40">{stat.sub}</span>
                <div className={cn("flex items-center text-[9px] font-black", stat.up ? "text-emerald-500" : "text-red-500")}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Signups Trend */}
        <Card className="lg:col-span-2 bg-card/40 border-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tighter">User Acquisition</CardTitle>
                <CardDescription className="text-[10px] font-bold text-muted-foreground/60">New account creations over last 12 days</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">LIVE UPDATES</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 14, 31, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Visitors', value: '142k', percent: 100, icon: MousePointerClick },
              { label: 'Signups', value: '12.4k', percent: 8.7, icon: UserPlus },
              { label: 'First Job', value: '8.2k', percent: 66, icon: Zap },
              { label: 'Upgrades', value: '482', percent: 5.8, icon: ArrowUpRight },
            ].map((step, i) => (
              <div key={step.label} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2">
                    <step.icon className="w-3 h-3 text-muted-foreground" />
                    <span>{step.label}</span>
                  </div>
                  <span>{step.value} <span className="opacity-40 ml-1">({step.percent}%)</span></span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.max(5, step.percent)}%`, opacity: 1 - i * 0.2 }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
