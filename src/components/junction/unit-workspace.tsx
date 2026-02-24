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
  Layers,
  FileIcon,
  Scissors,
  Settings2,
  FileText
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
 * AJN Engineering Workspace - Professional Responsive Core
 * High-fidelity real-time visionary for all surgical and transformation units.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<{ id: string, url: string, fileIdx: number, pageIdx: number }[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isSurgicalTool = ['delete-pages', 'extract-pages', 'split-pdf', 'organize-pdf', 'redact-pdf'].includes(unit?.id || '');

  const getAcceptedExtensions = () => {
    if (!unit) return ".pdf";
    const id = unit.id;
    if (id.includes("pdf") || id === "merge-pdf") return ".pdf";
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
    // Universal Visionary Ingestion for PDF assets
    if (files.some(f => f.type === 'application/pdf')) {
      await loadAllPdfPages(files);
    } else {
      // Direct execution for non-PDF transformations
      run(files, { quality: 90 });
    }
  };

  const loadAllPdfPages = async (files: File[]) => {
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

          // Contextual Selection Logic:
          // Transform units select all by default for review.
          // Surgical units select zero by default for extraction.
          if (!isSurgicalTool) initialSelected.add(pageId);
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      toast({ title: "Load Error", description: "Binary integrity check failed.", variant: "destructive" });
      reset();
    }
  };

  const togglePageSelection = (pageId: string) => {
    const next = new Set(selectedPages);
    if (next.has(pageId)) next.delete(pageId);
    else next.add(pageId);
    setSelectedPages(next);
  };

  const handleConfirmedExecution = () => {
    const indices = Array.from(selectedPages).map(id => parseInt(id.split('-')[1]) - 1);
    if (indices.length === 0 && isSurgicalTool) {
      toast({ title: "No Selection", description: "Select target segments for mastery." });
      return;
    }
    run(sourceFiles, { pageIndices: indices, targetLang: 'es' });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = result.fileName; a.click();
    toast({ title: "Asset Exported", description: "File saved to local storage." });
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-12 space-y-10 max-w-7xl mx-auto pb-32">
            
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center border-2 border-primary/20 shadow-xl">
                  <Cpu className="w-6 h-6 md:w-7 md:h-7 text-primary animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none truncate max-w-[200px] md:max-w-none">{unit?.name || "Registry Node"}</h2>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[7px] md:text-[8px] font-black h-4 md:h-5 uppercase tracking-widest">{unit?.mode || 'WASM'}</Badge>
                  </div>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity className="w-2.5 h-2.5 text-emerald-600" /> Neural Pipeline Active
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/40 border border-black/5 rounded-2xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">Sovereign Buffer</span>
              </div>
            </header>

            <div className="space-y-10">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                    <DropZone onFiles={handleFilesAdded} accept={getAcceptedExtensions()} />
                  </motion.div>
                )}

                {phase === 'selecting' && (
                  <motion.div key="selecting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 bg-white/40 p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-black/5 shadow-2xl backdrop-blur-3xl">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-primary" />
                          <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">Visionary Inspection</h3>
                        </div>
                        <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                          {isSurgicalTool ? 'Visually isolate segments for surgical mastery.' : 'Review document buffer before binary synthesis.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-4 md:px-6 font-black rounded-xl text-[10px] md:text-xs uppercase tracking-widest flex-1 md:flex-none justify-center">
                          {selectedPages.size} Target Nodes
                        </Badge>
                        <Button 
                          onClick={handleConfirmedExecution} 
                          className="h-10 md:h-12 px-6 md:px-10 bg-primary text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl shadow-xl gap-2 hover:scale-105 transition-all flex-1 md:flex-none"
                        >
                          Execute <ChevronRight className="w-4 h-4 hidden md:block" />
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
                              "relative aspect-[1/1.414] rounded-2xl border-4 transition-all cursor-pointer overflow-hidden shadow-lg group", 
                              isSelected 
                                ? "border-primary bg-primary/10 scale-[0.98]" 
                                : isSurgicalTool ? "border-red-500/20 bg-red-50 grayscale opacity-60 hover:opacity-100" : "border-black/5 bg-white"
                            )}
                          >
                            <img src={page.url} alt={`Page ${page.pageIdx + 1}`} className={cn("w-full h-full object-cover transition-all", isSelected ? "opacity-80" : "opacity-40")} />
                            
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-md uppercase">
                              {`P${page.pageIdx + 1}`}
                            </div>

                            {isSelected ? (
                              <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-2xl">
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            ) : isSurgicalTool && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                <Trash2 className="w-8 h-8 text-red-500" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                
                {phase === 'running' && (
                  <motion.div key="running" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto w-full">
                    <Card className="p-8 md:p-12 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-3xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Layers className="w-6 h-6 text-primary animate-bounce" />
                          <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">Binary Synthesis Active</h3>
                        </div>
                        <span className="text-2xl md:text-3xl font-black text-primary tracking-tighter">{Math.round(progress.pct)}%</span>
                      </div>
                      <ProgressBar pct={progress.pct} label={progress.detail} />
                      <LogStream logs={logs} />
                    </Card>
                  </motion.div>
                )}

                {phase === 'done' && result && (
                  <motion.div key="done" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-3xl mx-auto w-full">
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20"><CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" /></div>
                        <div className="space-y-2">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2">Synthesis Success</Badge>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase truncate max-w-xs md:max-w-md mx-auto">{result.fileName}</h3>
                          <p className="text-[10px] md:text-xs font-bold text-slate-950/40 uppercase tracking-[0.3em]">{(result.byteLength / 1024).toFixed(1)} KB Mastered Asset</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleDownload} className="h-14 md:h-16 px-10 md:px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-2xl">
                          <Download className="w-5 h-5" /> Download Asset
                        </Button>
                        <Button variant="outline" onClick={reset} className="h-14 md:h-16 px-8 md:px-10 border-black/10 bg-white font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl gap-4">
                          <RefreshCw className="w-5 h-5" /> New Task
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <motion.div key="error" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto w-full">
                    <Card className="p-10 md:p-16 bg-red-50 border-2 border-red-100 rounded-[3rem] text-center space-y-8 shadow-2xl">
                      <div className="w-16 h-16 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto"><XCircle className="w-8 h-8 text-red-600" /></div>
                      <h3 className="text-xl md:text-3xl font-black text-red-900 uppercase tracking-tighter leading-tight">{error || "Synthesis failure during binary processing."}</h3>
                      <Button onClick={reset} variant="destructive" className="h-12 md:h-14 px-10 md:px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Restart Node</Button>
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
