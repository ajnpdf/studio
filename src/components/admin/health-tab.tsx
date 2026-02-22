
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  AlertCircle, 
  RotateCw, 
  Plus, 
  Minus, 
  Trash2,
  ShieldCheck,
  History,
  Terminal
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function HealthTab() {
  const workerGroups = [
    { name: 'PDF Engine', active: 14, idle: 6, failed: 0, queue: 14, color: 'text-red-400' },
    { name: 'Image Engine', active: 22, idle: 18, failed: 1, queue: 3, color: 'text-blue-400' },
    { name: 'Video Renderer', active: 8, idle: 2, failed: 0, queue: 28, color: 'text-purple-400' },
    { name: 'AI Reasoning', active: 12, idle: 4, failed: 0, queue: 5, color: 'text-primary' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Maintenance Controls */}
      <section className="p-6 bg-red-500/10 rounded-[2rem] border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-red-500 uppercase">Emergency Controls</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Global override for system availability</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 border-red-500/40 text-red-500 font-black text-xs gap-2 px-6">
            <Trash2 className="w-4 h-4" /> FLUSH ALL QUEUES
          </Button>
          <Button className="h-12 bg-red-500 hover:bg-red-600 text-white font-black text-xs gap-2 px-8">
            <ShieldCheck className="w-4 h-4" /> ENABLE MAINTENANCE MODE
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Worker Clusters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> Compute Clusters
            </h3>
            <Button variant="ghost" className="h-7 text-[9px] font-black text-primary uppercase">Rolling Restart All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workerGroups.map((group) => (
              <Card key={group.name} className="bg-card/40 border-white/5">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className={cn("font-black text-sm uppercase tracking-tighter", group.color)}>{group.name}</h4>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">Healthy</Badge>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex gap-1.5">
                      {[...Array(group.active)].map((_, i) => <div key={i} className="w-1.5 h-4 bg-emerald-500 rounded-sm" />)}
                      {[...Array(group.idle)].map((_, i) => <div key={i} className="w-1.5 h-4 bg-white/10 rounded-sm" />)}
                      {[...Array(group.failed)].map((_, i) => <div key={i} className="w-1.5 h-4 bg-red-500 rounded-sm animate-pulse" />)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">{group.active + group.idle}</p>
                      <p className="text-[8px] text-muted-foreground font-black uppercase">Nodes Online</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Queue Depth</span>
                      <span className={group.queue > 20 ? 'text-red-400' : ''}>{group.queue} Jobs</span>
                    </div>
                    <Progress value={Math.min(100, group.queue * 4)} className="h-1 bg-white/5" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 h-8 text-[9px] font-black uppercase border-white/10"><Plus className="w-3 h-3 mr-1" /> Scale Up</Button>
                    <Button variant="outline" className="flex-1 h-8 text-[9px] font-black uppercase border-white/10"><Minus className="w-3 h-3 mr-1" /> Scale Down</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Resources */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5" /> Storage Fabric
          </h3>
          <Card className="bg-card/40 border-white/5">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Capacity Used</p>
                    <p className="text-2xl font-black tracking-tighter">842.1 TB</p>
                  </div>
                  <p className="text-xs font-bold text-emerald-500">of 1.2 PB</p>
                </div>
                <Progress value={70} className="h-2 bg-white/5" />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <span>Provisioned / Account</span>
                  <span className="text-white">12 GB Avg</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <span>IOPS Load</span>
                  <span className="text-emerald-500">Stable (14k)</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-11 border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2">
                <Terminal className="w-4 h-4" /> CLUSTER CONSOLE
              </Button>
            </CardContent>
          </Card>

          {/* System Error Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">System Log (Live)</h3>
              <History className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <div className="bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-[9px] space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
              <div className="text-muted-foreground"><span className="text-blue-400">[INFO]</span> 14:22:01 - Node cluster-4 assigned job_id:7a2b</div>
              <div className="text-muted-foreground"><span className="text-emerald-400">[OK]</span> 14:21:58 - Worker pool scaled to 56 nodes</div>
              <div className="text-muted-foreground"><span className="text-red-400">[ERR]</span> 14:21:45 - Video_Worker_09 timeout: codec mismatch</div>
              <div className="text-muted-foreground"><span className="text-yellow-400">[WRN]</span> 14:21:12 - High memory usage on cluster-2</div>
              <div className="text-muted-foreground"><span className="text-blue-400">[INFO]</span> 14:20:55 - New Business signup: sarah.j@io</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
