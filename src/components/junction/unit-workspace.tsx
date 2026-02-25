"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { 
  Download, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Settings2,
  ShieldCheck,
  RotateCw,
  RotateCcw,
  RefreshCcw,
  ZoomIn,
  ArrowRight,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

/**
 * AJN Unit Workspace - Professional Industrial Standard 2026
 * Hardened for real-time interaction and precision binary sync.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const tool = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  const [previewPage, setPreviewPage] = useState<PageNode | null>(null);
  
  const [config, setConfig] = useState({
    quality: 50,
    direction: 'right' as 'left' | 'right'
  });

  const isCompressTool = tool?.id === 'compress-pdf';
  const isDirectConvert = ['word-pdf', 'jpg-pdf', 'ppt-pdf', 'excel-pdf', 'pdf-word'].includes(tool?.id || '');
  const isRotateTool = tool?.id === 'rotate-pdf';

  const getAcceptMime = () => {
    if (initialUnitId === 'word-pdf') return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (initialUnitId === 'ppt-pdf') return ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (initialUnitId === 'excel-pdf') return ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (initialUnitId === 'jpg-pdf') return "image/jpeg,image/png,image/webp";
    return "application/pdf";
  };

  const handleFilesAdded = async (files: File[]) => {
    // Multi-Asset Validation
    if ((initialUnitId === 'merge-pdf' || initialUnitId === 'split-pdf') && files.length < 2) {
      toast({ 
        title: "Protocol Violation", 
        description: `The ${tool?.name} unit requires a minimum of 2 PDF segments.`, 
        variant: "destructive" 
      });
      return;
    }

    setSourceFiles(files);
    await loadDocumentPages(files);
  };

  const loadDocumentPages = async (files: File[]) => {
    setIsInitializing(true);
    setPhase('selecting');
    const allLoadedPages: PageNode[] = [];
    const initialSelected = new Set<string>();

    try {
      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        const file = files[fIdx];
        
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          for (let pIdx = 1; pIdx <= pdf.numPages; pIdx++) {
            const page = await pdf.getPage(pIdx);
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.height = viewport.height; canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, viewport }).promise;
            const pageId = `${fIdx}-${pIdx}-${Math.random().toString(36).substr(2, 4)}`;
            allLoadedPages.push({ 
              id: pageId, 
              url: canvas.toDataURL('image/jpeg', 0.85), 
              fileIdx: fIdx, 
              pageIdx: pIdx - 1, 
              rotation: 0 
            });
            initialSelected.add(pageId);
          }
        } else if (isDirectConvert && (file.type.startsWith('image/') || file.name.match(/\.(docx|pptx|xlsx)$/i))) {
          const pageId = `seg-${fIdx}-${Date.now()}`;
          allLoadedPages.push({ 
            id: pageId, 
            url: "https://picsum.photos/seed/doc/400/600", 
            fileIdx: fIdx, 
            pageIdx: 0, 
            rotation: 0 
          });
          initialSelected.add(pageId);
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      console.warn("Segmentation warning:", err);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConfirmedExecution = () => {
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
    toast({ title: "Asset Retrieved", description: "Binary exported successfully." });
  };

  const handleReupload = () => {
    setSourceFiles([]);
    setPages([]);
    setSelectedPages(new Set());
    reset();
  };

  // Capitalized component variable to resolve JSX parsing error
  const ToolIcon = tool?.icon || FileText;

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" className="space-y-8">
                  <DropZone onFiles={handleFilesAdded} accept={getAcceptMime()} />
                </motion.div>
              )}

              {phase === 'selecting' && (
                <motion.div key="selecting" className="space-y-12 animate-in fade-in duration-500">
                  {isInitializing ? (
                    <div className="py-32 text-center opacity-40">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Processing Segments...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-12">
                      <div className="space-y-12">
                        {/* CONFIGURATION PANEL */}
                        <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10 max-w-4xl mx-auto w-full relative">
                          <div className="absolute top-8 right-10 flex gap-3">
                            <Button 
                              variant="outline" 
                              onClick={handleReupload}
                              className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-black/5 hover:text-red-500 transition-all gap-2 rounded-xl shadow-sm"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" /> Reupload Segment
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-primary border-b border-black/5 pb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                              <ToolIcon className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">{tool?.name}</h3>
                              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Operational Protocol</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                              {isRotateTool && (
                                <div className="space-y-4">
                                  <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Orientation Protocol</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setConfig({...config, direction: 'left'})}
                                      className={cn("h-14 rounded-2xl border-black/5 gap-3 font-black text-[10px] uppercase transition-all", config.direction === 'left' ? "bg-primary text-white border-primary shadow-lg" : "bg-white/50")}
                                    >
                                      <RotateCcw className="w-4 h-4" /> Left Rotate
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setConfig({...config, direction: 'right'})}
                                      className={cn("h-14 rounded-2xl border-black/5 gap-3 font-black text-[10px] uppercase transition-all", config.direction === 'right' ? "bg-primary text-white border-primary shadow-lg" : "bg-white/50")}
                                    >
                                      <RotateCw className="w-4 h-4" /> Right Rotate
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {isCompressTool && (
                                <div className="space-y-3">
                                  <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between">
                                    <span>Reduction Strength</span>
                                    <span>{config.quality}%</span>
                                  </Label>
                                  <Slider value={[config.quality]} onValueChange={([v]) => setConfig({...config, quality: v})} max={90} min={10} step={5} />
                                </div>
                              )}
                            </div>

                            <div className="space-y-6">
                              <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-primary">
                                  <ShieldCheck className="w-5 h-5" />
                                  <p className="text-xs font-black uppercase tracking-widest">Local Buffer Secure</p>
                                </div>
                                <p className="text-[9px] font-bold uppercase leading-relaxed text-slate-950/60">Processes are strictly browser-native. Assets are never transmitted or stored externally.</p>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* VISIONARY HUB */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                              <ZoomIn className="w-4 h-4 text-primary" />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950/40">Visionary Segment Grid</h4>
                            </div>
                            <p className="text-[9px] font-black text-slate-950/20 uppercase tracking-widest">Click segment for inspection</p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 pb-32">
                            {pages.map((page, idx) => (
                              <div key={page.id} className="space-y-3">
                                <Card 
                                  onClick={() => setPreviewPage(page)}
                                  className={cn(
                                    "relative aspect-[1/1.414] rounded-[2rem] border-4 transition-all duration-500 overflow-hidden shadow-xl cursor-pointer group hover:scale-[1.02]", 
                                    selectedPages.has(page.id) ? "border-primary" : "border-transparent opacity-40"
                                  )}
                                >
                                  <img 
                                    src={page.url} 
                                    alt="" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    style={{ transform: `rotate(${page.rotation}deg)` }}
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase shadow-2xl">
                                    Seg #{idx + 1}
                                  </div>
                                </Card>
                              </div>
                            ))}
                          </div>

                          {/* EXECUTE PROTOCOL BAR */}
                          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6 animate-in slide-in-from-bottom-10 duration-700">
                            <Button 
                              onClick={handleConfirmedExecution} 
                              className="w-full h-16 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-full shadow-[0_30px_60px_rgba(30,58,138,0.4)] hover:scale-105 transition-all gap-4 border-2 border-white/20"
                            >
                              <Zap className="w-5 h-5" /> EXECUTE PROCESS
                            </Button>
                          </div>
                        </div>
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
                        <h3 className="text-xl font-black uppercase tracking-tighter">Executing Unit...</h3>
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
                  <Card className="bg-white/80 border-2 border-emerald-500/20 p-16 rounded-[4rem] shadow-2xl text-center backdrop-blur-3xl space-y-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                    <div className="space-y-2">
                      <Badge className="bg-emerald-500 text-white font-black px-4 h-6 rounded-full mb-2 uppercase tracking-widest">Process Successful</Badge>
                      <h3 className="text-2xl font-black uppercase truncate text-slate-950">{result.fileName}</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all gap-4"><Download className="w-5 h-5" /> Download Result</Button>
                      <Button variant="ghost" onClick={handleReupload} className="h-16 px-8 text-slate-950/40 font-black text-xs uppercase tracking-widest">New Interaction</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* FULL-VIEW INSPECTION DIALOG */}
      <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] bg-white border-none p-0 overflow-hidden font-sans rounded-[3rem] shadow-2xl">
          <DialogHeader className="p-8 border-b border-black/5 flex items-center justify-between shrink-0">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Visionary Inspection</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setPreviewPage(null)} className="h-10 w-10 text-slate-400 hover:text-slate-900">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="flex-1 bg-slate-50 p-12 overflow-y-auto flex items-center justify-center">
            {previewPage && (
              <div className="relative shadow-2xl bg-white border border-black/5 origin-center transition-transform duration-500" style={{ transform: `rotate(${previewPage.rotation}deg)` }}>
                <img src={previewPage.url} className="max-w-full max-h-full object-contain" alt="" />
              </div>
            )}
          </div>
          <footer className="p-8 border-t border-black/5 flex items-center justify-center shrink-0">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">High-Fidelity Document Segment</p>
          </footer>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/40 backdrop-blur-md border-t border-black/5 flex items-center justify-center z-[100]">
        <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">AJN Core • 2026 • Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span></p>
      </footer>
    </div>
  );
}
