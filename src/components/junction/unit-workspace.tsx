"use client";

import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { 
  Settings2, 
  Lock, 
  Scissors, 
  RotateCw, 
  ShieldCheck, 
  Cpu, 
  Layers,
  Globe,
  GitCompare,
  EyeOff,
  GripVertical,
  X,
  Plus,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Professional Autonomous Hub
 * Automatically configures protocol based on Tool Identity and Execution Context.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Prep Queue for Multi-file Ops (Merge)
  const [prepQueue, setPrepQueue] = useState<File[]>([]);
  
  // Advanced Tool Parameters
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1-5');
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'range'>('range');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [compressionProfile, setCompressionProfile] = useState('balanced');
  const [dpi, setDpi] = useState('150');
  const [quality, setQuality] = useState(90);
  
  // Comparison & Redaction
  const [compareMode, setCompareMode] = useState('visual');
  const [redactSensitive, setRedactSensitive] = useState(true);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    if (initialUnitId === 'merge-pdf') {
      setPrepQueue(prev => [...prev, ...files]);
      return;
    }

    // Direct process for single-file tools
    executeJob(files);
  };

  const executeJob = (files: File[]) => {
    let from = '';
    let to = 'PDF';

    if (initialUnitId?.includes('-pdf')) {
      from = initialUnitId.split('-')[0];
    } else if (initialUnitId?.startsWith('pdf-')) {
      from = 'pdf';
      to = initialUnitId.split('-')[1].toUpperCase();
      if (to === 'PDFA') to = 'PDF'; 
    } else {
      from = 'pdf';
      to = 'PDF';
    }

    const settings = { 
      profile: compressionProfile,
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      splitMode,
      splitValue: pageRange,
      pages: pageRange.split(',').map(p => parseInt(p.trim()) - 1).filter(p => !isNaN(p)),
      dpi: parseInt(dpi),
      quality,
      compareMode,
      redactSensitive
    };

    engine.addJobs(files, from, to, settings, initialUnitId);
  };

  const handleMergeStart = () => {
    if (prepQueue.length < 2) return;
    executeJob(prepQueue);
    setPrepQueue([]); // Clear prep once sent to engine
  };

  const removePrepItem = (idx: number) => {
    setPrepQueue(prev => prev.filter((_, i) => i !== idx));
  };

  const reorderPrep = (idx: number, dir: 'up' | 'down') => {
    const newQueue = [...prepQueue];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newQueue.length) return;
    [newQueue[idx], newQueue[target]] = [newQueue[target], newQueue[idx]];
    setPrepQueue(newQueue);
  };

  if (!appState) return null;

  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'translate-pdf', 'compress-pdf',
    'unlock-pdf', 'redact-pdf', 'page-numbers', 'crop-pdf', 'pdf-jpg',
    'compare-pdf'
  ].includes(initialUnitId || '');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar 
        active={activeCategory} 
        onSelect={(id) => setActiveCategory(id)} 
      />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 md:p-10 space-y-10 max-w-4xl mx-auto pb-32">
            
            {/* UNIT HEADER */}
            <div className="flex items-center justify-between px-2 animate-in fade-in duration-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">{initialUnitId?.replace('-', ' ')}</h2>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Neural Unit Calibration</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">WASM Layer Active</span>
              </div>
            </div>

            {/* MERGE QUEUE / SEQUENCE MANAGER */}
            {initialUnitId === 'merge-pdf' && (
              <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950/60">Preparation Sequence</h3>
                  <Badge className="bg-primary/10 text-primary border-none">{prepQueue.length} Files Ready</Badge>
                </div>

                {prepQueue.length > 0 ? (
                  <div className="space-y-3">
                    {prepQueue.map((file, i) => (
                      <Card key={i} className="bg-white/40 backdrop-blur-xl border-white/60 group hover:border-primary/20 transition-all shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="flex flex-col gap-1 text-slate-950/20 group-hover:text-primary transition-colors cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-black truncate text-slate-950">{file.name}</p>
                            <p className="text-[9px] font-bold text-slate-950/40 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5" onClick={() => reorderPrep(i, 'up')} disabled={i === 0}>
                              <RotateCw className="w-3.5 h-3.5 rotate-[-90deg]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5" onClick={() => reorderPrep(i, 'down')} disabled={i === prepQueue.length - 1}>
                              <RotateCw className="w-3.5 h-3.5 rotate-90" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-400" onClick={() => removePrepItem(i)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        onClick={handleMergeStart} 
                        disabled={prepQueue.length < 2}
                        className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest gap-3 rounded-2xl shadow-xl shadow-primary/20"
                      >
                        <Play className="w-4 h-4 fill-current" /> Master Merge & Execute
                      </Button>
                      <Button variant="outline" className="h-14 px-8 border-black/10 bg-white/40 text-[10px] font-black uppercase rounded-2xl gap-2">
                        <Plus className="w-4 h-4" /> Add More
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center border-2 border-dashed border-black/5 rounded-[2.5rem] space-y-4 opacity-40">
                    <Layers className="w-12 h-12 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Add at least 2 files to enable merge logic</p>
                  </div>
                )}
              </section>
            )}

            {hasControls && (
              <section className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 px-1">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Unit Parameters</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {initialUnitId === 'translate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Target Language
                      </Label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'].map(l => (
                            <SelectItem key={l} value={l.toLowerCase().substring(0,2)} className="font-bold text-xs">{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'compare-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest flex items-center gap-2">
                        <GitCompare className="w-3 h-3" /> Diff Mode
                      </Label>
                      <Select value={compareMode} onValueChange={setCompareMode}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual" className="font-bold text-xs">Pixel-Level Diff</SelectItem>
                          <SelectItem value="semantic" className="font-bold text-xs">Textual Diff</SelectItem>
                          <SelectItem value="structural" className="font-bold text-xs">Structural Diff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'redact-pdf' && (
                    <div className="space-y-4 col-span-full">
                      <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-black/5">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-950 tracking-widest">Neural Auto-Redact</p>
                          <p className="text-[8px] font-bold text-slate-950/40 uppercase">Identifies PII, Emails, and Phone Numbers</p>
                        </div>
                        <Switch checked={redactSensitive} onCheckedChange={setRedactSensitive} />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'split-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Split Strategy</Label>
                      <Select value={splitMode} onValueChange={(v: any) => setSplitMode(v)}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="range" className="font-bold text-xs">Custom Ranges</SelectItem>
                          <SelectItem value="every" className="font-bold text-xs">Every N Pages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(initialUnitId === 'split-pdf' || initialUnitId === 'extract-pages' || initialUnitId === 'remove-pages') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">{splitMode === 'every' ? 'Interval' : 'Range'}</Label>
                      <Input 
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder={splitMode === 'every' ? "e.g. 2" : "e.g. 1-5, 8-10"} 
                        className="bg-white/60 border-black/5 h-11 font-black rounded-xl text-slate-950"
                      />
                    </div>
                  )}

                  {initialUnitId === 'compress-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Efficiency Level</Label>
                      <Select value={compressionProfile} onValueChange={setCompressionProfile}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality" className="font-bold text-xs">High Fidelity</SelectItem>
                          <SelectItem value="balanced" className="font-bold text-xs">Balanced</SelectItem>
                          <SelectItem value="extreme" className="font-bold text-xs">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(initialUnitId === 'protect-pdf' || initialUnitId === 'unlock-pdf') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Security Pin</Label>
                      <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Cipher key..." 
                        className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950"
                      />
                    </div>
                  )}

                  {initialUnitId === 'rotate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Rotation</Label>
                      <Select value={rotateAngle} onValueChange={setRotateAngle}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90" className="font-bold text-xs">90° CW</SelectItem>
                          <SelectItem value="180" className="font-bold text-xs">180° INV</SelectItem>
                          <SelectItem value="270" className="font-bold text-xs">90° CCW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </section>
            )}

            <DropZone onFiles={handleFilesAdded} />

            {appState.processingQueue.length > 0 && <ProgressSection jobs={appState.processingQueue} />}

            {appState.outputBuffer.length > 0 && (
              <OutputSection 
                jobs={appState.outputBuffer} 
                onPreview={(j) => window.open(j.result?.objectUrl)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
