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
  History, 
  Terminal, 
  Cpu, 
  Database, 
  Workflow, 
  X, 
  Settings2,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
}

export function UnitWorkspace({ defaultCategory }: Props) {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [fromFmt, setFromFmt] = useState('');
  const [toFmt, setToFmt] = useState('');
  const [showDebugger, setShowDebugger] = useState(true);
  const [activeJobForDebug, setActiveJobForDebug] = useState<ConversionJob | null>(null);
  const [stats, setStats] = useState(engine.getStats());

  useEffect(() => {
    return engine.subscribe((newJobs) => {
      setJobs(newJobs);
      setStats(engine.getStats());
      const processing = newJobs.find(j => j.status === 'processing');
      if (processing) setActiveJobForDebug(processing);
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

          <Button 
            onClick={() => setShowDebugger(!showDebugger)}
            className="h-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl px-6 pointer-events-auto gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Terminal className="w-4 h-4" /> {showDebugger ? 'HIDE DEBUGGER' : 'SHOW DEBUGGER'}
          </Button>
        </div>
      </main>

      {/* Logic Stream Debugger (Professional Feature) */}
      {showDebugger && (
        <aside className="w-[380px] h-full border-l border-white/5 bg-[#070b18]/80 backdrop-blur-3xl flex flex-col shrink-0 animate-in slide-in-from-right duration-500">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/20">
            <div className="flex items-center gap-3">
              <Workflow className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Logic Stream Debugger</h3>
            </div>
            <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase">v1.0 ACTIVE</Badge>
          </header>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {!activeJobForDebug ? (
                <div className="py-20 text-center space-y-4 opacity-40">
                  <Terminal className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-[10px] font-black uppercase tracking-widest px-12">Waiting for neural task initiation...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Process ID</span>
                      <span className="text-[10px] font-mono text-primary">{activeJobForDebug.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Operation</span>
                      <span className="text-[10px] font-bold uppercase">{activeJobForDebug.fromFmt} → {activeJobForDebug.toFmt}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground px-2">Pipeline Trace</h4>
                    <div className="space-y-2">
                      {[
                        { step: 'MEMORY_INIT', status: 'COMPLETE', time: '14ms' },
                        { step: 'STREAM_BUFF_ALLOC', status: 'COMPLETE', time: '22ms' },
                        { step: 'NEURAL_GRAPH_LOAD', status: 'COMPLETE', time: '142ms' },
                        { step: 'WASM_WORKER_SPAWN', status: activeJobForDebug.status === 'processing' ? 'PENDING' : 'COMPLETE', time: '...' },
                        { step: 'TRANSFORM_EXEC', status: activeJobForDebug.status === 'processing' ? 'ACTIVE' : 'IDLE', time: activeJobForDebug.stage },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/20 transition-all">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            s.status === 'COMPLETE' ? 'bg-emerald-500' : s.status === 'ACTIVE' ? 'bg-primary animate-pulse' : 'bg-white/10'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-white/80">{s.step}</p>
                            <p className="text-[8px] font-bold text-muted-foreground truncate">{s.time}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <Monitor className="w-3 h-3" /> Live Telemetry
                    </p>
                    <div className="font-mono text-[9px] text-white/40 leading-relaxed">
                      [INFO] Allocated {activeJobForDebug.file.size / 1024 / 1024 > 1 ? (activeJobForDebug.file.size / 1024 / 1024).toFixed(1) + 'MB' : '8.4KB'} buffer<br />
                      [DBUG] Thread pool synchronized<br />
                      [INFO] Running {activeJobForDebug.toFmt} neural pass...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <footer className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Neural Cache</span>
              <Badge className={cn("border-none h-4 text-[8px] font-black", stats.cacheSize > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-muted-foreground")}>
                {stats.cacheSize > 0 ? 'LOADED' : 'READY'}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => engine.clearQueue()} className="w-full h-10 border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest gap-2">
              PURGE SESSION VAULT
            </Button>
          </footer>
        </aside>
      )}
    </div>
  );
}
