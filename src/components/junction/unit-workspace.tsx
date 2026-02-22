"use client";

import { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
}

export function UnitWorkspace({ defaultCategory }: Props) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [stats, setStats] = useState(engine.getStats());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return engine.subscribe((newJobs) => {
      setJobs(newJobs);
      setStats(engine.getStats());
    });
  }, []);

  const handleFilesAdded = (files: File[]) => {
    engine.addJobs(files, fromFmt, toFmt, { quality: 85 });
  };

  const activeJobs = jobs.filter(j => ['queued', 'processing'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'complete');

  return (
    <div className="flex h-full bg-[#0a0e1f] overflow-hidden relative">
      {/* MOBILE TRIGGER */}
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[70] w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* SIDEBAR WRAPPER */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[80] lg:relative lg:z-0 lg:block transition-transform duration-500",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {mobileMenuOpen && (
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-[-3rem] w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <CategorySidebar 
          active={activeCategory} 
          onSelect={(id) => { setActiveCategory(id); setMobileMenuOpen(false); }} 
        />
      </div>

      {/* PRIMARY WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
          <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-5xl mx-auto">
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

        {/* WORKSPACE HUD OVERLAY */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex items-center justify-between pointer-events-none z-40">
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-2 px-2 md:px-3 border-r border-white/10">
              <Cpu className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
              <span className="text-[7px] md:text-[9px] font-black uppercase text-white/60">Slots: {stats.activeThreads}/3</span>
            </div>
            <div className="flex items-center gap-2 px-2 md:px-3">
              <Database className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
              <span className="text-[7px] md:text-[9px] font-black uppercase text-white/60">Buffer: {stats.vaultStatus}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
