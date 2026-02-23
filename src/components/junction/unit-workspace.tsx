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
  Zap, 
  Monitor,
  Layout,
  Maximize,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Hash,
  Type,
  Palette,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Autonomous Intelligence Engine
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  
  // Advanced Tool Parameters
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN Private');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1-5');
  const [splitMode, setSplitMode] = useState<'range' | 'every'>('range');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [compressionProfile, setCompressionProfile] = useState('balanced');
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('auto');
  const [dpi, setDpi] = useState('150');
  const [quality, setQuality] = useState(90);
  
  // Page Numbering Settings
  const [numPosition, setNumPosition] = useState('footer-center');
  const [numFormat, setNumFormat] = useState('Page {n} of {N}');
  const [numStart, setNumStart] = useState(1);
  const [numColor, setNumColor] = useState('#000000');
  const [skipFirst, setSkipFirst] = useState(false);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  useEffect(() => {
    if (!initialUnitId) return;
    if (initialUnitId.includes('-pdf')) {
      const from = initialUnitId.split('-')[0].toUpperCase();
      setFromFmt(from === 'MERGE' || from === 'SPLIT' || from === 'ORGANIZE' || from === 'REMOVE' || from === 'EXTRACT' ? 'PDF' : from);
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
      profile: compressionProfile,
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      splitMode,
      splitValue: pageRange,
      pages: pageRange.split(',').map(p => parseInt(p.trim()) - 1).filter(p => !isNaN(p)),
      pageSize,
      orientation,
      dpi: parseInt(dpi),
      quality,
      position: numPosition,
      format: numFormat,
      startNumber: numStart,
      color: numColor,
      skipFirst
    };
    engine.addJobs(files, fromFmt, toFmt, settings, initialUnitId);
  };

  if (!appState) return null;

  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'translate-pdf', 'compress-pdf',
    'unlock-pdf', 'redact-pdf', 'page-numbers', 'crop-pdf', 'jpg-pdf',
    'word-pdf', 'pptx-pdf', 'excel-pdf', 'html-pdf', 'pdf-jpg', 'pdf-word',
    'pdf-excel', 'pdf-pptx', 'pdf-pdfa'
  ].includes(initialUnitId || '');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950">
      <CategorySidebar 
        active={activeCategory} 
        onSelect={(id) => setActiveCategory(id)} 
      />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 md:p-10 space-y-10 max-w-4xl mx-auto pb-32">
            
            <div className="flex items-center justify-between px-2 animate-in fade-in duration-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">{initialUnitId?.replace('-', ' ')} Node</h2>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Autonomous Protocol Calibration</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">WASM Stable</span>
              </div>
            </div>

            {hasControls && (
              <section className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 px-1">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Neural Parameters</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {initialUnitId === 'pdf-jpg' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Export Resolution</Label>
                        <Select value={dpi} onValueChange={setDpi}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="72" className="font-bold text-xs">72 DPI (Web)</SelectItem>
                            <SelectItem value="150" className="font-bold text-xs">150 DPI (Print)</SelectItem>
                            <SelectItem value="300" className="font-bold text-xs">300 DPI (High Res)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Quality: {quality}%</Label>
                        <Slider value={[quality]} max={100} onValueChange={([v]) => setQuality(v)} />
                      </div>
                    </>
                  )}

                  {initialUnitId === 'page-numbers' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Label Position</Label>
                        <Select value={numPosition} onValueChange={setNumPosition}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header-center">Header Center</SelectItem>
                            <SelectItem value="footer-center">Footer Center</SelectItem>
                            <SelectItem value="footer-right">Footer Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Number Style</Label>
                        <Select value={numFormat} onValueChange={setNumFormat}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Page {n} of {N}">Standard Long</SelectItem>
                            <SelectItem value="{n}">Page Only</SelectItem>
                            <SelectItem value="- {n} -">Hyphenated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-black/5 self-end h-11">
                        <span className="text-[10px] font-bold uppercase text-slate-950/60">Skip Cover</span>
                        <Switch checked={skipFirst} onCheckedChange={setSkipFirst} />
                      </div>
                    </>
                  )}

                  {(initialUnitId === 'jpg-pdf' || initialUnitId === 'word-pdf') && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Page Layout</Label>
                        <Select value={pageSize} onValueChange={setPageSize}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4" className="font-bold text-xs">A4 Protocol</SelectItem>
                            <SelectItem value="LETTER" className="font-bold text-xs">Letter Protocol</SelectItem>
                            <SelectItem value="LEGAL" className="font-bold text-xs">Legal Protocol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Orientation</Label>
                        <Select value={orientation} onValueChange={setOrientation}>
                          <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto" className="font-bold text-xs">Auto Detect</SelectItem>
                            <SelectItem value="portrait" className="font-bold text-xs">Portrait</SelectItem>
                            <SelectItem value="landscape" className="font-bold text-xs">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {(initialUnitId === 'split-pdf' || initialUnitId === 'extract-pages' || initialUnitId === 'remove-pages') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">{splitMode === 'every' ? 'N-Page Interval' : 'Page Range'}</Label>
                      <div className="relative">
                        <Input 
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder={splitMode === 'every' ? "e.g. 2" : "e.g. 1-5, 8-10"} 
                          className="bg-white/60 border-black/5 h-11 pl-10 font-black rounded-xl focus:ring-primary/20 text-slate-950"
                        />
                        <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'compress-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Efficiency Profile</Label>
                      <Select value={compressionProfile} onValueChange={setCompressionProfile}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality" className="font-bold text-xs">Maximum Fidelity (150 DPI)</SelectItem>
                          <SelectItem value="balanced" className="font-bold text-xs">Balanced (96 DPI)</SelectItem>
                          <SelectItem value="extreme" className="font-bold text-xs">Extreme Compression (72 DPI)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(initialUnitId === 'protect-pdf' || initialUnitId === 'unlock-pdf') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Cryptographic Key</Label>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Passphrase..." 
                          className="bg-white/60 border-black/5 h-11 pl-10 rounded-xl font-bold text-slate-950"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'rotate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-950/60 uppercase tracking-widest">Rotation Angle</Label>
                      <Select value={rotateAngle} onValueChange={setRotateAngle}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl font-bold text-slate-950">
                          <RotateCw className="w-3.5 h-3.5 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90" className="font-bold text-xs">90° Clockwise</SelectItem>
                          <SelectItem value="180" className="font-bold text-xs">180° Invert</SelectItem>
                          <SelectItem value="270" className="font-bold text-xs">90° Counter-Clockwise</SelectItem>
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
