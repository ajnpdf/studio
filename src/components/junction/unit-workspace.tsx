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
  GripVertical,
  X,
  Plus,
  Play,
  RotateCw,
  Lock,
  ChevronRight,
  Download,
  Share2,
  ExternalLink,
  Wand2,
  Database,
  Layers,
  Activity,
  History,
  Scissors,
  Layout,
  Type,
  FileText,
  Trash2,
  CheckCircle2,
  ArrowUpDown,
  Files,
  Copy,
  BookOpen,
  Camera,
  Maximize,
  Scan,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - High-Fidelity Bento Grid
 * Implements the Master Organize, Merge, Split, Page Removal, and Scan workflows.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Workspace States
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  const [selectionFile, setSelectionFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);

  // Camera Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Organize Logic State
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

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    if (initialUnitId === 'merge-pdf' || initialUnitId === 'scan-to-pdf') {
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')!;
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `Scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPrepQueue(prev => [...prev, file]);
        }
      }, 'image/jpeg', 0.95);
    }
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

  const togglePageSelection = (idx: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
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
      toFmt: to,
      extractionMode,
      actions: organizeStack,
      bwMode
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
    if (prepQueue.length === 0) return;
    executeJob(prepQueue);
    setPrepQueue([]);
    if (isCameraActive) stopCamera();
  };

  // Organize Operations
  const movePage = (idx: number, direction: 'left' | 'right') => {
    const next = [...organizeStack];
    const target = direction === 'left' ? idx - 1 : idx + 1;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrganizeStack(next);
  };

  const rotatePageInStack = (idx: number) => {
    const next = [...organizeStack];
    next[idx] = { ...next[idx], rotation: (next[idx].rotation + 90) % 360 };
    setOrganizeStack(next);
  };

  const duplicatePage = (idx: number) => {
    const next = [...organizeStack];
    next.splice(idx + 1, 0, { ...next[idx], isDuplicate: true });
    setOrganizeStack(next);
  };

  const removePageFromStack = (idx: number) => {
    const next = [...organizeStack];
    next.splice(idx, 1);
    setOrganizeStack(next);
  };

  const insertBlankPage = (idx: number) => {
    const next = [...organizeStack];
    next.splice(idx + 1, 0, { originalIndex: -1, rotation: 0, isBlank: true });
    setOrganizeStack(next);
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
              {/* Header Sector */}
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
                  
                  {/* SCAN TO PDF UI */}
                  {initialUnitId === 'scan-to-pdf' && (
                    <section className="space-y-8">
                      {!isCameraActive ? (
                        <Card className="bg-white/40 backdrop-blur-2xl border-2 border-black/5 rounded-[3rem] overflow-hidden shadow-2xl">
                          <CardContent className="p-12 text-center space-y-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                              <Camera className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-black uppercase tracking-tighter">Capture Blueprint</h3>
                              <p className="text-sm font-medium text-slate-950/40 uppercase tracking-widest">Connect to visual input device for live scanning</p>
                            </div>
                            <div className="flex justify-center gap-4">
                              <Button onClick={startCamera} className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 gap-3">
                                <Zap className="w-4 h-4 fill-current" /> Initialize Camera
                              </Button>
                              <div className="relative">
                                <Button variant="outline" onClick={() => document.getElementById('scan-upload')?.click()} className="h-14 px-10 border-black/10 font-black text-sm uppercase tracking-widest rounded-2xl bg-white/40">
                                  Upload Photos
                                </Button>
                                <input id="scan-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFilesAdded(Array.from(e.target.files))} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-6">
                          <Card className="bg-black rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/80 relative">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full aspect-[4/3] object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                            
                            {/* Scanning Overlay HUD */}
                            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                              <div className="w-full h-full border-2 border-white/20 border-dashed relative">
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary" />
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary" />
                              </div>
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-auto">
                              <Button size="icon" onClick={stopCamera} className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 shadow-xl"><X className="w-6 h-6" /></Button>
                              <Button onClick={captureFrame} className="h-20 w-20 rounded-full bg-white border-8 border-primary/20 shadow-2xl flex items-center justify-center group active:scale-95 transition-all">
                                <div className="w-12 h-12 rounded-full bg-primary group-hover:scale-110 transition-transform" />
                              </Button>
                              <div className="w-12 h-12" />
                            </div>
                          </Card>

                          {hasCameraPermission === false && (
                            <Alert variant="destructive" className="rounded-2xl border-2">
                              <AlertTitle className="font-black uppercase tracking-tighter">Access Denied</AlertTitle>
                              <AlertDescription className="font-bold uppercase text-[10px]">Please enable camera permissions in browser settings.</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {prepQueue.length > 0 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                          <div className="flex items-center justify-between px-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-950/60">Capture Buffer ({prepQueue.length})</h3>
                            <Button variant="ghost" onClick={() => setPrepQueue([])} className="text-[10px] font-black uppercase text-red-500 hover:bg-red-50">Purge Buffer</Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {prepQueue.map((file, i) => (
                              <Card key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-black/5 group">
                                <img src={URL.createObjectURL(file)} className="aspect-square object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button size="icon" variant="destructive" onClick={() => setPrepQueue(prev => prev.filter((_, idx) => idx !== i))} className="h-8 w-8 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </Card>
                            ))}
                            <button onClick={() => isCameraActive ? captureFrame() : startCamera()} className="aspect-square rounded-2xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-2 hover:bg-black/5 transition-all text-slate-950/40">
                              <Plus className="w-6 h-6" />
                              <span className="text-[9px] font-black uppercase">Add Frame</span>
                            </button>
                          </div>
                          <Button onClick={handleBatchExecute} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/30 gap-3">
                            <CheckCircle2 className="w-5 h-5" /> Assemble Master Scan
                          </Button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* ORGANIZE WORKSPACE UI */}
                  {initialUnitId === 'organize-pdf' && selectionFile && (
                    <section className="space-y-8">
                      <div className="flex h-[600px] border-2 border-black/5 rounded-[3rem] overflow-hidden bg-white/40 backdrop-blur-2xl shadow-2xl">
                        {/* Bookmark Panel */}
                        <aside className="w-64 border-r border-black/5 flex flex-col shrink-0 bg-white/20">
                          <header className="p-6 border-b border-black/5 flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Outline Tree</span>
                          </header>
                          <div className="flex-1 p-6 text-center space-y-4 opacity-40">
                            <Layers className="w-8 h-8 mx-auto" />
                            <p className="text-[9px] font-black uppercase leading-relaxed">Hierarchical bookmark synchronization active.</p>
                          </div>
                        </aside>

                        {/* Page Draggable Grid */}
                        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                          {isLoadingThumbs ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
                              <RotateCw className="w-10 h-10 animate-spin text-primary" />
                              <p className="text-[10px] font-black uppercase tracking-widest">Generating Visual Grid...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {organizeStack.map((action, i) => (
                                <motion.div 
                                  key={`${action.originalIndex}-${i}`}
                                  layout
                                  className="group relative aspect-[1/1.4] bg-white rounded-2xl border-2 border-black/5 overflow-hidden shadow-xl hover:border-primary/40 transition-all"
                                >
                                  {action.isBlank ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black/[0.02]">
                                      <FileText className="w-10 h-10 text-black/5" />
                                      <span className="absolute top-3 left-3 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">BLANK</span>
                                    </div>
                                  ) : (
                                    <img 
                                      src={thumbnails[action.originalIndex]} 
                                      className="w-full h-full object-cover transition-transform duration-500" 
                                      style={{ transform: `rotate(${action.rotation}deg)` }}
                                    />
                                  )}
                                  
                                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black text-white">{i + 1}</div>
                                  
                                  {/* Quick Control HUD */}
                                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                    <div className="flex gap-2">
                                      <Button size="icon" variant="secondary" onClick={() => movePage(i, 'left')} disabled={i === 0} className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg"><ChevronRight className="w-4 h-4 rotate-180" /></Button>
                                      <Button size="icon" variant="secondary" onClick={() => movePage(i, 'right')} disabled={i === organizeStack.length - 1} className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="icon" variant="secondary" onClick={() => rotatePageInStack(i)} className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg"><RotateCw className="w-4 h-4" /></Button>
                                      <Button size="icon" variant="secondary" onClick={() => duplicatePage(i)} className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Copy className="w-4 h-4" /></Button>
                                      <Button size="icon" variant="secondary" onClick={() => insertBlankPage(i)} className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Plus className="w-4 h-4" /></Button>
                                    </div>
                                    <Button size="icon" variant="destructive" onClick={() => removePageFromStack(i)} className="h-8 w-8 bg-red-500/20 hover:bg-red-500 text-white rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </main>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          onClick={handleSelectionExecute} 
                          className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30"
                        >
                          <Play className="w-4 h-4 fill-current" /> Execute Organization Mastery
                        </Button>
                        <Button variant="outline" onClick={() => { setSelectionFile(null); setThumbnails([]); setOrganizeStack([]); }} className="h-14 px-8 border-black/10 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-500">
                          Reset Grid
                        </Button>
                      </div>
                    </section>
                  )}

                  {/* MERGE SEQUENCE UI */}
                  {initialUnitId === 'merge-pdf' && (
                    <section className="space-y-6">
                      {prepQueue.length > 0 && (
                        <div className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {prepQueue.map((file, i) => (
                              <motion.div 
                                key={`${file.name}-${i}`} 
                                layout 
                                initial={{ x: -20, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                              >
                                <Card className="bg-white/50 backdrop-blur-2xl border-black/5 hover:border-primary/30 transition-all rounded-2xl overflow-hidden border-2">
                                  <CardContent className="p-4 flex items-center gap-6">
                                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center font-black text-xs border border-black/5">{i + 1}</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-black truncate text-slate-950 uppercase">{file.name}</p>
                                      <p className="text-[9px] font-black text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setPrepQueue(prev => prev.filter((_, idx) => idx !== i))} className="h-10 w-10 text-slate-950/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X className="w-5 h-5" /></Button>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          <div className="pt-4 flex gap-4">
                            <Button onClick={handleBatchExecute} className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30">
                              <Play className="w-4 h-4 fill-current" /> Execute Master Merge
                            </Button>
                            <Button variant="outline" onClick={() => setPrepQueue([])} className="h-14 px-8 border-black/10 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-500">Reset</Button>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {/* REMOVE / EXTRACT PAGE GRID UI */}
                  {(initialUnitId === 'remove-pages' || initialUnitId === 'extract-pages') && selectionFile && (
                    <section className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary" />
                          <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950/60">
                            {initialUnitId === 'remove-pages' ? 'Purge Selection' : 'Extraction Selection'}
                          </h3>
                        </div>
                        <Badge className="bg-primary text-white border-none text-[10px] font-black px-3 h-6 rounded-full">
                          {initialUnitId === 'remove-pages' 
                            ? `Purging ${selectedPages.size} → ${thumbnails.length - selectedPages.size} Remaining`
                            : `Extracting ${selectedPages.size} Pages`
                          }
                        </Badge>
                      </div>

                      {isLoadingThumbs ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-40">
                          <RotateCw className="w-10 h-10 animate-spin text-primary" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Generating Visual Grid...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide p-4 bg-black/5 rounded-[2rem] border border-black/5">
                          {thumbnails.map((thumb, i) => (
                            <div 
                              key={i} 
                              onClick={() => togglePageSelection(i)}
                              className={cn(
                                "relative aspect-[1/1.4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-lg hover:scale-[1.02]",
                                selectedPages.has(i) 
                                  ? initialUnitId === 'remove-pages' ? "border-red-500 scale-95 opacity-80" : "border-emerald-500 scale-105"
                                  : "border-white/20 hover:border-primary/40"
                              )}
                            >
                              <img src={thumb} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black text-white">{i + 1}</div>
                              {selectedPages.has(i) && (
                                <div className={cn(
                                  "absolute inset-0 flex items-center justify-center backdrop-blur-[2px]",
                                  initialUnitId === 'remove-pages' ? "bg-red-500/40" : "bg-emerald-500/40"
                                )}>
                                  {initialUnitId === 'remove-pages' ? <Trash2 className="w-8 h-8 text-white" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button 
                          onClick={handleSelectionExecute} 
                          disabled={selectedPages.size === 0}
                          className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/30"
                        >
                          <Play className="w-4 h-4 fill-current" /> 
                          {initialUnitId === 'remove-pages' ? 'Execute Master Purge' : 'Execute Extraction'}
                        </Button>
                        <Button variant="outline" onClick={() => { setSelectionFile(null); setThumbnails([]); setSelectedPages(new Set()); }} className="h-14 px-8 border-black/10 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-500">
                          Discard Selection
                        </Button>
                      </div>
                    </section>
                  )}

                  {!selectionFile && !isCameraActive && <DropZone onFiles={handleFilesAdded} />}
                </div>

                {/* Parameters Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <section className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                      <Settings2 className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      {initialUnitId === 'scan-to-pdf' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Monochrome Output</p>
                              <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Apply Otsu Binarization</p>
                            </div>
                            <Switch checked={bwMode} onCheckedChange={setBwMode} className="data-[state=checked]:bg-primary" />
                          </div>
                          <div className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Neural OCR</p>
                              <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Generate Searchable Layer</p>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'split-pdf' && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Split Protocol</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {[{ id: 'every', label: 'Every N', icon: Scissors }, { id: 'range', label: 'Range', icon: Layout }].map(m => (
                                <button key={m.id} onClick={() => setSplitMode(m.id as any)} className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2", splitMode === m.id ? "bg-primary text-white border-primary shadow-lg" : "bg-white/40 border-black/5 text-slate-950/40 hover:bg-white/60")}>
                                  <m.icon className="w-4 h-4" />
                                  <span className="text-[8px] font-black uppercase">{m.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Input value={splitMode === 'range' ? pageRange : splitValue} onChange={(e) => splitMode === 'range' ? setPageRange(e.target.value) : setSplitValue(e.target.value)} className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs shadow-sm" placeholder={splitMode === 'range' ? "e.g. 1-5, 8-12" : "Number of pages..."} />
                        </div>
                      )}

                      {initialUnitId === 'extract-pages' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-5 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Discrete Extraction</p>
                              <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Output ZIP of Individual PDFs</p>
                            </div>
                            <Switch 
                              checked={extractionMode === 'batch'} 
                              onCheckedChange={(v) => setExtractionMode(v ? 'batch' : 'single')} 
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'protect-pdf' && (
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Master Password</Label>
                          <div className="relative">
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-white/60 border-black/5 h-12 rounded-2xl font-black text-xs shadow-sm pl-12" />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40" />
                          </div>
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
