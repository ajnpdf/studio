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
  History,
  Scissors,
  Layout,
  Type,
  FileText,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - High-Fidelity Bento Grid
 * Implements the Master Remove Pages, Merge, and Split workflows.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Workspace States
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  const [selectionFile, setSelectionFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);

  // Parameter States
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1-5');
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'equal'>('every');
  const [splitValue, setSplitValue] = useState('1');
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

    if (initialUnitId === 'remove-pages' || initialUnitId === 'extract-pages') {
      const file = files[0];
      setSelectionFile(file);
      generateThumbnails(file);
      return;
    }

    executeJob(files);
  };

  const generateThumbnails = async (file: File) => {
    setIsLoadingThumbs(true);
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const thumbs: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }
      setThumbnails(thumbs);
    } catch (err) {
      console.error("Thumbnail generation failed", err);
    } finally {
      setIsLoadingThumbs(false);
    }
  };

  const togglePageSelection = (idx: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const executeJob = (files: File[]) => {
    let from = '';
    let to = 'PDF';

    if (initialUnitId?.includes('-pdf')) {
      from = initialUnitId.split('-')[0];
    } else if (initialUnitId?.startsWith('pdf-')) {
      from = 'pdf';
      to = initialUnitId.split('-')[1].toUpperCase();
    }

    const settings = { 
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      splitMode,
      splitValue: splitMode === 'range' ? pageRange : splitValue,
      length: summaryLength,
      pages: Array.from(selectedPages),
      toFmt: to
    };

    engine.addJobs(files, from, to, settings, initialUnitId);
  };

  const handleSelectionExecute = () => {
    if (!selectionFile) return;
    executeJob([selectionFile]);
    setSelectionFile(null);
    setThumbnails([]);
    setSelectedPages(new Set());
  };

  const handleMergeStart = () => {
    if (prepQueue.length < 2) return;
    executeJob(prepQueue);
    setPrepQueue([]);
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
              className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40"
            >
              {/* Header Sector */}
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
                  {/* MERGE SEQUENCE UI */}
                  {initialUnitId === 'merge-pdf' && (
                    <section className="space-y-6">
                      {prepQueue.length > 0 && (
                        <div className="space-y-3">
                          {prepQueue.map((file, i) => (
                            <Card key={i} className="bg-white/50 backdrop-blur-2xl border-black/5 hover:border-primary/30 transition-all rounded-2xl overflow-hidden border-2">
                              <CardContent className="p-4 flex items-center gap-6">
                                <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center font-black text-xs border border-black/5">{i + 1}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-black truncate text-slate-950 uppercase">{file.name}</p>
                                  <p className="text-[9px] font-black text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setPrepQueue(prev => prev.filter((_, idx) => idx !== i))}><X className="w-4 h-4" /></Button>
                              </CardContent>
                            </Card>
                          ))}
                          <Button onClick={handleMergeStart} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30">
                            <Play className="w-4 h-4 fill-current" /> Execute Master Merge
                          </Button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* REMOVE / EXTRACT PAGE GRID UI */}
                  {(initialUnitId === 'remove-pages' || initialUnitId === 'extract-pages') && selectionFile && (
                    <section className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary" />
                          <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950/60">
                            {initialUnitId === 'remove-pages' ? 'Purge Selection' : 'Extraction Selection'}
                          </h3>
                        </div>
                        <Badge className="bg-primary text-white border-none text-[10px] font-black px-3 h-6 rounded-full">
                          {initialUnitId === 'remove-pages' 
                            ? `Purging ${selectedPages.size} → ${thumbnails.length - selectedPages.size} Remaining`
                            : `Extracting ${selectedPages.size} Pages`
                          }
                        </Badge>
                      </div>

                      {isLoadingThumbs ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-40">
                          <RotateCw className="w-10 h-10 animate-spin text-primary" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Generating Visual Grid...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide p-2 bg-black/5 rounded-[2rem] border border-black/5">
                          {thumbnails.map((thumb, i) => (
                            <div 
                              key={i} 
                              onClick={() => togglePageSelection(i)}
                              className={cn(
                                "relative aspect-[1/1.4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-lg hover:scale-[1.02]",
                                selectedPages.has(i) 
                                  ? initialUnitId === 'remove-pages' ? "border-red-500 scale-95 opacity-80" : "border-emerald-500 scale-105"
                                  : "border-white/20"
                              )}
                            >
                              <img src={thumb} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black text-white">{i + 1}</div>
                              {selectedPages.has(i) && (
                                <div className={cn(
                                  "absolute inset-0 flex items-center justify-center backdrop-blur-[2px]",
                                  initialUnitId === 'remove-pages' ? "bg-red-500/40" : "bg-emerald-500/40"
                                )}>
                                  {initialUnitId === 'remove-pages' ? <Trash2 className="w-8 h-8 text-white" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button 
                          onClick={handleSelectionExecute} 
                          disabled={selectedPages.size === 0}
                          className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30"
                        >
                          <Play className="w-4 h-4 fill-current" /> 
                          {initialUnitId === 'remove-pages' ? 'Execute Master Purge' : 'Execute Extraction'}
                        </Button>
                        <Button variant="outline" onClick={() => { setSelectionFile(null); setThumbnails([]); setSelectedPages(new Set()); }} className="h-14 px-8 border-black/10 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-500">
                          Discard
                        </Button>
                      </div>
                    </section>
                  )}

                  {!selectionFile && <DropZone onFiles={handleFilesAdded} />}
                </div>

                {/* Parameters Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <section className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                      <Settings2 className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      {initialUnitId === 'split-pdf' && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Split Protocol</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {[{ id: 'every', label: 'Every N', icon: Scissors }, { id: 'range', label: 'Range', icon: Layout }].map(m => (
                                <button key={m.id} onClick={() => setSplitMode(m.id as any)} className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2", splitMode === m.id ? "bg-primary text-white border-primary shadow-lg" : "bg-white/40 border-black/5 text-slate-950/40 hover:bg-white/60")}>
                                  <m.icon className="w-4 h-4" />
                                  <span className="text-[8px] font-black uppercase">{m.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Input value={splitMode === 'range' ? pageRange : splitValue} onChange={(e) => splitMode === 'range' ? setPageRange(e.target.value) : setSplitValue(e.target.value)} className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs shadow-sm" placeholder="Pages..." />
                        </div>
                      )}

                      {initialUnitId === 'protect-pdf' && (
                        <div className="relative">
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs shadow-sm pl-12" />
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40" />
                        </div>
                      )}
                    </div>
                  </section>

                  <ProgressSection jobs={appState.queue} />
                </div>
              </div>

              {appState.outputs.length > 0 && (
                <OutputSection jobs={appState.outputs} onPreview={(j) => window.open(j.objectUrl)} onClear={() => engine.clearQueue()} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
