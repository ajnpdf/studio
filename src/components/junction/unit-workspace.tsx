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
  Info,
  Edit3
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

/**
 * AJN Tools Workspace - Professional Industrial Setup 2026
 * Hardened for real-time execution with advanced compression and repair logic.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const tool = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [config, setConfig] = useState({
    quality: 50,
    strongCompression: true,
    targetSize: '',
    targetUnit: 'KB',
    ocrLanguage: 'eng',
    splitMode: 'range',
    optimizationLevel: 'balanced'
  });

  const isWordTool = tool?.id === 'word-pdf';
  const isCompressTool = tool?.id === 'compress-pdf';
  const isRepairTool = tool?.id === 'repair-pdf';

  const handleFilesAdded = async (files: File[]) => {
    setSourceFiles(files);
    
    if (isCompressTool || isRepairTool) {
      setPhase('selecting'); 
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
          allLoadedPages.push({ id: pageId, url: canvas.toDataURL('image/jpeg', 0.75), fileIdx: fIdx, pageIdx: pIdx - 1, rotation: 0 });
          initialSelected.add(pageId);
        }
      }
      setPages(allLoadedPages);
      setSelectedPages(initialSelected);
    } catch (err) {
      toast({ title: "Error", description: "Could not load document segments.", variant: "destructive" });
      reset();
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConfirmedExecution = () => {
    if (isCompressTool || isRepairTool) {
      run(sourceFiles, config);
      return;
    }
    const pageData = pages.filter(p => selectedPages.has(p.id)).map(p => ({ fileIdx: p.fileIdx, pageIdx: p.pageIdx, rotation: p.rotation }));
    run(sourceFiles, { ...config, pageData });
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = result.fileName; a.click();
    toast({ title: "Export Complete", description: "Asset successfully retrieved." });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" className="space-y-6">
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-relaxed">
                      Use for student purpose and business purpose • useful to students and business and more
                    </p>
                  </div>
                  <DropZone onFiles={handleFilesAdded} accept={isCompressTool || isRepairTool ? "application/pdf" : "*/*"} />
                </motion.div>
              )}

              {phase === 'selecting' && (
                <motion.div key="selecting" className="space-y-8">
                  {isInitializing ? (
                    <div className="py-32 text-center opacity-40">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Calibrating Buffer...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col xl:flex-row gap-8">
                      <div className="flex-1">
                        {isCompressTool || isRepairTool ? (
                          <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10">
                            <div className="flex items-center gap-4 text-primary">
                              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                                {isCompressTool ? <Shrink className="w-7 h-7" /> : <RefreshCw className="w-7 h-7" />}
                              </div>
                              <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">{isCompressTool ? 'Advanced Compression' : 'System Repair'}</h3>
                                <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">{isCompressTool ? 'Configure Target reduction' : 'Multi-Stage structural recovery'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                {isCompressTool && (
                                  <>
                                    <div className="space-y-3">
                                      <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between">
                                        <span>Reduction Level</span>
                                        <span>{config.quality}%</span>
                                      </Label>
                                      <Slider value={[config.quality]} onValueChange={([v]) => setConfig({...config, quality: v})} max={90} min={10} step={5} />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Target Max Size</Label>
                                      <div className="flex gap-3">
                                        <Input type="number" placeholder="e.g. 500" value={config.targetSize} onChange={(e) => setConfig({...config, targetSize: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-bold" />
                                        <select value={config.targetUnit} onChange={(e) => setConfig({...config, targetUnit: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-black text-[10px]">
                                          <option value="KB">KB</option><option value="MB">MB</option>
                                        </select>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {isRepairTool && (
                                  <div className="space-y-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                    <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                      <CheckCircle2 className="w-5 h-5" />
                                      <p className="text-xs font-black uppercase">Fidelity Restoration</p>
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-950/60 font-medium">The system will attempt structural rebuilding, object recovery, and header correction to restore access to your document.</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-6">
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black uppercase">Strong Optimization</p>
                                    <Switch checked={config.strongCompression} onCheckedChange={(v) => setConfig({...config, strongCompression: v})} />
                                  </div>
                                  <p className="text-[9px] text-slate-950/40 font-bold uppercase">Use for student purpose and business purpose.</p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-black/5 flex justify-end">
                              <Button onClick={handleConfirmedExecution} className="h-16 px-16 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl hover:scale-105 transition-all gap-3">
                                EXECUTE MODULE <ArrowRight className="w-5 h-5" />
                              </Button>
                            </div>
                          </section>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {pages.map((page, idx) => (
                              <Card key={page.id} onClick={() => {
                                const next = new Set(selectedPages);
                                if (next.has(page.id)) next.delete(page.id); else next.add(page.id);
                                setSelectedPages(next);
                              }} className={cn("relative aspect-[1/1.414] rounded-xl border-4 transition-all cursor-pointer", selectedPages.has(page.id) ? "border-primary scale-[1.02]" : "border-black/5 opacity-40")}>
                                <img src={page.url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">#{idx + 1}</div>
                              </Card>
                            ))}
                          </div>
                        )}
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
                      <span className="text-3xl font-black text-primary">{Math.round(progress.pct)}%</span>
                    </div>
                    <ProgressBar pct={progress.pct} label={progress.detail} />
                    <LogStream logs={logs} />
                  </Card>
                </motion.div>
              )}

              {phase === 'done' && result && (
                <motion.div key="done" className="max-w-3xl mx-auto w-full pt-12">
                  <Card className="bg-white/80 border-2 border-emerald-500/20 p-16 rounded-[4rem] shadow-2xl space-y-10 text-center backdrop-blur-3xl">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
                    <div className="space-y-2">
                      <Badge className="bg-emerald-500 text-white font-black px-4 h-6 rounded-full mb-2">Process Successful</Badge>
                      <h3 className="text-2xl font-black uppercase truncate text-slate-950">{result.fileName}</h3>
                      <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest mt-2">
                        Use for student purpose and business purpose • useful to students and business and more
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all gap-4"><Download className="w-5 h-5" /> Download</Button>
                      <Link href="/dashboard/pdf-editor">
                        <Button variant="outline" className="h-16 px-12 border-primary/20 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-xl hover:scale-105 transition-all">
                          <Edit3 className="w-5 h-5" /> Open in Editor
                        </Button>
                      </Link>
                      <Button variant="ghost" onClick={reset} className="h-16 px-8 text-slate-950/40 font-black text-xs uppercase tracking-widest">New Session</Button>
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
          All-in-one Junction Network • 2026 • Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span>
        </p>
      </footer>
    </div>
  );
}