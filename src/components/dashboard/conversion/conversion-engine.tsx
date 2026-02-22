"use client";

import { useState, useEffect } from 'react';
import { CategorySidebar } from './category-sidebar';
import { FormatSelector } from './format-selector';
import { DropZone } from './drop-zone';
import { SettingsPanel } from './settings-panel';
import { ProgressSection } from './progress-section';
import { OutputSection } from './output-section';
import { engine, ConversionJob } from '@/lib/engine';
import { HistoryDrawer } from '../history-drawer';
import { PreviewModal } from '../preview-modal';
import { Button } from '@/components/ui/button';
import { History, Search, Sun, Monitor, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function ConversionEngine({ initialFileId }: { initialFileId: string | null }) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeCategory, setActiveCategory] = useState('Document');
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [settings, setSettings] = useState({ quality: 85, resolution: '1080p', ocrLang: 'eng' });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState<ConversionJob | null>(null);

  useEffect(() => {
    return engine.subscribe(setJobs);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    engine.addJobs(files, fromFmt, toFmt, settings);
  };

  const completedJobs = jobs.filter(j => j.status === 'complete');
  const activeJobs = jobs.filter(j => j.status === 'processing' || j.status === 'queued');

  return (
    <div className="flex h-full bg-[#0a0e1f] overflow-hidden animate-in fade-in duration-700">
      {/* LEFT — CATEGORY SIDEBAR */}
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      {/* MAIN CENTER COLUMN */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
        <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">v1.0 REAL-TIME</span>
            </div>
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input 
                placeholder="Search formats (e.g. 'HEIC', 'CAD')..." 
                className="h-9 pl-9 bg-white/5 border-white/10 text-xs font-bold focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black text-muted-foreground uppercase">Local Node Active</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} className="h-9 w-9 hover:bg-white/5 relative">
              <History className="w-4 h-4" />
              {completedJobs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-background" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/5">
              <Sun className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 space-y-10 max-w-5xl mx-auto">
            {/* FORMAT SELECTOR HUB */}
            <FormatSelector 
              category={activeCategory} 
              from={fromFmt} 
              to={toFmt} 
              onFromChange={setFromFmt} 
              onToChange={setToFmt} 
            />

            {/* CENTRAL DROP ZONE */}
            <DropZone onFiles={handleFilesAdded} />

            {/* PROCESSING QUEUE */}
            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {/* OUTPUT CARDS */}
            {completedJobs.length > 0 && (
              <OutputSection 
                jobs={completedJobs} 
                onPreview={setPreviewJob} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>

      {/* RIGHT SETTINGS PANEL */}
      <SettingsPanel settings={settings} setSettings={setSettings} />

      {/* OVERLAYS */}
      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <PreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />
    </div>
  );
}
