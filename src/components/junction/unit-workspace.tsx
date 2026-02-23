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
  Zap, 
  Activity, 
  Lock, 
  Globe, 
  Maximize, 
  Database,
  Layers,
  Wand2
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Advanced Unit Workspace
 * Industrial engineering interface for master transformation units.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // Advanced Master Configs
  const [securityConfig, setSecurityConfig] = useState({ userPassword: '', allowPrint: true, allowCopy: true });
  const [optimizeConfig, setOptimizeConfig] = useState({ quality: 85, stripMetadata: true });
  const [translateConfig, setTranslateConfig] = useState({ targetLanguage: 'Spanish', bilingual: false });
  const [conversionConfig, setConversionConfig] = useState({ toFmt: 'PDF' });

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    let settings: any = { ...conversionConfig };
    
    if (initialUnitId?.includes('protect')) settings = securityConfig;
    if (initialUnitId?.includes('compress')) settings = optimizeConfig;
    if (initialUnitId?.includes('translate')) settings = translateConfig;

    engine.addJobs(files, '', conversionConfig.toFmt, settings, initialUnitId);
  };

  if (!appState) return null;

  const unitDisplayName = initialUnitId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "Universal Core";

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-body">
      <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0 border-r border-black/5 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={initialUnitId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto pb-40"
            >
              <header className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-xl group">
                    <Cpu className="w-7 h-7 text-primary animate-pulse group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-slate-950">{unitDisplayName}</h2>
                    <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Unit Operational Node
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/60 border border-black/5 rounded-xl shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">System Secured</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    v1.0 Production
                  </Badge>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <DropZone onFiles={handleFilesAdded} />
                </div>

                <aside className="lg:col-span-4 space-y-8">
                  <Card className="bg-white/60 border-2 border-black/5 p-8 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8 relative overflow-hidden transition-all hover:border-primary/20">
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                          <Settings2 className="w-3.5 h-3.5" /> Sector Config
                        </h3>
                        <Zap className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                      </div>

                      {/* Domain Mapping logic */}
                      {initialUnitId?.includes('compress') ? (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Mastery Index (Quality)</Label>
                            <Slider 
                              value={[optimizeConfig.quality]} 
                              onValueChange={([v]) => setOptimizeConfig({...optimizeConfig, quality: v})}
                              max={100}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-black uppercase">Strip EXIF</p>
                            <Switch checked={optimizeConfig.stripMetadata} onCheckedChange={(v) => setOptimizeConfig({...optimizeConfig, stripMetadata: v})} />
                          </div>
                        </div>
                      ) : initialUnitId?.includes('protect') ? (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Open Password</Label>
                            <Input 
                              type="password"
                              placeholder="Required to view..."
                              value={securityConfig.userPassword}
                              onChange={(e) => setSecurityConfig({...securityConfig, userPassword: e.target.value})}
                              className="h-12 bg-white/60 border-black/5 rounded-2xl font-bold"
                            />
                          </div>
                        </div>
                      ) : initialUnitId?.includes('translate') ? (
                        <div className="space-y-6">
                          <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Target Language</Label>
                          <Select value={translateConfig.targetLanguage} onValueChange={(v) => setTranslateConfig({...translateConfig, targetLanguage: v})}>
                            <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['Spanish', 'French', 'German', 'Chinese', 'Japanese'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Output Format</Label>
                          <Select value={conversionConfig.toFmt} onValueChange={(v) => setConversionConfig({...conversionConfig, toFmt: v})}>
                            <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['PDF', 'JPG', 'PNG', 'DOCX', 'PPTX', 'XLSX'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                          </Select>
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
