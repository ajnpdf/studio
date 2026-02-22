
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { 
  Trash2, 
  Clock, 
  Database, 
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function CleanupTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white" />
            <h2 className="text-2xl font-black tracking-tight uppercase">Network Hygiene</h2>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-500 border-none font-black text-[10px] uppercase">Automated</Badge>
        </div>
        <Card className="bg-card/40 backdrop-blur-xl border-white/5">
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Scheduled for Deletion (24h)</p>
                <p className="text-3xl font-black tracking-tighter">0 Files</p>
                <p className="text-xs font-bold text-muted-foreground/40">Session clean successfully maintained.</p>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tighter">Auto-Cleanup</p>
                  <p className="text-[10px] text-muted-foreground">In-session files are wiped after disconnect.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground/40">NEXT RUN: 04:00 AM UTC</span>
                <Button className="bg-white text-black hover:bg-white/90 font-black text-xs h-10 px-6 gap-2 shadow-xl">
                  <Play className="w-4 h-4 fill-current" /> RUN HYGIENE CYCLE
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-black tracking-tight uppercase">Storage Fabric</h2>
        </div>
        <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Storage database is 100% clean. No orphaned objects found.</p>
        </div>
      </section>
    </div>
  );
}
