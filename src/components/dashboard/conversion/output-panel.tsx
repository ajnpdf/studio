
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Save, RefreshCw, Share2, CheckCircle2, Wand2, ArrowRight } from 'lucide-react';
import { ConversionState, ConversionSettings } from './conversion-engine';
import { cn } from '@/lib/utils';

interface Props {
  state: ConversionState;
  progress: number;
  file: any;
  settings: ConversionSettings;
  onReset: () => void;
}

export function OutputPanel({ state, progress, file, settings, onReset }: Props) {
  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/5 flex flex-col h-full min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Output Result</h3>
          {state === 'complete' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[9px]">READY</Badge>}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 min-h-0">
          {state === 'idle' && (
            <div className="space-y-6 opacity-40 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto">
                <FileIcon className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg">Waiting for input</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Configure your settings and click convert to see the magic.</p>
              </div>
            </div>
          )}

          {state === 'processing' && (
            <div className="w-full max-w-[280px] space-y-8 animate-in fade-in duration-300">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border-2 border-primary/20 flex items-center justify-center mx-auto relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/20 animate-pulse" style={{ height: `${progress}%`, bottom: 0, top: 'auto' }} />
                   <Wand2 className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="text-left space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Converting...</p>
                    <p className="text-sm font-bold">{progress}% Complete</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold">~{Math.ceil((100 - progress) / 12)}s left</p>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed animate-pulse">
                Applying advanced {settings.toFormat} optimization and re-encoding vectors...
              </p>
            </div>
          )}

          {state === 'complete' && (
            <div className="w-full space-y-8 animate-in zoom-in-95 fade-in duration-500">
              <div className="relative group">
                <div className="w-32 h-32 bg-emerald-500/10 rounded-[3rem] border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                   <Badge className="bg-emerald-500 text-white border-none font-bold text-[10px] px-3 h-6 shadow-xl">SUCCESS</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-xl tracking-tighter truncate px-4">{settings.filename}.{settings.toFormat.toLowerCase()}</h4>
                <div className="flex items-center justify-center gap-2">
                   <span className="text-xs font-bold text-muted-foreground">Output: 1.1 MB</span>
                   <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">73% SMALLER</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 px-4">
                <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Download className="w-4 h-4" /> Download Result
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold gap-2">
                    <Save className="w-4 h-4" /> Save to Cloud
                  </Button>
                  <Button variant="outline" className="h-11 border-white/10 bg-white/5 font-bold gap-2" onClick={onReset}>
                    <RefreshCw className="w-4 h-4" /> Try Another
                  </Button>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 px-4">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Share this conversion</p>
                   <Share2 className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="flex gap-2">
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-lg h-10 flex items-center px-4 text-[10px] font-mono text-muted-foreground truncate">
                      https://sufw.io/share/7a82b9c1
                   </div>
                   <Button size="icon" variant="outline" className="h-10 w-10 border-white/10 bg-white/5">
                      <ArrowRight className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
