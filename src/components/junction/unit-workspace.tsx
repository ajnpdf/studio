"use client";

import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { FormatSelector } from '@/components/dashboard/conversion/format-selector';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { 
  Menu,
  Lock,
  Type,
  Scissors,
  RotateCw,
  Globe,
  Settings2,
  ShieldCheck,
  Zap,
  Activity,
  Workflow,
  Hash,
  Crop,
  Search,
  Signature,
  EyeOff,
  GitCompare,
  Trash2,
  GripVertical,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN UNIT WORKSPACE - CORE INTELLIGENCE LAYER
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Advanced Parameters
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [compressionLevel, setCompressionLevel] = useState(80);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  useEffect(() => {
    if (!initialUnitId) return;
    if (initialUnitId.includes('-pdf')) {
      const from = initialUnitId.split('-')[0].toUpperCase();
      setFromFmt(from === 'MERGE' || from === 'SPLIT' || from === 'ORGANIZE' ? 'PDF' : from);
      setToFmt('PDF');
    } else if (initialUnitId.startsWith('pdf-')) {
      const to = initialUnitId.split('-')[1].toUpperCase();
      setFromFmt('PDF');
      setToFmt(to === 'PDFA' ? 'PDF' : to);
    } else {
      setFromFmt('PDF');
      setToFmt('PDF');
    }
  }, [initialUnitId]);

  const handleFilesAdded = (files: File[]) => {
    const settings = { 
      quality: compressionLevel,
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      pages: pageRange.split(',').map(p => parseInt(p.trim()) - 1).filter(p => !isNaN(p))
    };
    engine.addJobs(files, fromFmt, toFmt, settings, initialUnitId);
  };

  if (!appState) return null;

  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'translate-pdf', 'compress-pdf',
    'unlock-pdf', 'redact-pdf', 'page-numbers', 'crop-pdf'
  ].includes(initialUnitId || '');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative font-body text-slate-950">
      <div className={cn(
        "fixed inset-y-0 left-0 z-[80] lg:relative lg:z-0 lg:block transition-transform duration-500",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <CategorySidebar 
          active={activeCategory} 
          onSelect={(id) => { setActiveCategory(id); setMobileMenuOpen(false); }} 
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 md:p-10 space-y-8 max-w-4xl mx-auto pb-32">
            
            {/* Merge UI — Drag-to-Reorder Interface */}
            {initialUnitId === 'merge-pdf' && appState.activeFiles.length > 0 && (
              <section className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest">WASM CONTEXT</Badge>
                    <span className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Sequence Order</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black text-slate-950/40 hover:text-slate-950 uppercase">Reverse Order</Button>
                </div>
                <div className="space-y-2">
                  {appState.activeFiles.map((fb, idx) => (
                    <Card key={fb.id} className="bg-white/40 border-white/60 shadow-sm group">
                      <CardContent className="p-3 flex items-center gap-4">
                        <GripVertical className="w-4 h-4 text-slate-950/20 cursor-grab active:cursor-grabbing" />
                        <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center font-black text-xs text-slate-950/40">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black truncate">{fb.metadata.name}</p>
                          <p className="text-[9px] font-bold text-slate-950/40 uppercase">{fb.metadata.size} • {fb.metadata.format}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-950/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Neural Parameters */}
            {hasControls && (
              <section className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 px-1">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Neural Parameters</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(initialUnitId === 'protect-pdf' || initialUnitId === 'unlock-pdf') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest ml-1">Cryptographic Key</Label>
                      <div className="relative group">
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Passphrase..." 
                          className="bg-white/60 border-black/5 h-11 pl-10 focus:ring-primary/20 rounded-xl font-bold text-slate-950"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {(initialUnitId === 'split-pdf' || initialUnitId === 'extract-pages' || initialUnitId === 'remove-pages') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest ml-1">Neural Page Range</Label>
                      <div className="relative group">
                        <Input 
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g. 1, 3, 5-8" 
                          className="bg-white/60 border-black/5 h-11 pl-10 font-black rounded-xl focus:ring-primary/20 text-slate-950"
                        />
                        <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'rotate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest ml-1">Geometric Angle</Label>
                      <Select value={rotateAngle} onValueChange={setRotateAngle}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl focus:ring-primary/20 text-slate-950 font-bold">
                          <RotateCw className="w-3.5 h-3.5 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-black/5 rounded-xl">
                          <SelectItem value="90" className="font-bold text-xs">90° Clockwise</SelectItem>
                          <SelectItem value="180" className="font-bold text-xs">180° Invert</SelectItem>
                          <SelectItem value="270" className="font-bold text-xs">90° Counter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'watermark-pdf' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest ml-1">Stamp Identification</Label>
                      <div className="relative group">
                        <Input 
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter text..." 
                          className="bg-white/60 border-black/5 h-11 pl-10 font-black rounded-xl focus:ring-primary/20 text-slate-950"
                        />
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'translate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest ml-1">Neural Language</Label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl focus:ring-primary/20 text-slate-950 font-bold">
                          <Globe className="w-3.5 h-3.5 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-black/5 rounded-xl">
                          <SelectItem value="es" className="font-bold text-xs">Spanish</SelectItem>
                          <SelectItem value="fr" className="font-bold text-xs">French</SelectItem>
                          <SelectItem value="de" className="font-bold text-xs">German</SelectItem>
                          <SelectItem value="jp" className="font-bold text-xs">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'compress-pdf' && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Mastery Intensity</Label>
                        <span className="text-[10px] font-black text-primary">{compressionLevel}%</span>
                      </div>
                      <Slider 
                        value={[compressionLevel]} 
                        onValueChange={([v]) => setCompressionLevel(v)}
                        max={100}
                        step={1}
                        className="py-2"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Protocol Hub */}
            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
              isSourceLocked={true}
            />

            {/* Ingestion Zone */}
            <DropZone onFiles={handleFilesAdded} />

            {/* Live Orchestration Streams */}
            {appState.processingQueue.length > 0 && <ProgressSection jobs={appState.processingQueue} />}

            {/* Final Distribution Layer */}
            {appState.outputBuffer.length > 0 && (
              <OutputSection 
                jobs={appState.outputBuffer} 
                onPreview={(j) => console.log('Inspect Binary', j)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
