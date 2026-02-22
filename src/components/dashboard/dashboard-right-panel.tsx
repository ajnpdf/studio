
"use client";

import { Wand2, Zap, Clock, Sparkles, ArrowRight, FileText, CheckCircle2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentTools = [
  { name: 'PDF Compressor', icon: FileText, color: 'text-red-400' },
  { name: 'Image Resizer', icon: Wand2, color: 'text-blue-400' },
  { name: 'MP4 to MP3', icon: Zap, color: 'text-purple-400' },
  { name: 'BG Remover', icon: Sparkles, color: 'text-emerald-400' },
  { name: 'Batch Zip', icon: LayoutGrid, color: 'text-orange-400' },
];

const activityLog = [
  { action: 'PDF compressed', time: '2 minutes ago', status: 'completed' },
  { action: 'Converted Image.png', time: '1 hour ago', status: 'completed' },
  { action: 'Uploaded Video.mp4', time: 'Yesterday', status: 'completed' },
  { action: 'New Team Member', time: '2 days ago', status: 'info' },
];

export function DashboardRightPanel() {
  return (
    <aside className="w-[280px] h-full flex flex-col p-6 space-y-10 border-l border-white/5 bg-background/20 backdrop-blur-xl shrink-0 overflow-y-auto scrollbar-hide">
      {/* Recent Tools */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Recent Tools</h3>
          <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
        <div className="space-y-1.5">
          {recentTools.map((tool, i) => (
            <Button 
              key={i} 
              variant="ghost" 
              className="w-full justify-start gap-3 h-10 bg-white/5 hover:bg-white/10 border-none transition-all group px-3"
            >
              <div className={tool.color}>
                <tool.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">{tool.name}</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </div>
      </section>

      {/* Suggested Tools (AI) */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">AI Suggestions</h3>
          </div>
        </div>
        <Card className="bg-primary/5 border-primary/20 shadow-none overflow-hidden group">
          <CardContent className="p-4 space-y-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Based on your recent <strong>Images</strong>, we suggest:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-primary/10">
                <div className="p-1.5 bg-primary/20 rounded-md">
                  <Wand2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold truncate">Batch BG Remover</p>
                  <p className="text-[9px] text-muted-foreground">Saves ~15 mins / week</p>
                </div>
              </div>
            </div>
            <Button size="sm" className="w-full bg-primary/20 hover:bg-primary/30 text-primary border-none text-[10px] font-bold h-8">
              Launch Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Live Activity Feed */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Live Activity</h3>
          <Badge variant="outline" className="h-4 text-[8px] border-emerald-500/20 text-emerald-500 animate-pulse">LIVE</Badge>
        </div>
        <div className="space-y-6">
          {activityLog.map((log, i) => (
            <div key={i} className="flex gap-3 items-start relative">
              {i !== activityLog.length - 1 && <div className="absolute left-1.5 top-5 bottom-[-1.5rem] w-[1px] bg-white/5" />}
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1 shrink-0 z-10">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-foreground leading-none mb-1">{log.action}</p>
                <p className="text-[10px] text-muted-foreground">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade Prompt */}
      <section className="pt-6">
        <Card className="bg-brand-gradient border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] p-2 opacity-10 rotate-12 pointer-events-none">
            <Zap className="w-24 h-24 text-white" />
          </div>
          <CardContent className="p-5 relative z-10 text-white">
            <h4 className="font-black text-sm mb-2">Unlock Unlimited Power</h4>
            <p className="text-[10px] text-white/80 mb-4 leading-relaxed font-medium">
              8 of 10 daily tasks used. Go Pro for unlimited AI conversions.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-black h-9 border-none shadow-lg text-[10px]">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </aside>
  );
}
