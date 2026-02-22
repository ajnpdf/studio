"use client";

import { Wand2, Zap, Clock, Sparkles, ArrowRight, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentTools = [
  { name: 'PDF Compressor', icon: FileText, color: 'text-red-400' },
  { name: 'Image Resizer', icon: Wand2, color: 'text-blue-400' },
  { name: 'MP4 to MP3', icon: Zap, color: 'text-purple-400' },
];

const activityLog = [
  { action: 'PDF compressed', time: '2 minutes ago', status: 'completed' },
  { action: 'Converted Image.png', time: '1 hour ago', status: 'completed' },
  { action: 'Uploaded Video.mp4', time: 'Yesterday', status: 'completed' },
];

export function DashboardRightPanel() {
  return (
    <aside className="w-[300px] border-l bg-background/20 backdrop-blur-xl p-6 space-y-8 hidden xl:block">
      {/* Recent Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Recent Tools</h3>
          <Clock className="w-4 h-4 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
          {recentTools.map((tool, i) => (
            <Button 
              key={i} 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12 bg-white/5 hover:bg-white/10 border-none transition-all group"
            >
              <div className={tool.color}>
                <tool.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </div>
      </section>

      {/* Suggested Tools (AI) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">AI Suggestions</h3>
          </div>
        </div>
        <Card className="bg-primary/5 border-primary/20 shadow-none overflow-hidden group">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your recent <strong>Images</strong>, we suggest:
            </p>
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-primary/10">
              <div className="p-1.5 bg-primary/20 rounded-md">
                <Wand2 className="w-4 h-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Batch Background Remover</p>
                <p className="text-[10px] text-muted-foreground">Saves ~15 mins / week</p>
              </div>
            </div>
            <Button size="sm" className="w-full bg-primary/20 hover:bg-primary/30 text-primary border-none text-[10px] h-8">
              Launch Suggestion
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Live Activity Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Live Activity</h3>
          <Badge variant="outline" className="h-4 text-[9px] border-emerald-500/20 text-emerald-500">Live</Badge>
        </div>
        <div className="space-y-4">
          {activityLog.map((log, i) => (
            <div key={i} className="flex gap-3 items-start relative pb-4 last:pb-0">
              {i !== activityLog.length - 1 && <div className="absolute left-1.5 top-5 bottom-0 w-[1px] bg-sidebar-border/30" />}
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-foreground">{log.action}</p>
                <p className="text-[10px] text-muted-foreground">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade Prompt */}
      <section className="pt-4">
        <Card className="bg-brand-gradient border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12">
            <Zap className="w-24 h-24 text-white" />
          </div>
          <CardContent className="p-6 relative z-10 text-white">
            <h4 className="font-bold text-lg mb-2">Go Pro for Unlimited Power</h4>
            <p className="text-xs text-white/80 mb-4 leading-relaxed">
              Remove daily task limits, process files up to 2GB, and unlock Team Collab.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-10 border-none shadow-lg">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </aside>
  );
}
