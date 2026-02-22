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
  Settings2,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Type,
  Scissors,
  RotateCw,
  Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace
 * Dynamic workflow engine for all specialized services.
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

  // Check if we have any tool-specific controls to show
  const hasControls = [
    'protect-pdf', 'split-pdf', 'extract-pages', 'remove-pages', 
    'rotate-pdf', 'watermark-pdf', 'crop-pdf', 'translate-pdf', 'compress-pdf'
  ].includes(initialUnitId || '');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative">
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center"
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

      <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-5xl mx-auto pb-32">
            
            {hasControls && (
              <section className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] animate-in fade-in duration-700 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* TOOL SPECIFIC CONTROLS */}
                  {initialUnitId === 'protect-pdf' && (
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Master Password</Label>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="bg-white/5 border-white/10 h-12 pl-10 focus:ring-primary/40"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {(initialUnitId === 'split-pdf' || initialUnitId === 'extract-pages' || initialUnitId === 'remove-pages') && (
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Page Range</Label>
                      <div className="relative">
                        <Input 
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g. 1, 3, 5-8" 
                          className="bg-white/5 border-white/10 h-12 pl-10 font-bold"
                        />
                        <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'rotate-pdf' && (
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Rotation Angle</Label>
                      <Select value={rotateAngle} onValueChange={setRotateAngle}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12">
                          <RotateCw className="w-4 h-4 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90">90° Clockwise</SelectItem>
                          <SelectItem value="180">180° Flip</SelectItem>
                          <SelectItem value="270">90° Counter-Clockwise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'watermark-pdf' && (
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Stamp Text</Label>
                      <div className="relative">
                        <Input 
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="ENTER WATERMARK..." 
                          className="bg-white/5 border-white/10 h-12 pl-10 font-bold"
                        />
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {initialUnitId === 'crop-pdf' && (
                    <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
                        <div key={side} className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">{side} Margin (px)</Label>
                          <Input 
                            type="number" 
                            value={margins[side.toLowerCase() as keyof typeof margins]}
                            onChange={(e) => setMargins({...margins, [side.toLowerCase()]: parseInt(e.target.value)})}
                            className="bg-white/5 border-white/10 h-10" 
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {initialUnitId === 'translate-pdf' && (
                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Target Language</Label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12">
                          <Globe className="w-4 h-4 mr-2 text-primary" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Spanish (ES)</SelectItem>
                          <SelectItem value="fr">French (FR)</SelectItem>
                          <SelectItem value="de">German (DE)</SelectItem>
                          <SelectItem value="jp">Japanese (JP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {initialUnitId === 'compress-pdf' && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Optimization Level</Label>
                        <span className="text-xs font-black text-primary">{compressionLevel}%</span>
                      </div>
                      <Slider 
                        value={[compressionLevel]} 
                        onValueChange={([v]) => setCompressionLevel(v)}
                        max={100}
                        step={1}
                        className="py-4"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
              isLocked={true}
            />

            <DropZone onFiles={handleFilesAdded} />

            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {completedJobs.length > 0 && (
              <OutputSection 
                jobs={completedJobs} 
                onPreview={(j) => console.log('Preview', j)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
