"use client";

import { useState, useEffect, useRef } from 'react';
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
  X, 
  Play, 
  RotateCw, 
  Wand2, 
  Database, 
  Layers, 
  Activity, 
  Scissors, 
  Layout, 
  Type, 
  FileText, 
  CheckCircle2, 
  Presentation,
  Table as TableIcon,
  Info
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [quality, setQuality] = useState(85);
  const [targetDpi, setTargetDpi] = useState(150);
  const [outputFormat, setOutputFormat] = useState('PPTX');

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    executeJob(files);
  };

  const executeJob = (files: File[]) => {
    let to = 'PDF';
    if (initialUnitId === 'pdf-pptx') to = 'PPTX';
    if (initialUnitId === 'pdf-excel') to = 'XLSX';
    if (initialUnitId === 'pdf-word') to = 'DOCX';
    if (initialUnitId === 'pdf-jpg') to = 'JPG';

    const settings = { quality, targetDpi, toFmt: to };
    engine.addJobs(files, 'pdf', to, settings, initialUnitId);
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
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl">
                    <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">{unitDisplayName}</h2>
                    <p className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.4em]">Master System Active</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Environment Ready
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <DropZone onFiles={handleFilesAdded} />
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <section className="bg-white/50 border border-white/80 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                      <Settings2 className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" /> Parameter Engine
                      </h3>

                      {initialUnitId === 'pdf-pptx' && (
                        <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="flex items-center gap-2">
                            <Presentation className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Layout Mapping</p>
                          </div>
                          <p className="text-[9px] font-bold text-slate-950/40 uppercase leading-relaxed">
                            AI will scan visual coordinates to detect titles, body runs, and image XObjects for slide reconstruction.
                          </p>
                        </div>
                      )}

                      {initialUnitId === 'pdf-excel' && (
                        <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <div className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Grid Alignment</p>
                          </div>
                          <p className="text-[9px] font-bold text-slate-950/40 uppercase leading-relaxed">
                            Executing text-alignment clustering to build coordinate-accurate worksheet grids.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-950/60 uppercase tracking-[0.3em] ml-1">Calibration Intensity</Label>
                        <Select value={targetDpi.toString()} onValueChange={(v) => setTargetDpi(parseInt(v))}>
                          <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-xs shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="72">72 DPI (Standard)</SelectItem>
                            <SelectItem value="150">150 DPI (High-Res)</SelectItem>
                            <SelectItem value="300">300 DPI (Master)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <ProgressSection jobs={appState.queue} />
                </div>
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
