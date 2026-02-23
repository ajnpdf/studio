"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { Settings2, ShieldCheck, Cpu, Zap, LockKeyhole } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ALL_UNITS } from './services-grid';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [config, setConfig] = useState<any>({});

  const unit = ALL_UNITS.find(u => u.id === initialUnitId);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    engine.addJobs(files, '', 'PDF', config, initialUnitId);
  };

  const set = (k: string, v: any) => setConfig({ ...config, [k]: v });

  const renderConfig = () => {
    if (!unit) return null;
    const S = "text-[10px] font-black uppercase text-slate-950/60 ml-1";

    switch (unit.id) {
      case 'merge-pdf': return (
        <div className="space-y-6">
          <div className="space-y-2"><Label className={S}>Output filename</Label><input className="w-full h-10 px-3 bg-white/60 border border-black/5 rounded-xl font-bold text-xs" value={config.name||""} onChange={e=>set("name",e.target.value)} placeholder="merged.pdf" /></div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10"><p className="text-[10px] font-black uppercase">Bookmark per file</p><Switch checked={config.bookmarks} onCheckedChange={v=>set("bookmarks",v)} /></div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10"><p className="text-[10px] font-black uppercase">Linearize output</p><Switch checked={config.linearize} onCheckedChange={v=>set("linearize",v)} /></div>
        </div>
      );
      case 'compress-pdf': return (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className={S}>Compression profile</Label>
            <Select value={config.profile||"ebook"} onValueChange={v=>set("profile",v)}>
              <SelectTrigger className="h-11 bg-white/60 rounded-xl font-black text-[10px] uppercase"><SelectValue /></SelectTrigger>
              <SelectContent>{["screen","ebook","print","hq","custom"].map(o=><SelectItem key={o} value={o} className="font-bold text-[10px] uppercase">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-3"><Label className={S}>Quality Factor</Label><Slider value={[config.quality||75]} onValueChange={([v])=>set("quality",v)} max={100} /><div className="flex justify-between text-[8px] font-black opacity-40"><span>Smallest</span><span>Best</span></div></div>
        </div>
      );
      case 'protect-pdf': return (
        <div className="space-y-6">
          <div className="space-y-2"><Label className={S}>Master Password</Label><div className="relative"><input type="password" placeholder="Required to view" className="w-full h-12 bg-white/60 border border-black/5 rounded-2xl font-bold pl-10 text-xs focus:ring-2 focus:ring-primary/20 outline-none" value={config.userPwd||""} onChange={e=>set("userPwd",e.target.value)} /><LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-950/40" /></div></div>
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
            <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase">Allow Print</span><Switch checked={config.allowPrint!==false} onCheckedChange={v=>set("allowPrint",v)} /></div>
            <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase">Allow Copy</span><Switch checked={config.allowCopy} onCheckedChange={v=>set("allowCopy",v)} /></div>
          </div>
        </div>
      );
      case 'translate-pdf': return (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className={S}>Target Identity</Label>
            <Select value={config.tgtLang||"es"} onValueChange={v=>set("tgtLang",v)}>
              <SelectTrigger className="h-11 bg-white/60 rounded-xl font-black text-[10px] uppercase"><SelectValue /></SelectTrigger>
              <SelectContent>{["es","fr","de","zh","ja","ko","hi","pt","ru"].map(o=><SelectItem key={o} value={o} className="font-bold text-[10px] uppercase">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10"><p className="text-[10px] font-black uppercase">Bilingual Layout</p><Switch checked={config.bilingual} onCheckedChange={v=>set("bilingual",v)} /></div>
        </div>
      );
      case 'ocr-pdf': return (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className={S}>Script Recognition</Label>
            <Select value={config.lang||"eng"} onValueChange={v=>set("lang",v)}>
              <SelectTrigger className="h-11 bg-white/60 rounded-xl font-black text-[10px] uppercase"><SelectValue /></SelectTrigger>
              <SelectContent>{["eng","spa","fra","deu","zho","jpn","ara","hin"].map(o=><SelectItem key={o} value={o} className="font-bold text-[10px] uppercase">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10"><p className="text-[10px] font-black uppercase">Auto-Deskew</p><Switch checked={config.deskew!==false} onCheckedChange={v=>set("deskew",v)} /></div>
        </div>
      );
      default: return (
        <div className="p-10 border-2 border-dashed border-black/5 rounded-3xl text-center"><p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.2em]">Default Params Active</p></div>
      );
    }
  };

  if (!appState) return null;

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
                  <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Master Registry Instance</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/60 border border-black/5 rounded-xl shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Buffer Secured</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8"><DropZone onFiles={handleFilesAdded} /></div>
              <aside className="lg:col-span-4 space-y-8">
                <Card className="bg-white/60 border-2 border-black/5 p-8 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2"><Settings2 className="w-3.5 h-3.5" /> Engine Config</h3>
                    <Zap className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                  </div>
                  {renderConfig()}
                </Card>
                <ProgressSection jobs={appState.queue} />
              </aside>
            </div>

            {appState.outputs.length > 0 && <OutputSection jobs={appState.outputs} onPreview={(j) => window.open(j.objectUrl)} onClear={() => engine.clearQueue()} />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
