
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  AlertCircle, 
  ShieldCheck,
  History,
  Terminal
} from 'lucide-react';

export function HealthTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase">Network Core</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Global override for node availability</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="h-12 bg-white text-black hover:bg-white/90 font-black text-xs gap-2 px-8 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> ENABLE MAINTENANCE
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> Compute Clusters
            </h3>
          </div>
          
          <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
            <Cpu className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No active compute nodes assigned to your view.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5" /> Fabric Status
          </h3>
          <Card className="bg-card/40 border-white/5">
            <CardContent className="p-8 text-center space-y-6">
              <Activity className="w-10 h-10 text-emerald-500 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-xl font-black uppercase">Healthy</p>
                <p className="text-[10px] font-black text-muted-foreground tracking-widest">NETWORK FABRIC STABLE</p>
              </div>
              <Button variant="outline" className="w-full h-11 border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2">
                <Terminal className="w-4 h-4" /> CLUSTER CONSOLE
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">System Log</h3>
              <History className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <div className="bg-black/40 rounded-2xl border border-white/5 p-6 font-mono text-[9px] text-center opacity-40">
              Awaiting system events...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
