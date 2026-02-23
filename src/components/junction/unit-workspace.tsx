"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { 
  Settings2, 
  ShieldCheck, 
  Cpu, 
  GripVertical,
  X,
  Plus,
  Play,
  RotateCw,
  Lock,
  ChevronRight,
  Download,
  Share2,
  ExternalLink,
  Wand2,
  Database,
  Layers,
  Activity,
  History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - High-Fidelity Bento Grid with Invisible Scroll
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1-5');
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'equal'>('range');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [summaryLength, setSummaryLength] = useState('medium');

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    if (initialUnitId === 'merge-pdf') {
      setPrepQueue(prev => [...prev, ...files]);
      return;
    }
    executeJob(files);
  };

  const executeJob = (files: File[]) => {
    let from = '';
    let to = 'PDF';

    if (initialUnitId?.includes('-pdf')) {
      from = initialUnitId.split('-')[0];
    } else if (initialUnitId?.startsWith('pdf-')) {
      from = 'pdf';
      to = initialUnitId.split('-')[1].toUpperCase();
    } else {
      from = 'pdf';
      to = 'PDF';
    }

    const settings = { 
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      splitMode,
      splitValue: pageRange,
      length: summaryLength,
      toFmt: to
    };

    engine.addJobs(files, from, to, settings, initialUnitId);
  };

  const handleMergeStart = () => {
    if (prepQueue.length < 2) return;
    executeJob(prepQueue);
    setPrepQueue([]);
  };

  const removePrepItem = (idx: number) => {
    setPrepQueue(prev => prev.filter((_, i) => i !== idx));
  };

  const reorderPrep = (idx: number, dir: 'up' | 'down') => {
    const newQueue = [...prepQueue];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newQueue.length) return;
    [newQueue[idx], newQueue[target]] = [newQueue[target], newQueue[idx]];
    setPrepQueue(newQueue);
  };

  if (!appState) return null;

  const unitDisplayName = initialUnitId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={initialUnitId}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40"
            >
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl">
                    <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase leading-none">{unitDisplayName}</h2>
                    <p className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.4em]">Master System Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Environment Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  {initialUnitId === 'merge-pdf' && (
                    <section className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-slate-950/40" />
                          <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950/60">Sequence Assembly</h3>
                        </div>
                        <Badge className="bg-primary text-white border-none text-[10px] font-black px-3 h-6 rounded-full">{prepQueue.length} Assets</Badge>
                      </div>

                      <AnimatePresence mode="popLayout">
                        {prepQueue.length > 0 ? (
                          <div className="space-y-3">
                            {prepQueue.map((file, i) => (
                              <motion.div 
                                key={i}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group"
                              >
                                <Card className="bg-white/50 backdrop-blur-2xl border-black/5 hover:border-primary/30 transition-all shadow-xl rounded-2xl overflow-hidden border-2">
                                  <CardContent className="p-4 flex items-center gap-6">
                                    <div className="flex flex-col gap-1.5 text-slate-950/20 group-hover:text-primary transition-colors cursor-grab px-2">
                                      <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center font-black text-xs border border-black/5">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-black truncate text-slate-950 uppercase tracking-tighter">{file.name}</p>
                                      <p className="text-[9px] font-black text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 rounded-xl" onClick={() => reorderPrep(i, 'up')} disabled={i === 0}><RotateCw className="w-4 h-4 rotate-[-90deg]" /></Button>
                                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 rounded-xl" onClick={() => reorderPrep(i, 'down')} disabled={i === prepQueue.length - 1}><RotateCw className="w-4 h-4 rotate(90deg)" /></Button>
                                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-50 text-red-400 rounded-xl" onClick={() => removePrepItem(i)}><X className="w-4 h-4" /></Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                            
                            <div className="flex gap-4 pt-6">
                              <Button 
                                onClick={handleMergeStart} 
                                disabled={prepQueue.length < 2}
                                className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30"
                              >
                                <Play className="w-4 h-4 fill-current" /> Execute Master Merge
                              </Button>
                              <Button variant="outline" onClick={() => document.getElementById('dropzone-input')?.click()} className="h-14 px-10 border-black/10 bg-white/40 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/60">
                                <Plus className="w-4 h-4 mr-2" /> Add Assets
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-20 text-center border-4 border-dashed border-black/5 rounded-[3rem] space-y-4 opacity-30 group hover:opacity-100 transition-opacity">
                            <Layers className="w-12 h-12 mx-auto" />
                            <div className="space-y-1">
                              <p className="text-[11px] font-black uppercase tracking-[0.4em]">Asset Buffer</p>
                              <p className="text-[9px] font-bold uppercase">Load assets below to initialize sequence</p>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </section>
                  )}

                  <DropZone onFiles={handleFilesAdded} />
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <section className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                      <Settings2 className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      {initialUnitId === 'translate-pdf' && (
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Target Language Profile</Label>
                          <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs uppercase shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-black/10">
                              {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'].map(l => (
                                <SelectItem key={l} value={l.toLowerCase().substring(0,2)} className="font-black text-[10px] uppercase">{l}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {initialUnitId === 'summarize-pdf' && (
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Fidelity Level</Label>
                          <Select value={summaryLength} onValueChange={setSummaryLength}>
                            <SelectTrigger className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs uppercase shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-black/10">
                              <SelectItem value="short" className="font-black text-[10px] uppercase">Essential (Bullets)</SelectItem>
                              <SelectItem value="medium" className="font-black text-[10px] uppercase">Standard Brief</SelectItem>
                              <SelectItem value="long" className="font-black text-[10px] uppercase">Deep Analysis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {initialUnitId === 'protect-pdf' && (
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Security Seal Pin</Label>
                          <div className="relative">
                            <Input 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••" 
                              className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs shadow-sm pl-12"
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40" />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  <ProgressSection jobs={appState.queue} />
                </div>
              </div>

              {appState.outputs.length > 0 && (
                <OutputSection 
                  jobs={appState.outputs} 
                  onPreview={(j) => window.open(j.objectUrl)} 
                  onClear={() => engine.clearQueue()} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
