
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users,
  CreditCard,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RevenueTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Annual Run Rate', value: '$0', icon: TrendingUp, color: 'text-white' },
          { label: 'Avg Revenue / User', value: '$0', icon: Users, color: 'text-white' },
          { label: 'Monthly Churn', value: '0%', icon: Activity, color: 'text-white' },
          { label: 'Net Retention', value: '0%', icon: CreditCard, color: 'text-white' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5">
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">{stat.label}</p>
              <h4 className="text-2xl font-black tracking-tighter">{stat.value}</h4>
              <p className="text-[9px] font-black uppercase text-muted-foreground/40 mt-2">Awaiting commerce data</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 flex items-center justify-center p-32 text-center">
          <div className="space-y-4">
            <CreditCard className="w-12 h-12 text-muted-foreground/10 mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">No Financial Records</h3>
            <p className="text-[10px] text-muted-foreground/20 font-bold uppercase mt-1">Transaction streams will appear here once commerce is active.</p>
          </div>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-8 text-center space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Failed Recoveries</h3>
            <div className="py-10 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-[9px] font-black text-muted-foreground uppercase">Logs Clear</p>
            </div>
            <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-muted-foreground">View Billing Ledger</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
