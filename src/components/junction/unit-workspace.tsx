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
  ChevronRight,
  Eye,
  ListChecks,
  Eraser,
  Layers,
  ArrowLeft,
  FileText,
  Loader2
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

/**
 * AJN Universal Unit Workspace
 * High-fidelity responsive visionary hub for real-time file engineering.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<{ id: string, url: string, fileIdx: number, pageIdx: number }[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);

  // Surgical tools require manual selection (pruning model)
  const isSurgicalTool = ['delete-pages', 'extract-pages', 'split-pdf', 'organize-pdf', 'redact-pdf'].includes(unit?.id || '');

  const handleFilesAdded = async (files: File[]) => {
    setSourceFiles(files);
    if (files.some(f => f.type === 'application/pdf')) {
      await loadAllPdfPages(files);
    } else {
      // Non-PDF tools (Word-PDF, JPG-PDF) directly execute with current buffer
      run(files, { quality: 90 });
    }
  };

  const loadAllPdfPages = async (files: File[]) => {
    setIsInitializing(true);
    setPhase('selecting');
    const allLoadedPages: any[] = [];
    const initialSelected = new Set<string>();

    try {
      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        const file = files[fIdx];
        if (file.type !== 'application/pdf') continue;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        
        for (let pIdx = 1; pIdx <= pdf.numPages; pIdx++) {
          const page = await pdf.getPage(pIdx);
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          
          const pageId = `${fIdx}-${pIdx}`;
          allLoadedPages.push({ 
            id: pageId, 
            url: canvas.toDataURL('image/jpeg', 0.7),
            fileIdx: fIdx,
            pageIdx: pIdx - 1
          });

          // Transformation tools select all by default for review
          if (!isSurgicalTool) initialSelected.add(pageId);
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      console.error(err);
      toast({ title: "Binary Load Error", description: "Document integrity check failed.", variant: "destructive" });
      reset();
    } finally {
      setIsInitializing(false);
    }
  };

  const selectAllPages = () => setSelectedPages(new Set(pages.map(p => p.id)));
  const deselectAllPages = () => setSelectedPages(new Set());
  const togglePageSelection = (pageId: string) => {
    const next = new Set(selectedPages);
    if (next.has(pageId)) next.delete(pageId);
    else next.add(pageId);
    setSelectedPages(next);
  };

  const handleConfirmedExecution = () => {
    const indices = Array.from(selectedPages).map(id => {
      const parts = id.split('-');
      return parseInt(parts[1]) - 1; 
    });
    
    if (indices.length === 0 && isSurgicalTool) {
      toast({ title: "Selection Required", description: "Select segments for mastery execution." });
      return;
    }
    
    run(sourceFiles, { pageIndices: indices });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = result.fileName; a.click();
    toast({ title: "Asset Exported", description: "File saved to local storage." });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-12 space-y-10 max-w-7xl mx-auto pb-32">
            
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Cpu className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none truncate max-w-[240px] md:max-w-none">{unit?.name || "Registry Node"}</h2>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black h-5 uppercase tracking-widest">{unit?.mode || 'WASM'}</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity className="w-2.5 h-2.5 text-emerald-600" /> Neural Pipeline Active
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/40 border border-black/5 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">In-Session Encryption</span>
              </div>
            </header>

            <div className="space-y-10">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DropZone onFiles={handleFilesAdded} />
                  </motion.div>
                )}

                {phase === 'selecting' && (
                  <motion.div key="selecting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {isInitializing ? (
                      <div className="py-20 text-center space-y-4 opacity-40">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Rendering High-Fidelity Previews...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 bg-white/40 p-6 rounded-3xl border border-black/5 shadow-2xl backdrop-blur-3xl">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-primary">
                              <Eye className="w-5 h-5" />
                              <h3 className="text-lg font-black uppercase tracking-tighter">Visionary Inspection</h3>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={selectAllPages} className="h-8 text-[9px] font-black uppercase gap-2"><ListChecks className="w-3 h-3" /> All Nodes</Button>
                              <Button variant="outline" size="sm" onClick={deselectAllPages} className="h-8 text-[9px] font-black uppercase gap-2"><Eraser className="w-3 h-3" /> Clear</Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-6 font-black rounded-xl text-xs uppercase tracking-widest">
                              {selectedPages.size} Segments Active
                            </Badge>
                            <Button onClick={handleConfirmedExecution} className="h-12 px-10 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 transition-all">
                              Execute Mastery <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                          {pages.map((page) => {
                            const isSelected = selectedPages.has(page.id);
                            return (
                              <div 
                                key={page.id} 
                                onClick={() => togglePageSelection(page.id)} 
                                className={cn(
                                  "relative aspect-[1/1.414] rounded-2xl border-4 transition-all cursor-pointer overflow-hidden shadow-lg",
                                  isSelected ? "border-primary bg-primary/10 scale-105 z-10" : isSurgicalTool ? "border-red-500/20 opacity-60" : "border-black/5"
                                )}
                              >
                                <img src={page.url} alt={`Page ${page.pageIdx + 1}`} className={cn("w-full h-full object-cover", isSelected ? "opacity-100" : "opacity-40")} />
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-md uppercase">P{page.pageIdx + 1}</div>
                                {isSelected ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 animate-in zoom-in-50">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xl"><CheckCircle2 className="w-6 h-6" /></div>
                                  </div>
                                ) : isSurgicalTool && (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xl"><Trash2 className="w-5 h-5" /></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
                
                {phase === 'running' && (
                  <motion.div key="running" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full">
                    <Card className="p-12 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-3xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-primary">
                          <Layers className="w-6 h-6 animate-bounce" />
                          <h3 className="text-xl font-black uppercase tracking-tighter">Processing Sequence...</h3>
                        </div>
                        <span className="text-3xl font-black text-primary tracking-tighter">{Math.round(progress.pct)}%</span>
                      </div>
                      <ProgressBar pct={progress.pct} label={progress.detail} />
                      <LogStream logs={logs} />
                    </Card>
                  </motion.div>
                )}

                {phase === 'done' && result && (
                  <motion.div key="done" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-3xl mx-auto w-full">
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-16 rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                        <div className="space-y-2">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2">Mastery Successful</Badge>
                          <h3 className="text-3xl font-black tracking-tighter uppercase truncate max-w-md mx-auto text-slate-950">{result.fileName}</h3>
                          <p className="text-xs font-bold text-slate-950/40 uppercase tracking-[0.3em]">{(result.byteLength / 1024).toFixed(1)} KB Synthesized Asset</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-2xl shadow-emerald-500/20">
                          <Download className="w-5 h-5" /> Download Asset
                        </Button>
                        <Button variant="outline" onClick={reset} className="h-16 px-10 border-black/10 bg-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4">
                          <RefreshCw className="w-5 h-5" /> New Task
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <motion.div key="error" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-2xl mx-auto w-full">
                    <Card className="p-16 bg-red-50 border-2 border-red-100 rounded-[3rem] text-center space-y-8 shadow-2xl">
                      <div className="w-16 h-16 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto"><XCircle className="w-8 h-8 text-red-600" /></div>
                      <h3 className="text-2xl font-black text-red-900 uppercase tracking-tighter">{error || "Pipeline Interrupted."}</h3>
                      <div className="flex flex-col gap-3">
                        <Button onClick={handleConfirmedExecution} variant="outline" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-red-200">
                          Retry Mastery Sequence
                        </Button>
                        <Button onClick={reset} variant="ghost" className="h-10 font-bold uppercase text-[10px] text-red-400">
                          Reset Registry Node
                        </Button>
                      </div>
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
