
"use client";

import { useState, useEffect } from 'react';
import { CategorySidebar } from './category-sidebar';
import { DropZone } from './drop-zone';
import { SettingsPanel } from './settings-panel';
import { ProgressSection } from './progress-section';
import { OutputSection } from './output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { HistoryDrawer } from '../history-drawer';
import { PreviewModal } from '../preview-modal';
import { Button } from '@/components/ui/button';
import { History, Search, Sun, ShieldCheck, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LogoAnimation } from '@/components/landing/logo-animation';

/**
 * AJN Conversion Engine - Autonomous Flow
 * Automatically identifies input and target system based on dropped files.
 */
export function ConversionEngine({ initialFileId }: { initialFileId: string | null }) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState('Document');
  const [settings, setSettings] = useState({ quality: 85, resolution: '1080p', ocrLang: 'eng' });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState<any | null>(null);

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    // Default transformation: Auto-detect → PDF
    engine.addJobs(files, '', 'PDF', settings);
  };

  if (!appState) return null;

  const completedJobs = appState.outputs;
  const activeJobs = appState.queue;

  return (
    <div className="flex h-full bg-transparent overflow-hidden animate-in fade-in duration-700 text-slate-950">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative">
        <header className="h-16 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <LogoAnimation className="w-14 h-7" showGlow={false} />
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <Cpu className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">v1.0 Real-Time</span>
              </div>
            </div>
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-950/40 group-hover:text-primary transition-colors" />
              <Input 
                placeholder="Search services (e.g. 'OCR', 'Split')..." 
                className="h-9 pl-9 bg-black/5 border-black/10 text-xs font-bold focus:ring-primary/50 text-slate-950"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1.5 bg-white/5 rounded-lg border border-black/5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] font-black text-slate-950/60 uppercase">System Active</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} className="h-9 w-9 hover:bg-black/5 relative text-slate-950">
              <History className="w-4 h-4" />
              {completedJobs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-black/5 text-slate-950">
              <Sun className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 space-y-10 max-w-5xl mx-auto">
            
            {/* CENTRAL DROP ZONE - Automatically maps to best service */}
            <DropZone onFiles={handleFilesAdded} />

            {/* PROCESSING QUEUE */}
            {activeJobs.length > 0 && <ProgressSection jobs={activeJobs} />}

            {/* OUTPUT CARDS */}
            {completedJobs.length > 0 && (
              <OutputSection 
                jobs={completedJobs} 
                onPreview={(j: any) => setPreviewJob(j)} 
                onClear={() => engine.clearQueue()} 
              />
            )}
          </div>
        </div>
      </main>

      <SettingsPanel settings={settings} setSettings={setSettings} />

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <PreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />
    </div>
  );
}
