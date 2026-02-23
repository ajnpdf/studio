
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { UnitInfoCarousel } from './unit-info-carousel';
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
  ExternalLink
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
 * AJN Unit Workspace - Bento Expand Panel Logic
 * Features Spring animations and sophisticated bento layout.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1-5');
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'range'>('range');
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

  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'translate-pdf', 'compress-pdf',
    'unlock-pdf', 'redact-pdf', 'page-numbers', 'crop-pdf', 
    'summarize-pdf', 'digital-seal'
  ].includes(initialUnitId || '');

  const unitDisplayName = initialUnitId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="p-4 md:p-10 space-y-8 max-w-5xl mx-auto pb-32"
          >
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">{unitDisplayName}</h2>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Active System Instance</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure Master Node</span>
              </div>
            </div>

            {/* Bento Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Interaction Column */}
              <div className="lg:col-span-2 space-y-6">
                <UnitInfoCarousel unitName={unitDisplayName} />
                
                {initialUnitId === 'merge-pdf' && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950/60">Sequence Assembly</h3>
                      <Badge className="bg-primary text-white border-none text-[9px] h-5">{prepQueue.length} Assets</Badge>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {prepQueue.length > 0 ? (
                        <div className="space-y-2">
                          {prepQueue.map((file, i) => (
                            <motion.div 
                              key={i}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                            >
                              <Card className="bg-white/40 backdrop-blur-xl border-black/5 group hover:border-primary/20 transition-all shadow-sm">
                                <CardContent className="p-3 flex items-center gap-4">
                                  <div className="flex flex-col gap-1 text-slate-950/20 group-hover:text-primary transition-colors cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-black truncate text-slate-950 uppercase">{file.name}</p>
                                    <p className="text-[8px] font-bold text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => reorderPrep(i, 'up')} disabled={i === 0}><RotateCw className="w-3 h-3 rotate-[-90deg]" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => reorderPrep(i, 'down')} disabled={i === prepQueue.length - 1}><RotateCw className="w-3 h-3 rotate(90deg)" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 text-red-400" onClick={() => removePrepItem(i)}><X className="w-3.5 h-3.5" /></Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                          
                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={handleMergeStart} 
                              disabled={prepQueue.length < 2}
                              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest gap-2 rounded-xl shadow-xl"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Execute Merge
                            </Button>
                            <Button variant="outline" onClick={() => inputRef.current?.click()} className="h-12 px-6 border-black/5 bg-white/40 text-[10px] font-black uppercase rounded-xl">
                              Add Files
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-black/5 rounded-[2rem] space-y-3 opacity-40">
                          <Plus className="w-8 h-8 mx-auto" />
                          <p className="text-[9px] font-black uppercase tracking-widest">Queue assets to enable merge logic</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </section>
                )}

                <DropZone onFiles={handleFilesAdded} />
              </div>

              {/* Sidebar Settings Column */}
              <div className="space-y-6">
                <section className="bg-white/40 border border-white/60 p-6 rounded-[2.5rem] shadow-xl backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings2 className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">System Parameters</span>
                  </div>
                  
                  <div className="space-y-5">
                    {initialUnitId === 'translate-pdf' && (
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest">Target Language</Label>
                        <Select value={targetLang} onValueChange={setTargetLang}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-10 rounded-xl font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['Spanish', 'French', 'German', 'Chinese', 'Japanese'].map(l => (
                              <SelectItem key={l} value={l.toLowerCase().substring(0,2)} className="font-bold text-xs">{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {initialUnitId === 'summarize-pdf' && (
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest">Mastery Level</Label>
                        <Select value={summaryLength} onValueChange={setSummaryLength}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-10 rounded-xl font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short" className="font-bold text-xs">Essential (Bullets)</SelectItem>
                            <SelectItem value="medium" className="font-bold text-xs">Standard Brief</SelectItem>
                            <SelectItem value="long" className="font-bold text-xs">Deep Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {initialUnitId === 'protect-pdf' && (
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest">Security Pin</Label>
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="bg-white/60 border-black/5 h-10 rounded-xl font-bold"
                        />
                      </div>
                    )}

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black uppercase text-primary">System Notice</span>
                      </div>
                      <p className="text-[8px] leading-relaxed font-bold text-slate-950/60 uppercase">
                        All operations are executed in a secure browser sandbox. No data is cached on AJN servers.
                      </p>
                    </div>
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
        </div>
      </main>
    </div>
  );
}
