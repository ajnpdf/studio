"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { 
  Cpu, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  XCircle, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ initialUnitId }: Props) {
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<{ id: number, url: string }[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isInteractive = ['delete-pages', 'extract-pages', 'rotate-pdf', 'organize-pdf'].includes(unit?.id || '');

  const getAcceptedExtensions = () => {
    if (!unit) return ".pdf";
    const id = unit.id;
    if (id.startsWith("pdf-") || id === "merge-pdf" || id === "split-pdf" || id === "rotate-pdf" || 
        id === "compress-pdf" || id === "redact-pdf" || id === "protect-pdf" || id === "sign-pdf" || 
        id === "summarize-pdf" || id === "translate-pdf" || id === "ocr-pdf" || id.includes("pdf")) return ".pdf";
    if (id.endsWith("-pdf")) {
      if (id.includes("jpg")) return ".jpg,.jpeg,.png,.webp";
      if (id.includes("word")) return ".docx,.doc";
      if (id.includes("ppt")) return ".pptx,.ppt";
      if (id.includes("excel")) return ".xlsx,.xls";
    }
    return "*/*";
  };

  const handleFilesAdded = async (files: File[]) => {
    setSourceFiles(files);
    if (isInteractive && files[0]?.type === 'application/pdf') {
      await loadPdfPages(files[0]);
    } else {
      run(files, { quality: 90, targetFormat: unit?.id.split('-').pop()?.toUpperCase() || 'PDF' });
    }
  };

  const loadPdfPages = async (file: File) => {
    setPhase('selecting' as any);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const loadedPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        loadedPages.push({ id: i - 1, url: canvas.toDataURL('image/jpeg', 0.7) });
      }
      setPages(loadedPages);
    } catch (err) {
      toast({ title: "Load Error", description: "Failed to parse PDF pages.", variant: "destructive" });
    }
  };

  const togglePageSelection = (idx: number) => {
    const next = new Set(selectedPages);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedPages(next);
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = result.fileName; a.click();
    toast({ title: "Asset Exported", description: `${result.fileName} saved successfully.` });
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-12 space-y-10 max-w-5xl mx-auto pb-32">
            
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border-2 border-primary/20 shadow-2xl">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">{unit?.name || "Junction Node"}</h2>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black h-5 uppercase tracking-widest">{unit?.mode || 'WASM'}</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" /> Neural Registry Instance • Active Sector
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/40 border border-black/5 rounded-2xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">Master Buffer Secured</span>
              </div>
            </header>

            <div className="space-y-10">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                    <DropZone onFiles={handleFilesAdded} accept={getAcceptedExtensions()} />
                  </motion.div>
                )}

                {phase === ('selecting' as any) && (
                  <motion.div key="selecting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Visual Inspection</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select {unit?.id === 'delete-pages' ? 'pages to remove' : 'pages to extract'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary text-white border-none h-8 px-4 font-black">{selectedPages.size} Selected</Badge>
                        <Button onClick={() => run(sourceFiles, { pageIndices: Array.from(selectedPages) })} className="h-12 px-8 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl gap-2 hover:scale-105 active:scale-95 transition-all">
                          Confirm Mastery <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {pages.map((page) => (
                        <div key={page.id} onClick={() => togglePageSelection(page.id)} className={cn("relative aspect-[1/1.414] rounded-2xl border-4 transition-all cursor-pointer overflow-hidden shadow-lg group", selectedPages.has(page.id) ? "border-red-500 bg-red-50" : "border-black/5 hover:border-primary/40 bg-white")}>
                          <img src={page.url} className={cn("w-full h-full object-cover transition-all duration-500", selectedPages.has(page.id) && "opacity-40 grayscale blur-[2px]")} />
                          <div className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-black px-2 py-1 rounded-lg backdrop-blur-md">PAGE {page.id + 1}</div>
                          {selectedPages.has(page.id) && (
                            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
                              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
                                <Trash2 className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {phase === 'running' && (
                  <motion.div key="running" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-10 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-3xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950 flex items-center gap-3"><RefreshCw className="w-5 h-5 animate-spin text-primary" /> Executing Logic</h3>
                        <span className="text-3xl font-black text-primary tracking-tighter">{Math.round(progress.pct)}%</span>
                      </div>
                      <ProgressBar pct={progress.pct} label={progress.detail} />
                      <LogStream logs={logs} />
                    </Card>
                  </motion.div>
                )}

                {phase === 'done' && result && (
                  <motion.div key="done" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-3xl mx-auto">
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-12 rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                        <div className="space-y-2">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2">Success</Badge>
                          <h3 className="text-3xl font-black tracking-tighter uppercase">{result.fileName}</h3>
                          <p className="text-xs font-bold text-slate-950/40 uppercase tracking-[0.3em]">{(result.byteLength / 1024).toFixed(1)} KB Buffer</p>
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-2xl">
                          <Download className="w-5 h-5" /> Download Asset
                        </Button>
                        <Button variant="outline" onClick={reset} className="h-16 px-10 border-black/10 bg-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4">
                          <RefreshCw className="w-5 h-5" /> Process More
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <motion.div key="error" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Card className="p-12 bg-red-50 border-2 border-red-100 rounded-[4rem] text-center space-y-8 shadow-2xl">
                      <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto"><XCircle className="w-10 h-10 text-red-600" /></div>
                      <h3 className="text-3xl font-black text-red-900 uppercase tracking-tighter">{error || "Synthesis failure"}</h3>
                      <Button onClick={reset} variant="destructive" className="h-14 px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Restart Session</Button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
