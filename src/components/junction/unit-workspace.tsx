"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Eye,
  ListChecks,
  Eraser,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Settings2,
  Zap,
  Lock,
  History,
  Shrink,
  Info
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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { engine } from '@/lib/engine';

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
 * AJN Tools Workspace - Professional Industrial Setup 2026
 * Hardened for real-time execution with advanced compression and page management.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const tool = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [config, setConfig] = useState({
    quality: 50, // Default 50% for compression
    strongCompression: true,
    targetSize: '',
    targetUnit: 'KB',
    ocrLanguage: 'eng',
    splitMode: 'range',
    optimizationLevel: 'balanced'
  });

  const isWordTool = tool?.id === 'word-pdf';
  const isCompressTool = tool?.id === 'compress-pdf';

  const getAcceptString = () => {
    if (isWordTool) return ".doc,.docx,.odt,.rtf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (tool?.id === 'excel-pdf') return ".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (tool?.id === 'ppt-pdf') return ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (tool?.id === 'jpg-pdf') return "image/jpeg,image/jpg";
    if (isCompressTool) return "application/pdf";
    return "*/*";
  };

  const handleFilesAdded = async (files: File[]) => {
    setSourceFiles(files);
    
    if (isCompressTool) {
      setPhase('selecting'); // Move to config phase for compression
    } else if (files.some(f => f.type === 'application/pdf') || isWordTool) {
      await loadDocumentPages(files, isWordTool);
    } else {
      run(files, config);
    }
  };

  const loadDocumentPages = async (files: File[], convertFromWord: boolean) => {
    setIsInitializing(true);
    setPhase('selecting');
    const allLoadedPages: PageNode[] = [];
    const initialSelected = new Set<string>();

    try {
      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        let file = files[fIdx];
        
        if (convertFromWord) {
          const preRes = await engine.runTool('word-pdf', [file], config, () => {});
          if (preRes.success && preRes.blob) {
            file = new File([preRes.blob], 'preview.pdf', { type: 'application/pdf' });
          } else {
            throw new Error("Pre-flight conversion failed.");
          }
        }

        if (file.type !== 'application/pdf') continue;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        
        for (let pIdx = 1; pIdx <= pdf.numPages; pIdx++) {
          const page = await pdf.getPage(pIdx);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          
          const pageId = `${fIdx}-${pIdx}-${Math.random().toString(36).substr(2, 4)}`;
          allLoadedPages.push({ 
            id: pageId, 
            url: canvas.toDataURL('image/jpeg', 0.75),
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
      console.error(err);
      toast({ title: "Error", description: "Could not load document segments for preview.", variant: "destructive" });
      reset();
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConfirmedExecution = () => {
    if (isCompressTool) {
      run(sourceFiles, config);
      return;
    }

    const pageData = pages
      .filter(p => selectedPages.has(p.id))
      .map(p => ({
        fileIdx: p.fileIdx,
        pageIdx: p.pageIdx,
        rotation: p.rotation
      }));

    if (pageData.length === 0) {
      toast({ title: "Selection Required", description: "Select at least one segment to process." });
      return;
    }

    run(sourceFiles, { ...config, pageData });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = result.fileName; 
    a.click();
    toast({ title: "Export Complete", description: "Asset successfully retrieved." });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-relaxed">
                      Use for student purpose and business purpose • useful to students and business and more
                    </p>
                  </div>
                  <DropZone onFiles={handleFilesAdded} accept={getAcceptString()} />
                </motion.div>
              )}

              {phase === 'selecting' && (
                <motion.div key="selecting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {isInitializing ? (
                    <div className="py-32 text-center space-y-6 opacity-40">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950">Preparing Buffer...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col xl:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        {isCompressTool ? (
                          <div className="space-y-8">
                            <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10">
                              <div className="flex items-center gap-4 text-primary">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                                  <Shrink className="w-7 h-7" />
                                </div>
                                <div>
                                  <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Advanced Compression</h3>
                                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Configure target reduction fidelity</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between">
                                      <span>Target Reduction %</span>
                                      <span className="text-slate-950">{config.quality}%</span>
                                    </Label>
                                    <Slider 
                                      value={[config.quality]} 
                                      onValueChange={([v]) => setConfig({...config, quality: v})} 
                                      max={90} 
                                      min={10}
                                      step={5} 
                                    />
                                    <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest pt-1">
                                      <span>Light</span>
                                      <span>Standard</span>
                                      <span>Extreme</span>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Target Size Reduction (Optional)</Label>
                                    <div className="flex gap-3">
                                      <Input 
                                        type="number" 
                                        placeholder="e.g. 500" 
                                        value={config.targetSize}
                                        onChange={(e) => setConfig({...config, targetSize: e.target.value})}
                                        className="h-12 bg-black/5 border-none rounded-2xl font-bold text-lg px-6 focus:ring-primary/20" 
                                      />
                                      <select 
                                        value={config.targetUnit}
                                        onChange={(e) => setConfig({...config, targetUnit: e.target.value})}
                                        className="h-12 bg-black/5 border-none rounded-2xl font-black text-[10px] uppercase px-4"
                                      >
                                        <option value="KB">KB</option>
                                        <option value="MB">MB</option>
                                      </select>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest italic ml-2">Specify exactly how much space to recover</p>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-black uppercase text-slate-950">Strong Compression</p>
                                        <p className="text-[9px] text-slate-950/40 font-bold uppercase">Aggressive Binary Deflation</p>
                                      </div>
                                      <Switch 
                                        checked={config.strongCompression} 
                                        onCheckedChange={(v) => setConfig({...config, strongCompression: v})} 
                                      />
                                    </div>
                                    <div className="h-px bg-primary/10" />
                                    <div className="flex items-center gap-3">
                                      <Zap className="w-4 h-4 text-primary animate-pulse" />
                                      <p className="text-[10px] font-bold text-slate-950/60 uppercase leading-relaxed">
                                        Optimization Level: <span className="text-primary">{config.optimizationLevel.toUpperCase()}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                    <Info className="w-4 h-4 text-emerald-600 mt-0.5" />
                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide leading-relaxed">
                                      Professional algorithms ensure text and vector fidelity are preserved during the deflation process.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="text-center sm:text-left">
                                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">Selected Files</p>
                                  <p className="text-sm font-bold text-slate-950">{sourceFiles.length} Document(s) Detected</p>
                                </div>
                                <Button onClick={handleConfirmedExecution} className="h-16 px-16 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl hover:scale-105 transition-all gap-3">
                                  START COMPRESSION <ArrowRight className="w-5 h-5" />
                                </Button>
                              </div>
                            </section>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="bg-white/60 p-6 rounded-3xl border border-black/5 shadow-2xl backdrop-blur-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-primary">
                                  <Eye className="w-5 h-5" />
                                  <h3 className="text-lg font-black uppercase tracking-tighter text-slate-950">Fidelity Preview</h3>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setSelectedPages(new Set(pages.map(p => p.id)))} className="h-8 text-[9px] font-black uppercase gap-2 bg-white/50 border-black/5"><ListChecks className="w-3 h-3" /> Select All</Button>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedPages(new Set())} className="h-8 text-[9px] font-black uppercase gap-2 bg-white/50 border-black/5"><Eraser className="w-3 h-3" /> Deselect</Button>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-6 font-black rounded-xl text-xs uppercase tracking-widest">
                                  {selectedPages.size} Segments Active
                                </Badge>
                                <Button onClick={handleConfirmedExecution} className="h-12 px-10 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 transition-all">
                                  Finalize Process <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                              {pages.map((page, idx) => {
                                const isSelected = selectedPages.has(page.id);
                                return (
                                  <div key={page.id} className="space-y-2 group">
                                    <div 
                                      onClick={() => togglePageSelection(page.id)} 
                                      className={cn(
                                        "relative aspect-[1/1.414] rounded-2xl border-4 transition-all cursor-pointer overflow-hidden shadow-lg",
                                        isSelected ? "border-primary bg-primary/10 scale-[1.03] z-10" : "border-black/5 opacity-60"
                                      )}
                                    >
                                      <img 
                                        src={page.url} 
                                        alt={`Page ${page.pageIdx + 1}`} 
                                        className={cn("w-full h-full object-cover transition-all duration-500", isSelected ? "opacity-100" : "opacity-40")} 
                                        style={{ transform: `rotate(${page.rotation}deg)` }}
                                      />
                                      <div className="absolute top-3 left-3 bg-black/60 text-white text-[8px] font-black px-2 py-1 rounded-md backdrop-blur-md uppercase shadow-lg">#{idx + 1}</div>
                                      {isSelected ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xl border-2 border-white/20"><CheckCircle2 className="w-6 h-6" /></div>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                                          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xl border-2 border-white/20"><XCircle className="w-6 h-6" /></div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button size="icon" variant="outline" title="Move Up" onClick={(e) => { e.stopPropagation(); movePage(idx, 'up'); }} className="h-7 w-7 rounded-lg bg-white/50 border-black/5"><ArrowLeft className="w-3.5 h-3.5" /></Button>
                                      <Button size="icon" variant="outline" title="Rotate" onClick={(e) => { e.stopPropagation(); rotatePage(page.id); }} className="h-7 w-7 rounded-lg bg-white/50 border-black/5"><RotateCw className="w-3.5 h-3.5" /></Button>
                                      <Button size="icon" variant="outline" title="Move Down" onClick={(e) => { e.stopPropagation(); movePage(idx, 'down'); }} className="h-7 w-7 rounded-lg bg-white/50 border-black/5"><ArrowRight className="w-3.5 h-3.5" /></Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isCompressTool && (
                        <aside className="w-full xl:w-80 space-y-6 shrink-0">
                          <Card className="p-6 bg-white/60 border border-black/5 rounded-3xl shadow-xl backdrop-blur-3xl space-y-8">
                            <div className="flex items-center gap-3 text-primary border-b border-black/5 pb-4">
                              <Settings2 className="w-5 h-5" />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">Unit Configuration</h3>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-950/40 tracking-widest">Output Fidelity</Label>
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-xs font-bold text-slate-950">{config.quality}%</span>
                                </div>
                                <Slider 
                                  value={[config.quality]} 
                                  onValueChange={([v]) => setConfig({...config, quality: v})} 
                                  max={100} 
                                  step={1} 
                                />
                              </div>

                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-950/40 tracking-widest">Optimization Strategy</Label>
                                <select 
                                  value={config.optimizationLevel} 
                                  onChange={(e) => setConfig({...config, optimizationLevel: e.target.value})}
                                  className="w-full h-10 bg-black/5 border-none rounded-xl font-bold text-xs uppercase text-slate-950 px-3"
                                >
                                  <option value="balanced">Balanced</option>
                                  <option value="performance">Fast Processing</option>
                                  <option value="high">High Accuracy</option>
                                </select>
                              </div>

                              <div className="pt-4 border-t border-black/5 space-y-4">
                                <p className="text-[8px] font-bold text-slate-950/40 uppercase tracking-widest text-center">
                                  Use for student purpose and business purpose • useful to students and business and more
                                </p>
                                <div className="flex items-center gap-3 text-emerald-600">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Secure Local Execution</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-950/40">
                                  <History className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Wipe Cache on Exit</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </aside>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
              
              {phase === 'running' && (
                <motion.div key="running" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full pt-12">
                  <Card className="p-8 md:p-12 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl backdrop-blur-3xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-primary">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                          <Zap className="w-5 h-5 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950">Executing Process...</h3>
                      </div>
                      <span className="text-3xl font-black text-primary tracking-tighter">{Math.round(progress.pct)}%</span>
                    </div>
                    <ProgressBar pct={progress.pct} label={progress.detail} />
                    <LogStream logs={logs} />
                  </Card>
                </motion.div>
              )}

              {phase === 'done' && result && (
                <motion.div key="done" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-3xl mx-auto w-full pt-12">
                  <Card className="bg-white/80 border-2 border-emerald-500/20 p-10 md:p-16 rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20 shadow-lg"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                      <div className="space-y-2">
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2 shadow-sm">Process Successful</Badge>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase truncate max-w-md mx-auto text-slate-950">{result.fileName}</h3>
                        <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Ready for Retrieval</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-2xl transition-all hover:scale-105">
                        <Download className="w-5 h-5" /> Download Result
                      </Button>
                      <Button variant="outline" onClick={reset} className="h-16 px-10 border-black/10 bg-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4 hover:bg-black/5 transition-all text-slate-950">
                        <RefreshCw className="w-5 h-5" /> New Batch
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {phase === 'error' && (
                <motion.div key="error" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-2xl mx-auto w-full pt-12">
                  <Card className="p-16 bg-red-50 border-2 border-red-100 rounded-[3rem] text-center space-y-8 shadow-2xl">
                    <div className="w-16 h-16 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto"><XCircle className="w-8 h-8 text-red-600" /></div>
                    <h3 className="text-2xl font-black text-red-900 uppercase tracking-tighter leading-tight">{error || "Process Interrupted."}</h3>
                    <div className="flex flex-col gap-3">
                      <Button onClick={handleConfirmedExecution} variant="outline" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-red-200 bg-white hover:bg-red-50 text-red-900">Retry Process</Button>
                      <Button onClick={reset} variant="ghost" className="h-10 font-bold uppercase text-[10px] text-red-400">Cancel</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/40 backdrop-blur-md border-t border-black/5 flex items-center justify-center z-[100]">
        <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">
          All-in-one Junction Network • 2026 • Made in INDIAN❤️
        </p>
      </footer>
    </div>
  );
}
