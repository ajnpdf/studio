
"use client";

import { useState, useEffect, useMemo } from 'react';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { FormatSelector } from '@/components/dashboard/conversion/format-selector';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, ConversionJob } from '@/lib/engine';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Database,
  Menu,
  X,
  Settings2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-calibrate formats based on unit ID
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
    } else if (['edit-pdf', 'rotate-pdf', 'compress-pdf', 'sign-pdf', 'protect-pdf', 'unlock-pdf', 'organize-pdf', 'repair-pdf', 'ocr-pdf', 'redact-pdf', 'translate-pdf', 'crop-pdf', 'page-numbers'].includes(initialUnitId)) {
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
    engine.addJobs(files, fromFmt, toFmt, { quality: 85 }, initialUnitId);
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
            
            {/* Contextual HUD for specific tools */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Engine Parameters</span>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black">{fromFmt} → {toFmt}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Processing occurs locally</span>
              </div>
            </div>

            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
            />

            <DropZone onFiles={handleFilesAdded} />

            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {completedJobs.length > 0 && (
              <OutputSection 
                jobs={completedJobs} 
                onPreview={(j) => console.log('Previewing', j)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
