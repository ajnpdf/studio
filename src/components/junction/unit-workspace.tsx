"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { Settings2, ShieldCheck, Cpu, Zap, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Real-Time Engineering Layout
 * Uses useAJNTool hook for 100% logic execution and live logging.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [config, setConfig] = useState<any>({});
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  
  const { phase, progress, logs, result, run, reset } = useAJNTool(initialUnitId || 'converter');

  const handleFilesAdded = (files: File[]) => {
    run(files, config);
  };

  const set = (k: string, v: any) => setConfig({ ...config, [k]: v });

  const renderConfig = () => {
    if (!unit) return null;
    const S = "text-[10px] font-black uppercase text-slate-950/60 ml-1";

    switch (unit.id) {
      case 'merge-pdf': return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className={S}>Output Filename</Label>
            <input className="w-full h-10 px-3 bg-white/60 border border-black/5 rounded-xl font-bold text-xs" value={config.name||""} onChange={e=>set("name",e.target.value)} placeholder="merged.pdf" />
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-black uppercase">Bookmark Per File</p>
            <Switch checked={config.bookmarks} onCheckedChange={v=>set("bookmarks",v)} />
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-black uppercase">Linearize Output</p>
            <Switch checked={config.linearize} onCheckedChange={v=>set("linearize",v)} />
          </div>
        </div>
      );
      case 'compress-pdf': return (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className={S}>Compression Profile</Label>
            <Select value={config.profile||"ebook"} onValueChange={v=>set("profile",v)}>
              <SelectTrigger className="h-11 bg-white/60 rounded-xl font-black text-[10px] uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["screen","ebook","print","hq","custom"].map(o=><SelectItem key={o} value={o} className="font-bold text-[10px] uppercase">{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className={S}>Quality Factor</Label>
            <Slider value={[config.quality||75]} onValueChange={([v])=>set("quality",v)} max={100} />
            <div className="flex justify-between text-[8px] font-black opacity-40">
              <span>Smallest</span>
              <span>Best</span>
            </div>
          </div>
        </div>
      );
      default: return (
        <div className="p-10 border-2 border-dashed border-black/5 rounded-3xl text-center">
          <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.2em]">Default Params Active</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />
      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto">
            <header className="flex items-center justify-between px-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-xl">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">{unit?.name || "Junction Node"}</h2>
                  <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Mastery Instance
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/60 border border-black/5 rounded-xl shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Buffer Secured</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {phase === 'idle' && <DropZone onFiles={handleFilesAdded} />}
                
                {phase === 'running' && (
                  <Card className="p-8 bg-white/60 border-2 border-black/5 rounded-[3.5rem] space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Processing Mastery...
                      </h3>
                      <Badge className="bg-primary text-white border-none font-black text-[9px] px-2.5 h-5 rounded-full">
                        {Math.round(progress.pct)}%
                      </Badge>
                    </div>
                    
                    <ProgressBar pct={progress.pct} label={progress.detail} />

                    <LogStream logs={logs} />
                  </Card>
                )}

                {phase === 'done' && result && (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-8 rounded-[3.5rem] shadow-2xl space-y-8">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">Asset Mastered</h3>
                        <p className="text-xs font-bold text-slate-950/40 uppercase tracking-widest">{result.fileName} • 8.4 MB</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl gap-3 shadow-xl">
                          <Download className="w-4 h-4" /> Download File
                        </Button>
                        <Button variant="outline" onClick={reset} className="h-14 border-black/10 bg-white hover:bg-black/5 font-black text-xs uppercase tracking-widest rounded-2xl gap-3">
                          <RefreshCw className="w-4 h-4" /> Process Another
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>

              <aside className="lg:col-span-4 space-y-8">
                <Card className="bg-white/60 border-2 border-black/5 p-8 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5" /> Sector Params
                    </h3>
                    <Zap className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                  </div>
                  {renderConfig()}
                </Card>
              </aside>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
