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
  FileText,
  Lock,
  Unlock,
  PenTool,
  Scissors,
  Globe,
  GitCompare,
  Zap,
  Activity,
  Maximize,
  Shrink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Refined Professional Engineering Sector
 * Standardized for all 30 master feature units.
 */
export function UnitWorkspace({ defaultCategory, initialUnitId }: Props) {
  const [appState, setAppState] = useState<GlobalAppState | null>(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  // High-Fidelity Master Configs
  const [securityConfig, setSecurityConfig] = useState({ userPassword: '', ownerPassword: '', allowPrint: true, allowCopy: true, allowModify: false });
  const [optimizeConfig, setOptimizeConfig] = useState({ targetDpi: 150, quality: 85, stripMetadata: true, grayscale: false });
  const [translateConfig, setTranslateConfig] = useState({ targetLanguage: 'Spanish', formality: 'neutral', bilingual: false });
  const [redactionConfig, setRedactionConfig] = useState({ aiAutoDetect: true, metadataRedaction: true, blackBox: true });
  const [conversionConfig, setConversionConfig] = useState({ toFmt: 'PDF', fitMode: 'FIT', pageSize: 'A4' });

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    let settings: any = { ...conversionConfig };
    
    if (initialUnitId?.includes('protect')) settings = securityConfig;
    if (initialUnitId?.includes('compress')) settings = optimizeConfig;
    if (initialUnitId?.includes('translate')) settings = translateConfig;
    if (initialUnitId?.includes('redact')) settings = redactionConfig;

    engine.addJobs(files, '', conversionConfig.toFmt, settings, initialUnitId);
  };

  if (!appState) return null;

  // Proper Case Formatting Protocol
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
                      Unit Operational Sequence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/60 border border-black/5 rounded-xl shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Pipeline Secured</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    v1.0 Stable
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
                          <Settings2 className="w-3.5 h-3.5" /> Parameter Engine
                        </h3>
                        <Zap className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                      </div>

                      {/* Domain 2 & 5: Optimization & Rotation Parameters */}
                      {(initialUnitId?.includes('compress') || initialUnitId?.includes('rotate')) && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Mastery Index (Quality)</Label>
                            <Slider 
                              value={[optimizeConfig.quality]} 
                              onValueChange={([v]) => setOptimizeConfig({...optimizeConfig, quality: v})}
                              max={100}
                            />
                            <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                              <span>Minify</span>
                              <span>Balanced</span>
                              <span>Fidelity</span>
                            </div>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black uppercase">Strip Metadata</p>
                              <p className="text-[8px] font-bold text-muted-foreground uppercase">Purge EXIF/XMP</p>
                            </div>
                            <Switch checked={optimizeConfig.stripMetadata} onCheckedChange={(v) => setOptimizeConfig({...optimizeConfig, stripMetadata: v})} />
                          </div>
                        </div>
                      )}

                      {/* Domain 6: Security Parameters */}
                      {initialUnitId?.includes('protect') && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Open Password</Label>
                            <Input 
                              type="password"
                              placeholder="Required to view..."
                              value={securityConfig.userPassword}
                              onChange={(e) => setSecurityConfig({...securityConfig, userPassword: e.target.value})}
                              className="h-12 bg-white/60 border-black/5 rounded-2xl font-bold focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Permission Matrix</Label>
                            <div className="p-5 bg-white/40 rounded-[2rem] border border-black/5 space-y-4">
                              {[
                                { label: 'Allow Printing', key: 'allowPrint' },
                                { label: 'Allow Copying', key: 'allowCopy' },
                                { label: 'Modify Content', key: 'allowModify' }
                              ].map(p => (
                                <div key={p.key} className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase text-slate-950/60">{p.label}</span>
                                  <Switch checked={(securityConfig as any)[p.key]} onCheckedChange={(v) => setSecurityConfig({...securityConfig, [p.key]: v})} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Domain 7: Intelligence Parameters */}
                      {initialUnitId?.includes('translate') && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Target Language Node</Label>
                            <Select value={translateConfig.targetLanguage} onValueChange={(v) => setTranslateConfig({...translateConfig, targetLanguage: v})}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-xl border-black/10">
                                {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'].map(l => (
                                  <SelectItem key={l} value={l} className="font-bold text-[10px] uppercase">{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black text-emerald-600 uppercase">Bilingual View</p>
                              <p className="text-[8px] font-bold text-emerald-600/60 uppercase">Side-by-side layout</p>
                            </div>
                            <Switch checked={translateConfig.bilingual} onCheckedChange={(v) => setTranslateConfig({...translateConfig, bilingual: v})} />
                          </div>
                        </div>
                      )}

                      {/* Default Generic Parameters */}
                      {!['protect', 'compress', 'translate', 'redact'].some(k => initialUnitId?.includes(k)) && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-950/60 ml-1">Output Format</Label>
                            <Select value={conversionConfig.toFmt} onValueChange={(v) => setConversionConfig({...conversionConfig, toFmt: v})}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {['PDF', 'JPG', 'PNG', 'DOCX', 'PPTX', 'XLSX'].map(f => (
                                  <SelectItem key={f} value={f}>{f}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-6 bg-white/60 border border-black/5 rounded-[2rem] text-center space-y-4 shadow-inner">
                            <Activity className="w-8 h-8 mx-auto text-primary opacity-20" />
                            <p className="text-[9px] font-black text-slate-950/30 uppercase tracking-[0.2em] leading-relaxed">
                              Standard Engineering <br/> Protocol Active
                            </p>
                          </div>
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