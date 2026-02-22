
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users,
  Search,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mrrData = [
  { month: 'Sep', revenue: 42000 }, { month: 'Oct', revenue: 48000 }, { month: 'Nov', revenue: 54000 },
  { month: 'Dec', revenue: 62000 }, { month: 'Jan', revenue: 71000 }, { month: 'Feb', revenue: 84210 },
];

export function RevenueTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Annual Run Rate', value: '$1.01M', trend: '+14%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Avg Revenue / User', value: '$1.96', trend: '+2.4%', icon: Users, color: 'text-blue-400' },
          { label: 'Monthly Churn', value: '1.24%', trend: '-0.05%', icon: ArrowDownRight, color: 'text-red-400' },
          { label: 'Net Retention', value: '104%', trend: '+4%', icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5">
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">{stat.label}</p>
              <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={cn("text-[9px] font-black uppercase", stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
                  {stat.trend} VS LAST MONTH
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter">MRR Growth (6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: 'rgba(10, 14, 31, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter">Recent Failed Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { user: 'alex.r@gmail.com', amount: '$12.00', time: '2h ago', status: 'Retrying' },
              { user: 'mike.t@startup.io', amount: '$49.00', time: '5h ago', status: 'Manual Action' },
              { user: 'jane.d@freelance.net', amount: '$12.00', time: 'Yesterday', status: 'Failed' },
            ].map((p, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold truncate max-w-[120px]">{p.user}</p>
                  <p className="text-[9px] font-black text-red-400">{p.amount} • {p.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground font-bold">{p.time}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-white"><AlertCircle className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-muted-foreground hover:text-primary">View Billing Logs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
