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
  Lock, 
  Edit3,
  Type,
  Hash,
  Move,
  Settings2,
  Info,
  GitCompare,
  FileText
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
 * Modelled after iLovePDF real-time comparison standards.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const tool = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset, setPhase } = useAJNTool(initialUnitId || 'merge-pdf');
  
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [secondFile, setSecondFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [config, setConfig] = useState({
    quality: 50,
    strongCompression: true,
    targetSize: '',
    targetUnit: 'KB',
    password: '',
    watermarkText: 'AJN CONFIDENTIAL',
    watermarkOpacity: 30,
    pageNumberPos: 'bottom-center',
    pageNumberFont: 'Arial',
    ocrLanguage: 'eng',
    compareMode: 'semantic' as 'semantic' | 'visual',
    compareSensitivity: 50
  });

  const isWordToPdf = tool?.id === 'word-pdf';
  const isCompressTool = tool?.id === 'compress-pdf';
  const isProtectTool = tool?.id === 'protect-pdf';
  const isWatermarkTool = tool?.id === 'watermark-pdf';
  const isPageNumberTool = tool?.id === 'add-page-numbers';
  const isCompareTool = tool?.id === 'compare-pdf';

  const handleFilesAdded = async (files: File[]) => {
    if (isCompareTool) {
      if (sourceFiles.length === 0) {
        setSourceFiles([files[0]]);
      } else if (!secondFile) {
        setSecondFile(files[0]);
        setPhase('selecting');
      }
      return;
    }

    setSourceFiles(files);
    
    if (isCompressTool || isProtectTool || isWatermarkTool || isPageNumberTool) {
      setPhase('selecting'); 
    } 
    else if (files.some(f => f.type === 'application/pdf') || isWordToPdf) {
      await loadDocumentPages(files, isWordToPdf);
    } 
    else {
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
    if (isCompareTool) {
      run([sourceFiles[0], secondFile], config);
      return;
    }

    const isConfigOnly = isCompressTool || isProtectTool || isWatermarkTool || isPageNumberTool;
    if (isConfigOnly) {
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
    toast({ title: "Export Complete", description: "Asset successfully retrieved." });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" className="space-y-8">
                  {isCompareTool ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                          <Badge className="bg-primary/10 text-primary border-none">Slot 1</Badge>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-950/40">Original Document</span>
                        </div>
                        {sourceFiles.length > 0 ? (
                          <div className="p-10 bg-white/60 rounded-[2.5rem] border border-black/5 flex items-center justify-between group shadow-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FileText className="w-6 h-6" /></div>
                              <p className="font-black text-sm uppercase tracking-tighter truncate max-w-[180px]">{sourceFiles[0].name}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setSourceFiles([])} className="text-red-500 hover:bg-red-50 transition-all uppercase text-[9px] font-black tracking-widest">Discard</Button>
                          </div>
                        ) : (
                          <DropZone onFiles={handleFilesAdded} accept="application/pdf" />
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Slot 2</Badge>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-950/40">Modified Asset</span>
                        </div>
                        {secondFile ? (
                          <div className="p-10 bg-white/60 rounded-[2.5rem] border border-black/5 flex items-center justify-between group shadow-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600"><FileText className="w-6 h-6" /></div>
                              <p className="font-black text-sm uppercase tracking-tighter truncate max-w-[180px]">{secondFile.name}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setSecondFile(null)} className="text-red-500 hover:bg-red-50 transition-all uppercase text-[9px] font-black tracking-widest">Discard</Button>
                          </div>
                        ) : (
                          <DropZone onFiles={handleFilesAdded} accept="application/pdf" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <DropZone onFiles={handleFilesAdded} accept={isWordToPdf ? ".doc,.docx,.odt,.rtf" : "*/*"} />
                  )}
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
                      {/* TOOL CONFIGURATION PANELS */}
                      {(isCompressTool || isProtectTool || isWatermarkTool || isPageNumberTool || isCompareTool) && (
                        <section className="bg-white/60 p-10 rounded-[3rem] border border-black/5 shadow-2xl backdrop-blur-3xl space-y-10 max-w-4xl mx-auto w-full">
                          <div className="flex items-center gap-4 text-primary border-b border-black/5 pb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                              {isCompareTool ? <GitCompare className="w-7 h-7" /> : <Settings2 className="w-7 h-7" />}
                            </div>
                            <div>
                              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">{tool?.name}</h3>
                              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Execution Configuration</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                              {isCompareTool && (
                                <>
                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Comparison Protocol</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button variant="outline" onClick={() => setConfig({...config, compareMode: 'semantic'})} className={cn("h-11 text-[9px] font-black uppercase rounded-xl", config.compareMode === 'semantic' ? "bg-primary text-white" : "bg-black/5 border-none")}>Semantic (Text)</Button>
                                      <Button variant="outline" onClick={() => setConfig({...config, compareMode: 'visual'})} className={cn("h-11 text-[9px] font-black uppercase rounded-xl", config.compareMode === 'visual' ? "bg-primary text-white" : "bg-black/5 border-none")}>Structural (Layout)</Button>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between">
                                      <span>Sensitivity Index</span>
                                      <span>{config.compareSensitivity}%</span>
                                    </Label>
                                    <Slider value={[config.compareSensitivity]} onValueChange={([v]) => setConfig({...config, compareSensitivity: v})} max={100} min={0} step={1} />
                                  </div>
                                </>
                              )}

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
                                      <select value={config.targetUnit} onChange={(e) => setConfig({...config, targetUnit: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-black text-[10px] px-4">
                                        <option value="KB">KB</option><option value="MB">MB</option>
                                      </select>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {isProtectTool && (
                                <div className="space-y-4">
                                  <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Set Encryption Password</Label>
                                  <Input type="password" placeholder="••••••••" value={config.password} onChange={(e) => setConfig({...config, password: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-bold" />
                                </div>
                              )}

                              {isWatermarkTool && (
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Overlay Text</Label>
                                    <Input value={config.watermarkText} onChange={(e) => setConfig({...config, watermarkText: e.target.value})} className="h-12 bg-black/5 border-none rounded-2xl font-bold" />
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex justify-between"><span>Opacity</span><span>{config.watermarkOpacity}%</span></Label>
                                    <Slider value={[config.watermarkOpacity]} onValueChange={([v]) => setConfig({...config, watermarkOpacity: v})} max={100} />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-6">
                              <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-black uppercase tracking-widest">Execute Buffer Sync</p>
                                  <Switch checked={config.strongCompression} onCheckedChange={(v) => setConfig({...config, strongCompression: v})} />
                                </div>
                                <div className="flex items-start gap-3 opacity-60">
                                  <Info className="w-4 h-4 mt-0.5 text-primary" />
                                  <p className="text-[9px] font-bold uppercase leading-relaxed">System executes high-fidelity binary reconstruction. No data leaves your secure local buffer.</p>
                                </div>
                              </div>
                              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center gap-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Local Pipeline Calibration Stable</span>
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* PAGE SELECTION GRID */}
                      {pages.length > 0 && !isCompareTool && (
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
                          disabled={(pages.length > 0 && selectedPages.size === 0) || (isCompareTool && !secondFile)}
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
                        <h3 className="text-xl font-black uppercase tracking-tighter">Processing Module...</h3>
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
                      <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest mt-2 leading-relaxed">Professional Result Calibrated and Ready for Retrival.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleDownload} className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all gap-4"><Download className="w-5 h-5" /> Download Result</Button>
                      <Link href="/dashboard/pdf-editor">
                        <Button variant="outline" className="h-16 px-12 border-primary/20 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-xl hover:scale-105 transition-all"><Edit3 className="w-5 h-5" /> Open in Editor</Button>
                      </Link>
                      <Button variant="ghost" onClick={reset} className="h-16 px-8 text-slate-950/40 font-black text-xs uppercase tracking-widest">New Interaction</Button>
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
