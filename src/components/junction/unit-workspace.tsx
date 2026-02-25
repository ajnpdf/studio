"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { 
  Download, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Edit3,
  Settings2,
  FileText,
  ShieldCheck,
  Type,
  Layout,
  Hash,
  Lock,
  Eye,
  EyeOff,
  RotateCw,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PageNode {
  id: string;
  url: string;
  fileIdx: number;
  pageIdx: number;
  rotation: number;
}

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ initialUnitId }: Props) {
  const tool = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [config, setConfig] = useState({
    quality: 50,
    targetSize: '',
    targetUnit: 'KB',
    watermarkText: 'AJN Professional',
    watermarkOpacity: 50,
    password: '',
    pageNumbers: true
  });

  const isCompressTool = tool?.id === 'compress-pdf';
  const isDirectConvert = ['word-pdf', 'jpg-pdf', 'ppt-pdf', 'excel-pdf', 'pdf-word'].includes(tool?.id || '');
  const isRotateTool = tool?.id === 'rotate-pdf';

  const handleFilesAdded = async (files: File[]) => {
    setSourceFiles(files);
    
    if (isCompressTool || isDirectConvert || isRotateTool) {
      setPhase('selecting'); 
    } 
    else if (files.some(f => f.type === 'application/pdf')) {
      await loadDocumentPages(files);
    } 
    else {
      run(files, config);
    }
  };

  const loadDocumentPages = async (files: File[]) => {
    setIsInitializing(true);
    setPhase('selecting');
    const allLoadedPages: PageNode[] = [];
    const initialSelected = new Set<string>();

    try {
      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        const file = files[fIdx];
        if (file.type !== 'application/pdf') continue;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        for (let pIdx = 1; pIdx <= pdf.numPages; pIdx++) {
          const page = await pdf.getPage(pIdx);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.height = viewport.height; canvas.width = viewport.width;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const pageId = `${fIdx}-${pIdx}-${Math.random().toString(36).substr(2, 4)}`;
          allLoadedPages.push({ id: pageId, url: canvas.toDataURL('image/jpeg', 0.75), fileIdx: fIdx, pageIdx: pIdx - 1, rotation: 0 });
          initialSelected.add(pageId);
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      toast({ title: "Kernel Error", description: "Segment ingestion failed.", variant: "destructive" });
      reset();
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConfirmedExecution = () => {
    if (isCompressTool || isDirectConvert || isRotateTool) {
      run(sourceFiles, config);
      return;
    }
    const pageData = pages.filter(p => selectedPages.has(p.id)).map(p => ({ 
      fileIdx: p.fileIdx, 
      pageIdx: p.pageIdx, 
      rotation: p.rotation 
    }));
    run(sourceFiles, { ...config, pageData });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = result.fileName; a.click();
    toast({ title: "Asset Retrieved", description: "Binary exported to local filesystem." });
  };

  const handleReupload = () => {
    setSourceFiles([]);
    setPages([]);
    setSelectedPages(new Set());
    reset();
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" className="space-y-8">
                  <DropZone onFiles={handleFilesAdded} />
                </motion.div>
              )}

              {phase === 'selecting' && (
                <motion.div key="selecting" className="space-y-8 animate-in fade-in duration-500">
                  {isInitializing ? (
                    <div className="py-32 text-center opacity-40">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Calibrating Buffers...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {/* CONFIGURATION PANELS */}
                      <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10 max-w-4xl mx-auto w-full relative">
                        
                        {/* REUPLOAD BUTTON */}
                        <div className="absolute top-8 right-10">
                          <Button 
                            variant="ghost" 
                            onClick={handleReupload}
                            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all gap-2 rounded-xl"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" /> Reupload Segment
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-primary border-b border-black/5 pb-6">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                            <Settings2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">{tool?.name}</h3>
                            <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Operational Protocol</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                            {isCompressTool && (
                              <>
                                <div className="space-y-3">
                                  <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between">
                                    <span>Reduction Strength</span>
                                    <span>{config.quality}%</span>
                                  </Label>
                                  <Slider value={[config.quality]} onValueChange={([v]) => setConfig({...config, quality: v})} max={90} min={10} step={5} />
                                </div>
                                <div className="space-y-3">
                                  <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Max Output Size</Label>
                                  <div className="flex gap-3">
                                    <Input type="number" placeholder="e.g. 500" value={config.targetSize} onChange={(e) => setConfig({...config, targetSize: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-bold" />
                                    <select value={config.targetUnit} onChange={(e) => setConfig({...config, targetUnit: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-black text-[10px] px-4">
                                      <option value="KB">KB</option><option value="MB">MB</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}
                            {isRotateTool && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-amber-600">
                                  <RotateCw className="w-5 h-5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Global Rotation Mode</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-950/40 uppercase leading-relaxed tracking-widest">All segments will be rotated 90° clockwise per execution cycle.</p>
                              </div>
                            )}
                            {isDirectConvert && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-600">
                                  <CheckCircle2 className="w-5 h-5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">{sourceFiles.length} File(s) Staged</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-950/40 uppercase leading-relaxed tracking-widest">Execute process to initiate binary transformation.</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4">
                              <div className="flex items-center gap-3 text-primary">
                                <ShieldCheck className="w-5 h-5" />
                                <p className="text-xs font-black uppercase tracking-widest">Local Buffer Secure</p>
                              </div>
                              <p className="text-[9px] font-bold uppercase leading-relaxed text-slate-950/60">System executes high-fidelity binary reconstruction. No data leaves your browser sandbox.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* PAGE SELECTION GRID */}
                      {pages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 pb-20">
                          {pages.map((page, idx) => (
                            <Card key={page.id} onClick={() => {
                              const next = new Set(selectedPages);
                              if (next.has(page.id)) next.delete(page.id); else next.add(page.id);
                              setSelectedPages(next);
                            }} className={cn("relative aspect-[1/1.414] rounded-xl border-4 transition-all cursor-pointer overflow-hidden group", selectedPages.has(page.id) ? "border-primary scale-[1.02] shadow-2xl" : "border-black/5 opacity-40 grayscale hover:opacity-60")}>
                              <img src={page.url} alt="" className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase backdrop-blur-md">#{idx + 1}</div>
                              {selectedPages.has(page.id) && (
                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                  <div className="bg-primary text-white rounded-full p-2 shadow-2xl animate-in zoom-in-50 duration-300"><CheckCircle2 className="w-5 h-5" /></div>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* FIXED GLOBAL ACTION BAR */}
                      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6 animate-in slide-in-from-bottom-10 duration-700">
                        <Button 
                          onClick={handleConfirmedExecution} 
                          disabled={(pages.length > 0 && selectedPages.size === 0) || (sourceFiles.length === 0)}
                          className="w-full h-16 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-full shadow-[0_20px_50px_rgba(30,58,138,0.4)] hover:scale-105 transition-all gap-4 border-2 border-white/20"
                        >
                          <Zap className="w-5 h-5" /> EXECUTE PROCESS
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {phase === 'running' && (
                <motion.div key="running" className="max-w-3xl mx-auto w-full pt-12">
                  <Card className="p-12 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-3xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-primary">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <h3 className="text-xl font-black uppercase tracking-tighter">Executing Process...</h3>
                      </div>
                      <span className="text-3xl font-black text-primary tabular-nums">{Math.round(progress.pct)}%</span>
                    </div>
                    <ProgressBar pct={progress.pct} label={progress.detail} />
                    <LogStream logs={logs} />
                  </Card>
                </motion.div>
              )}

              {phase === 'done' && result && (
                <motion.div key="done" className="max-w-3xl mx-auto w-full pt-12">
                  <Card className="bg-white/80 border-2 border-emerald-500/20 p-16 rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                    <div className="space-y-2">
                      <Badge className="bg-emerald-500 text-white font-black px-4 h-6 rounded-full mb-2 uppercase tracking-widest">Process Successful</Badge>
                      <h3 className="text-2xl font-black uppercase truncate text-slate-950">{result.fileName}</h3>
                      <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest mt-2">Asset calibrated and ready for retrieval.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all gap-4"><Download className="w-5 h-5" /> Download Result</Button>
                      <Link href="/dashboard/pdf-editor">
                        <Button variant="outline" className="h-16 px-12 border-primary/20 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-xl hover:scale-105 transition-all"><Edit3 className="w-5 h-5" /> Open in Editor</Button>
                      </Link>
                      <Button variant="ghost" onClick={handleReupload} className="h-16 px-8 text-slate-950/40 font-black text-xs uppercase tracking-widest">New interaction</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/40 backdrop-blur-md border-t border-black/5 flex items-center justify-center z-[100]">
        <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">AJN Core • 2026 • Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span></p>
      </footer>
    </div>
  );
}
