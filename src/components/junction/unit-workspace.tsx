
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
  Info,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace
 * Dynamic workflow engine for all 28+ specialized services.
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

  useEffect(() => {
    if (!initialUnitId) return;

    // AUTO-CALIBRATE FORMATS BASED ON UNIT
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
    // Dynamic settings injection based on tool
    const settings: any = { quality: 85 };
    if (initialUnitId === 'protect-pdf') settings.password = password;
    if (initialUnitId === 'watermark-pdf') settings.text = watermarkText;
    if (initialUnitId === 'translate-pdf') settings.targetLang = targetLang;

    engine.addJobs(files, fromFmt, toFmt, settings, initialUnitId);
  };

  const activeJobs = jobs.filter(j => ['queued', 'processing'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'complete');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative">
      {/* MOBILE TRIGGER */}
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* SIDEBAR WRAPPER */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[80] lg:relative lg:z-0 lg:block transition-transform duration-500",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <CategorySidebar 
          active={activeCategory} 
          onSelect={(id) => { setActiveCategory(id); setMobileMenuOpen(false); }} 
        />
      </div>

      {/* PRIMARY WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-5xl mx-auto pb-32">
            
            {/* CONTEXTUAL TOOL PARAMETERS */}
            <section className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] space-y-6 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Service Parameters</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">WASM Stable</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialUnitId === 'protect-pdf' && (
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Master Password</Label>
                    <div className="relative">
                      <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="bg-white/5 border-white/10 h-12 pl-10"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}

                {initialUnitId === 'watermark-pdf' && (
                  <div className="space-y-2 md:col-span-2">
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

                {initialUnitId === 'translate-pdf' && (
                  <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Mastery Quality</Label>
                  <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between">
                    <span className="text-[10px] font-black uppercase">Adaptive High</span>
                    <Zap className="w-3.5 h-3.5 text-primary fill-current" />
                  </div>
                </div>
              </div>
            </section>

            {/* LOCKED FORMAT SELECTOR */}
            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
              isLocked={true}
            />

            {/* DROP ZONE */}
            <DropZone onFiles={handleFilesAdded} />

            {/* TASK QUEUE */}
            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {/* MASTERED OUTPUT */}
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
