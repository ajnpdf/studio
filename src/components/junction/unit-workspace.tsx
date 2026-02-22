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
  Database
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
    <div className="flex h-full bg-[#0a0e1f] overflow-hidden">
      {/* Unit Selector Sidebar */}
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      {/* Primary Workspace */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 space-y-10 max-w-5xl mx-auto">
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

        {/* Workspace HUD Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 p-3 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl pointer-events-auto">
            <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase text-white/60">Parallel Slots: {stats.activeThreads}/{3}</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase text-white/60">Vault Buffer: {stats.vaultStatus}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
