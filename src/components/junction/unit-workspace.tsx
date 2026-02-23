"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorySidebar } from '@/components/dashboard/conversion/category-sidebar';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { ProgressSection } from '@/components/dashboard/conversion/progress-section';
import { OutputSection } from '@/components/dashboard/conversion/output-section';
import { engine, GlobalAppState } from '@/lib/engine';
import { 
  Settings2, 
  ShieldCheck, 
  Cpu, 
  Play, 
  RotateCw, 
  Wand2, 
  Database, 
  Layers, 
  Info,
  Type,
  Hash,
  Shield,
  FileText
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Custom tool states
  const [rotationMap, setRotationMap] = useState<Record<number, number>>({});
  const [numberingConfig, setNumberingConfig] = useState({ position: 'bottom-center', format: 'numeric', startNumber: 1, skipFirst: false });
  const [pdfaConfig, setPdfaConfig] = useState({ conformance: '2b' });

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    executeJob(files);
  };

  const executeJob = (files: File[]) => {
    let settings: any = { toFmt: 'PDF' };
    
    if (initialUnitId === 'rotate-pdf') settings = { rotationMap };
    if (initialUnitId === 'add-page-numbers') settings = numberingConfig;
    if (initialUnitId === 'pdf-pdfa') settings = pdfaConfig;

    engine.addJobs(files, 'pdf', 'PDF', settings, initialUnitId);
  };

  if (!appState) return null;

  const unitDisplayName = initialUnitId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={initialUnitId}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40"
            >
              <header className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl">
                    <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">{unitDisplayName}</h2>
                    <p className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.4em] mt-1">Unit Node Synchronized</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Ready
                </Badge>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <DropZone onFiles={handleFilesAdded} />
                </div>

                <aside className="lg:col-span-4 space-y-8">
                  <Card className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="space-y-6 relative z-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" /> Parameter Engine
                      </h3>

                      {initialUnitId === 'add-page-numbers' && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-950/60 ml-1">Grid Position</Label>
                            <Select value={numberingConfig.position} onValueChange={(v) => setNumberingConfig({...numberingConfig, position: v})}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <span className="text-[10px] font-black uppercase text-primary">Skip First Page</span>
                            <Switch checked={numberingConfig.skipFirst} onCheckedChange={(v) => setNumberingConfig({...numberingConfig, skipFirst: v})} />
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'pdf-pdfa' && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-950/60 ml-1">Conformance Level</Label>
                            <Select value={pdfaConfig.conformance} onValueChange={(v) => setPdfaConfig({...pdfaConfig, conformance: v})}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1b">PDF/A-1b (ISO 19005-1)</SelectItem>
                                <SelectItem value="2b">PDF/A-2b (ISO 19005-2)</SelectItem>
                                <SelectItem value="3b">PDF/A-3b (ISO 19005-3)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase leading-relaxed">
                              Enabling this protocol will flatten transparency layers and embed ICC output intents for archival stability.
                            </p>
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'rotate-pdf' && (
                        <div className="p-6 bg-white/60 border border-black/5 rounded-[2rem] text-center space-y-4">
                          <RotateCw className="w-8 h-8 mx-auto text-primary animate-spin-slow" />
                          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">Select pages in the sequence to apply 90° increments.</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <ProgressSection jobs={appState.queue} />
                </aside>
              </div>

              {appState.outputs.length > 0 && (
                <OutputSection 
                  jobs={appState.outputs} 
                  onPreview={(j) => window.open(j.objectUrl)} 
                  onClear={() => engine.clearQueue()} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
