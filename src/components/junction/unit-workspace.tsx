"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { PageAction } from '@/lib/converters/pdf-manipulator';
import { 
  Settings2, 
  ShieldCheck, 
  Cpu, 
  X, 
  Plus, 
  Play, 
  RotateCw, 
  Lock, 
  ChevronRight, 
  Wand2, 
  Database, 
  Layers, 
  Activity, 
  Scissors, 
  Layout, 
  Type, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  BookOpen, 
  Camera, 
  Maximize, 
  RefreshCw, 
  Zap,
  Globe,
  Code2,
  ImageIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Master Technical Implementation
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  const [selectionFile, setSelectionFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [organizeStack, setOrganizeStack] = useState<PageAction[]>([]);

  // Parameter States
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('');
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'equal'>('every');
  const [splitValue, setSplitValue] = useState('1');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [extractionMode, setExtractionMode] = useState<'single' | 'batch'>('single');
  const [bwMode, setBwMode] = useState(false);
  const [quality, setQuality] = useState(85);
  const [targetDpi, setTargetDpi] = useState(300);
  const [outputFormat, setOutputFormat] = useState('JPG');
  const [aiAssist, setAiAssist] = useState(true);
  
  const [fitMode, setFitMode] = useState<'FIT' | 'FILL' | 'STRETCH' | 'ORIGINAL'>('FIT');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margins, setMargins] = useState(40);

  const [handoutMode, setHandoutMode] = useState(false);

  const [htmlInputType, setHtmlInputType] = useState<'url' | 'paste' | 'file'>('url');
  const [htmlUrl, setHtmlUrl] = useState('');
  const [htmlPaste, setHtmlPaste] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [executeJs, setHtmlJs] = useState(false);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    if (initialUnitId === 'merge-pdf' || initialUnitId === 'scan-to-pdf' || initialUnitId === 'jpg-pdf' || initialUnitId === 'jpg2pdf') {
      setPrepQueue(prev => [...prev, ...files]);
      return;
    }

    if (initialUnitId === 'remove-pages' || initialUnitId === 'extract-pages' || initialUnitId === 'organize-pdf') {
      const file = files[0];
      setSelectionFile(file);
      generateThumbnails(file);
      return;
    }

    executeJob(files);
  };

  const generateThumbnails = async (file: File) => {
    setIsLoadingThumbs(true);
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const thumbs: string[] = [];
      const initialActions: PageAction[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL());
        initialActions.push({ originalIndex: i - 1, rotation: 0 });
      }
      setThumbnails(thumbs);
      setOrganizeStack(initialActions);
    } catch (err) {
      console.error("Thumbnail generation failed", err);
    } finally {
      setIsLoadingThumbs(false);
    }
  };

  const executeJob = (files: File[]) => {
    let from = '';
    let to = 'PDF';

    if (initialUnitId?.includes('-pdf')) {
      from = initialUnitId.split('-')[0];
    } else if (initialUnitId?.startsWith('pdf-')) {
      from = 'pdf';
      to = initialUnitId.split('-')[1].toUpperCase();
    }

    const settings = { 
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      splitMode,
      splitValue: splitMode === 'range' ? pageRange : splitValue,
      length: summaryLength,
      pages: Array.from(selectedPages),
      toFmt: to === 'JPG' ? outputFormat : to,
      quality: to === 'JPG' ? targetDpi : quality,
      extractionMode,
      actions: organizeStack,
      bwMode,
      aiAssist,
      fitMode,
      orientation,
      margins,
      handoutMode,
      htmlUrl: htmlInputType === 'url' ? htmlUrl : null,
      htmlContent: htmlInputType === 'paste' ? htmlPaste : null,
      customCss,
      executeJs
    };

    engine.addJobs(files, from, to, settings, initialUnitId);
  };

  const handleSelectionExecute = () => {
    if (!selectionFile) return;
    executeJob([selectionFile]);
    setSelectionFile(null);
    setThumbnails([]);
    setSelectedPages(new Set());
  };

  const handleBatchExecute = () => {
    if (initialUnitId === 'html-pdf') { executeJob([]); return; }
    if (prepQueue.length === 0) return;
    executeJob(prepQueue);
    setPrepQueue([]);
  };

  if (!appState) return null;

  const unitDisplayName = initialUnitId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={initialUnitId}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40"
            >
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl">
                    <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase leading-none">{unitDisplayName}</h2>
                    <p className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.4em]">Master System Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Environment Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  {/* CENTRAL DROP ZONE / WORKSPACE */}
                  {!selectionFile && (prepQueue.length === 0 || !['merge-pdf', 'scan-to-pdf', 'jpg-pdf'].includes(initialUnitId || '')) && initialUnitId !== 'html-pdf' && (
                    <DropZone onFiles={handleFilesAdded} />
                  )}

                  {/* REMOVE / EXTRACT PAGE GRID */}
                  {(initialUnitId === 'remove-pages' || initialUnitId === 'extract-pages') && selectionFile && (
                    <section className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide p-4 bg-black/5 rounded-[2rem] border border-black/5">
                        {thumbnails.map((thumb, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedPages(prev => {
                              const next = new Set(prev);
                              if (next.has(i)) next.delete(i); else next.add(i);
                              return next;
                            })}
                            className={cn(
                              "relative aspect-[1/1.4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-lg",
                              selectedPages.has(i) 
                                ? initialUnitId === 'remove-pages' ? "border-red-500 scale-95" : "border-emerald-500 scale-105"
                                : "border-white/20"
                            )}
                          >
                            <img src={thumb} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black text-white">{i + 1}</div>
                          </div>
                        ))}
                      </div>
                      <Button onClick={handleSelectionExecute} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl gap-3">
                        <Play className="w-4 h-4 fill-current" /> Execute Extraction Sequence
                      </Button>
                    </section>
                  )}

                  {/* MERGE SEQUENCE */}
                  {initialUnitId === 'merge-pdf' && prepQueue.length > 0 && (
                    <section className="space-y-4">
                      {prepQueue.map((file, i) => (
                        <Card key={i} className="bg-white/50 border-black/5 rounded-2xl overflow-hidden border-2 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className="bg-primary/10 text-primary border-none">{i+1}</Badge>
                            <span className="text-sm font-black uppercase truncate">{file.name}</span>
                          </div>
                          <Button variant="ghost" onClick={() => setPrepQueue(q => q.filter((_, idx) => idx !== i))}><X className="w-4 h-4" /></Button>
                        </Card>
                      ))}
                      <Button onClick={handleBatchExecute} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl gap-3">
                        <Play className="w-4 h-4 fill-current" /> Execute Master Merge
                      </Button>
                    </section>
                  )}
                </div>

                {/* PARAMETERS SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                  <section className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                      <Settings2 className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      {initialUnitId === 'pdf-jpg' && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Master Output Format</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {['JPG', 'PNG', 'WEBP'].map(f => (
                                <button key={f} onClick={() => setOutputFormat(f)} className={cn("px-4 py-2 rounded-xl border-2 text-[9px] font-black uppercase transition-all", outputFormat === f ? "bg-primary text-white border-primary shadow-lg" : "bg-white/40 border-black/5 text-slate-950/40")}>{f}</button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Target DPI Calibration</Label>
                            <Select value={targetDpi.toString()} onValueChange={(v) => setTargetDpi(parseInt(v))}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-xs shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="72">72 DPI (Draft)</SelectItem>
                                <SelectItem value="150">150 DPI (Web)</SelectItem>
                                <SelectItem value="300">300 DPI (Master)</SelectItem>
                                <SelectItem value="600">600 DPI (Print)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'pdf-word' && (
                        <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Master Reconstruction</p>
                          </div>
                          <p className="text-[9px] font-bold text-slate-950/40 uppercase leading-relaxed">
                            System will execute text span clustering and paragraph inheritance resolution to rebuild OOXML document hierarchy.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  <ProgressSection jobs={appState.queue} />
                </div>
              </div>

              {appState.outputs.length > 0 && (
                <OutputSection jobs={appState.outputs} onPreview={(j) => window.open(j.objectUrl)} onClear={() => engine.clearQueue()} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
