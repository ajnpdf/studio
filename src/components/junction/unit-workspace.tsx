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
  RotateCcw,
  RefreshCcw,
  Trash2,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ChevronLeft,
  ChevronRight
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
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
 * Featuring the "Visionary" High-Fidelity Segment Gallery.
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
    targetSize: '',
    targetUnit: 'KB',
    watermarkText: 'AJN Professional',
    watermarkOpacity: 50,
    password: '',
    pageNumbers: true,
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
    if ((initialUnitId === 'merge-pdf' || initialUnitId === 'split-pdf') && files.length < 2) {
      toast({ 
        title: "Protocol Violation", 
        description: `The ${tool?.name} unit requires a minimum of 2 PDF segments to establish a sequence.`, 
        variant: "destructive" 
      });
      return;
    }

    setSourceFiles(files);
    
    if (isCompressTool || isDirectConvert) {
      setPhase('selecting'); 
    } 
    else if (files.every(f => f.type === 'application/pdf')) {
      await loadDocumentPages(files);
    } 
    else if (isRotateTool) {
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
          // High-fidelity scale for visionary preview
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
    if (isCompressTool || isDirectConvert) {
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

  const togglePageSelection = (id: string) => {
    const next = new Set(selectedPages);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedPages(next);
  };

  const rotateAllSelected = (dir: 'left' | 'right') => {
    setPages(prev => prev.map(p => {
      if (!selectedPages.has(p.id)) return p;
      const change = dir === 'right' ? 90 : -90;
      return { ...p, rotation: (p.rotation + change + 360) % 360 };
    }));
  };

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
                      <p className="text-[10px] font-black uppercase tracking-widest">Calibrating Buffers...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-12">
                      {/* CONFIGURATION PANEL */}
                      <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10 max-w-4xl mx-auto w-full relative">
                        <div className="absolute top-8 right-10 flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={handleReupload}
                            className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-black/5 hover:text-red-500 hover:bg-red-50 transition-all gap-2 rounded-xl"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" /> Reupload
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
                              <div className="space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Master Orientation Sync</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <button 
                                    onClick={() => {
                                      setConfig({...config, direction: 'left'});
                                      rotateAllSelected('left');
                                    }}
                                    className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 bg-black/5 border-black/5 hover:border-primary/20 group"
                                  >
                                    <RotateCcw className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rotate Left</span>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setConfig({...config, direction: 'right'});
                                      rotateAllSelected('right');
                                    }}
                                    className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 bg-black/5 border-black/5 hover:border-primary/20 group"
                                  >
                                    <RotateCw className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rotate Right</span>
                                  </button>
                                </div>
                                <p className="text-[10px] font-bold text-slate-950/40 uppercase leading-relaxed tracking-widest">Applying directional logic to all visionary segments.</p>
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
                            <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4 shadow-inner">
                              <div className="flex items-center gap-3 text-primary">
                                <ShieldCheck className="w-5 h-5" />
                                <p className="text-xs font-black uppercase tracking-widest">Secure Session</p>
                              </div>
                              <p className="text-[9px] font-bold uppercase leading-relaxed text-slate-950/60">Your document is contained within a secure local buffer. Transformations occur in real-time without cloud persistence.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* VISIONARY SEGMENT GRID */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-3">
                            <Eye className="w-4 h-4 text-primary" />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950/40">Visionary Preview Hub</h4>
                          </div>
                          <div className="flex gap-4">
                            <Button variant="ghost" className="h-8 text-[9px] font-black uppercase text-primary hover:bg-primary/5" onClick={() => setSelectedPages(new Set(pages.map(p => p.id)))}>Select All</Button>
                            <Button variant="ghost" className="h-8 text-[9px] font-black uppercase text-slate-400 hover:bg-black/5" onClick={() => setSelectedPages(new Set())}>Clear Selection</Button>
                          </div>
                        </div>

                        {pages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 pb-32">
                            {pages.map((page, idx) => (
                              <div key={page.id} className="space-y-3">
                                <Card 
                                  onClick={() => togglePageSelection(page.id)} 
                                  className={cn(
                                    "relative aspect-[1/1.414] rounded-[2rem] border-4 transition-all duration-500 cursor-pointer overflow-hidden group shadow-xl", 
                                    selectedPages.has(page.id) ? "border-primary scale-[1.02]" : "border-transparent opacity-40 grayscale hover:opacity-60"
                                  )}
                                >
                                  <div 
                                    className="w-full h-full transition-transform duration-500"
                                    style={{ transform: `rotate(${page.rotation}deg)` }}
                                  >
                                    <img src={page.url} alt="" className="w-full h-full object-cover" />
                                  </div>

                                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase shadow-2xl">
                                    Segment #{idx + 1}
                                  </div>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewPage(page);
                                    }}
                                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl hover:bg-primary hover:text-white"
                                  >
                                    <Maximize2 className="w-4 h-4" />
                                  </button>

                                  {selectedPages.has(page.id) && (
                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                                  )}
                                </Card>
                                <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPages(prev => prev.map(p => p.id === page.id ? { ...p, rotation: (p.rotation - 90 + 360) % 360 } : p));
                                    }}
                                    className="p-2 hover:bg-black/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-[10px] font-black text-slate-950/20 uppercase tracking-widest">{page.rotation}°</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPages(prev => prev.map(p => p.id === page.id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
                                    }}
                                    className="p-2 hover:bg-black/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                  >
                                    <RotateCw className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : sourceFiles.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 pb-20">
                            {sourceFiles.map((file, idx) => (
                              <Card key={idx} className="relative aspect-[1/1.414] rounded-2xl border-4 border-black/5 overflow-hidden bg-white/40 backdrop-blur-xl shadow-lg">
                                {file.type.startsWith('image/') ? (
                                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                    <FileText className="w-10 h-10 text-primary/20 mb-2" />
                                    <p className="text-[9px] font-black uppercase text-slate-950/40 truncate w-full px-4">{file.name}</p>
                                  </div>
                                )}
                                <div className="absolute top-3 left-3 bg-black/60 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase backdrop-blur-md">File {idx + 1}</div>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* GLOBAL EXECUTION BAR */}
                        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6 animate-in slide-in-from-bottom-10 duration-700">
                          <Button 
                            onClick={handleConfirmedExecution} 
                            disabled={(pages.length > 0 && selectedPages.size === 0) || (sourceFiles.length === 0)}
                            className="w-full h-16 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-full shadow-[0_30px_60px_rgba(30,58,138,0.4)] hover:scale-105 transition-all gap-4 border-2 border-white/20"
                          >
                            <Zap className="w-5 h-5" /> EXECUTE PROCESS
                          </Button>
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
                        <h3 className="text-xl font-black uppercase tracking-tighter">Synchronizing Binaries...</h3>
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

      {/* FULL VISIONARY PREVIEW MODAL */}
      <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-white/95 backdrop-blur-3xl border-none p-0 flex flex-col overflow-hidden rounded-[3rem] shadow-2xl">
          <header className="h-20 border-b border-black/5 flex items-center justify-between px-10 shrink-0 bg-white/40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Visionary Inspection</h2>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  if (previewPage) {
                    setPages(prev => prev.map(p => p.id === previewPage.id ? { ...p, rotation: (p.rotation - 90 + 360) % 360 } : p));
                    setPreviewPage({ ...previewPage, rotation: (previewPage.rotation - 90 + 360) % 360 });
                  }
                }}
                className="h-10 px-4 text-[10px] font-black uppercase gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Left
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  if (previewPage) {
                    setPages(prev => prev.map(p => p.id === previewPage.id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
                    setPreviewPage({ ...previewPage, rotation: (previewPage.rotation + 90) % 360 });
                  }
                }}
                className="h-10 px-4 text-[10px] font-black uppercase gap-2"
              >
                <RotateCw className="w-4 h-4" /> Right
              </Button>
              <div className="h-8 w-px bg-black/5 mx-2" />
              <Button onClick={() => setPreviewPage(null)} className="h-10 px-8 bg-slate-900 text-white font-black text-[10px] uppercase rounded-xl">Exit View</Button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden bg-black/5 flex items-center justify-center p-12">
            <div 
              className="h-full shadow-2xl transition-transform duration-500"
              style={{ transform: `rotate(${previewPage?.rotation || 0}deg)` }}
            >
              <img src={previewPage?.url} alt="" className="h-full w-auto object-contain rounded-sm border border-black/5" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/40 backdrop-blur-md border-t border-black/5 flex items-center justify-center z-[100]">
        <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">AJN Core • 2026 • Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span></p>
      </footer>
    </div>
  );
}
