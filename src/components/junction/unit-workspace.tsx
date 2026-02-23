"use client";

import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { FormatSelector } from '@/components/dashboard/conversion/format-selector';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, ConversionJob } from '@/lib/engine';
import { 
  Menu,
  Lock,
  Type,
  Scissors,
  RotateCw,
  Globe,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Refined Light Professional Theme
 * Proper casing, reduced component sizes, and advanced modern layout.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Contextual Tool Settings
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('AJN TOOLS');
  const [targetLang, setTargetLang] = useState('es');
  const [pageRange, setPageRange] = useState('1');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [margins, setMargins] = useState({ top: 50, bottom: 50, left: 50, right: 50 });

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

  useEffect(() => {
    return engine.subscribe((newJobs) => {
      setJobs(newJobs);
    });
  }, []);

  const handleFilesAdded = (files: File[]) => {
    const settings: any = { 
      quality: compressionLevel,
      password,
      text: watermarkText,
      targetLang,
      angle: parseInt(rotateAngle),
      pages: pageRange.split(',').map(p => parseInt(p.trim()) - 1).filter(p => !isNaN(p)),
      margins
    };

    engine.addJobs(files, fromFmt, toFmt, settings, initialUnitId);
  };

  const activeJobs = jobs.filter(j => ['queued', 'processing'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'complete');

  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'crop-pdf', 'translate-pdf', 'compress-pdf'
  ].includes(initialUnitId || '');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative font-body">
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <Menu className="w-6 h-6" />
      </button>

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
          <div className="p-4 md:p-10 space-y-6 md:space-y-8 max-w-4xl mx-auto pb-32">
            
            {/* Contextual Advanced Controls */}
            {hasControls && (
              <section className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 opacity-60 px-1">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocol Adjustment</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {initialUnitId === 'protect-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Master Password</Label>
                      <div className="relative group">
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Secret protocol key..." 
                          className="bg-white/60 border-black/5 h-11 pl-10 focus:ring-primary/20 rounded-xl font-bold"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                  )}

                  {(initialUnitId === 'split-pdf' || initialUnitId === 'extract-pages' || initialUnitId === 'remove-pages') && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Page Range</Label>
                      <div className="relative group">
                        <Input 
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g. 1, 3, 5-8" 
                          className="bg-white/60 border-black/5 h-11 pl-10 font-black rounded-xl focus:ring-primary/20"
                        />
                        <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'rotate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Rotation Angle</Label>
                      <Select value={rotateAngle} onValueChange={setRotateAngle}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl focus:ring-primary/20">
                          <RotateCw className="w-3.5 h-3.5 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-black/5 rounded-xl">
                          <SelectItem value="90" className="font-bold text-xs uppercase">90° Clockwise</SelectItem>
                          <SelectItem value="180" className="font-bold text-xs uppercase">180° Inverse</SelectItem>
                          <SelectItem value="270" className="font-bold text-xs uppercase">90° Counter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'watermark-pdf' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Stamp Text</Label>
                      <div className="relative group">
                        <Input 
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter stamp content..." 
                          className="bg-white/60 border-black/5 h-11 pl-10 font-black rounded-xl focus:ring-primary/20"
                        />
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'translate-pdf' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Target Language</Label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="bg-white/60 border-black/5 h-11 rounded-xl focus:ring-primary/20">
                          <Globe className="w-3.5 h-3.5 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-black/5 rounded-xl">
                          <SelectItem value="es" className="font-bold text-xs uppercase">Spanish (ES)</SelectItem>
                          <SelectItem value="fr" className="font-bold text-xs uppercase">French (FR)</SelectItem>
                          <SelectItem value="de" className="font-bold text-xs uppercase">German (DE)</SelectItem>
                          <SelectItem value="jp" className="font-bold text-xs uppercase">Japanese (JP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'compress-pdf' && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency Index</Label>
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

            {/* Protocol HUB - Reduced size, locked source */}
            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
              isSourceLocked={true}
            />

            {/* Processing Drop Zone */}
            <DropZone onFiles={handleFilesAdded} />

            {/* Active Queue */}
            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {/* Mastered Output */}
            {completedJobs.length > 0 && (
              <OutputSection 
                jobs={completedJobs} 
                onPreview={(j) => console.log('Previewing Unit', j)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
