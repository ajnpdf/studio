
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Clock, 
  AlertCircle, 
  Database, 
  HardDrive, 
  RefreshCw, 
  FileWarning, 
  UserX,
  Play,
  Pause
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function CleanupTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight uppercase">Automated Retention</h2>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-500 border-none font-black text-[10px] uppercase">Service Running</Badge>
        </div>
        <Card className="bg-card/40 backdrop-blur-xl border-white/5">
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Scheduled for Deletion (24h)</p>
                <p className="text-3xl font-black tracking-tighter">14,282 Files</p>
                <p className="text-xs font-bold text-red-400">~2.4 TB will be reclaimed</p>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tighter">Auto-Cleanup</p>
                  <p className="text-[10px] text-muted-foreground">Free tier files deleted after 24 hours.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">NEXT RUN: 04:00 AM UTC (In 6 hours)</span>
                <Button className="bg-primary hover:bg-primary/90 font-black text-xs h-10 px-6 gap-2 shadow-xl shadow-primary/20">
                  <Play className="w-4 h-4 fill-current" /> RUN CLEANUP NOW
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-black tracking-tight uppercase">Storage Anomalies</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/40 border-white/5">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-orange-400">
                <FileWarning className="w-5 h-5" />
                <h4 className="font-black text-sm uppercase tracking-widest">Orphaned Blobs</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                842 files in storage with no associated record in the User database. These are likely failed uploads or partial deletions.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">12.4 GB</span>
                <Button variant="outline" className="h-9 border-red-500/20 text-red-500 font-black text-[10px] uppercase">Purge All</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-white/5">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <UserX className="w-5 h-5" />
                <h4 className="font-black text-sm uppercase tracking-widest">Inactive Accounts</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                48 accounts with >5 GB storage inactive for 90+ days. Targeted for archival or manual notification.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">48 Users</span>
                <Button variant="outline" className="h-9 border-white/10 bg-white/5 font-black text-[10px] uppercase">Audit list</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-primary" />
            <div>
              <h4 className="font-bold text-sm">Optimization Suggestion</h4>
              <p className="text-xs text-muted-foreground">System recommends migrating cold storage to Archive tier for files >30 days old.</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary font-black text-xs uppercase hover:bg-primary/10">Configure Tiering</Button>
        </CardContent>
      </Card>
    </div>
  );
}
