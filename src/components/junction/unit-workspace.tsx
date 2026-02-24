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
  FileIcon
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
 * AJN Engineering Workspace - Universal Real-Time Visionary
 * Implements high-fidelity page inspection for all tools.
 * Standardized on Arial typography.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<{ id: string, url: string, fileIdx: number, pageIdx: number }[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Tools that require manual selection (start empty)
  const isSurgicalTool = ['delete-pages', 'extract-pages', 'split-pdf'].includes(unit?.id || '');

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
    
    // Always attempt visionary load for PDF inputs
    if (files.some(f => f.type === 'application/pdf')) {
      await loadAllPdfPages(files);
    } else {
      run(files, { quality: 90, targetFormat: unit?.id.split('-').pop()?.toUpperCase() || 'PDF' });
    }
  };

  const loadAllPdfPages = async (files: File[]) => {
    setPhase('selecting' as any);
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

          // Transformation tools: Select all by default for review
          if (!isSurgicalTool) {
            initialSelected.add(pageId);
          }
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      toast({ title: "Load Error", description: "Failed to parse visionary buffer.", variant: "destructive" });
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
    if (selectedPages.size === 0 && isSurgicalTool) {
      toast({ title: "Selection Required", description: "Please select at least one page to process." });
      return;
    }

    const indices = Array.from(selectedPages).map(id => parseInt(id.split('-')[1]) - 1);
    
    run(sourceFiles, { 
      pageIndices: indices,
      quality: 90,
      targetFormat: unit?.id.split('-').pop()?.toUpperCase() || 'PDF'
    });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = result.fileName; 
    a.click();
    toast({ title: "Asset Exported", description: `${result.fileName} saved successfully.` });
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-32">
            
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
                    <Activity className="w-3 h-3 text-emerald-600" /> Neural Registry Instance • Active Sector
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/40 border border-black/5 rounded-2xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">Buffer Secured</span>
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
                    <div className="flex items-center justify-between px-4 bg-white/40 p-6 rounded-3xl border border-black/5 shadow-xl backdrop-blur-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-primary" />
                          <h3 className="text-xl font-black uppercase tracking-tighter">Visionary Review Layer</h3>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {isSurgicalTool 
                            ? 'Select specific pages for surgical processing' 
                            : 'Reviewing document visionary contents before execution'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-6 font-black rounded-xl text-xs uppercase tracking-widest">
                          {selectedPages.size} Target Segments
                        </Badge>
                        <Button 
                          onClick={handleConfirmedExecution} 
                          className="h-12 px-10 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl gap-2 hover:scale-105 active:scale-95 transition-all"
                        >
                          Execute Mastery <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {pages.map((page) => (
                        <div 
                          key={page.id} 
                          onClick={() => togglePageSelection(page.id)} 
                          className={cn(
                            "relative aspect-[1/1.414] rounded-2xl border-4 transition-all cursor-pointer overflow-hidden shadow-lg group", 
                            selectedPages.has(page.id) 
                              ? (unit?.id === 'delete-pages' ? "border-red-500 bg-red-50" : "border-primary bg-primary/10") 
                              : "border-black/5 hover:border-primary/40 bg-white"
                          )}
                        >
                          <img 
                            src={page.url} 
                            alt={`Page ${page.pageIdx + 1}`}
                            className={cn(
                              "w-full h-full object-cover transition-all duration-500", 
                              selectedPages.has(page.id) && (unit?.id === 'delete-pages' ? "opacity-40 grayscale blur-[2px]" : "opacity-80 scale-95")
                            )} 
                          />
                          <div className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-black px-2 py-1 rounded-lg backdrop-blur-md uppercase">
                            {sourceFiles.length > 1 ? `File ${page.fileIdx + 1} • P${page.pageIdx + 1}` : `Page ${page.pageIdx + 1}`}
                          </div>
                          
                          {selectedPages.has(page.id) && (
                            <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
                              <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shadow-2xl",
                                unit?.id === 'delete-pages' ? "bg-red-500" : "bg-primary"
                              )}>
                                {unit?.id === 'delete-pages' ? <Trash2 className="w-6 h-6 text-white" /> : <CheckCircle2 className="w-6 h-6 text-white" />}
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
                        <div className="flex items-center gap-4">
                          <Layers className="w-6 h-6 text-primary animate-bounce" />
                          <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950">Executing Binary Synthesis</h3>
                        </div>
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
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2">Synthesis Success</Badge>
                          <h3 className="text-3xl font-black tracking-tighter uppercase">{result.fileName}</h3>
                          <p className="text-xs font-bold text-slate-950/40 uppercase tracking-[0.3em]">{(result.byteLength / 1024).toFixed(1)} KB Mastered Buffer</p>
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
