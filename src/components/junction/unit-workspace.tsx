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
  Zap
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
  
  // Security & Intelligence Configs
  const [securityConfig, setSecurityConfig] = useState({ openPassword: '', ownerPassword: '', allowPrint: true, allowCopy: true });
  const [translateConfig, setTranslateConfig] = useState({ targetLanguage: 'Spanish', formality: 'neutral' });
  const [redactionConfig, setRedactionConfig] = useState({ aiAutoDetect: true, metadataRedaction: true });

  useEffect(() => {
    return engine.subscribe(setAppState);
  }, []);

  const handleFilesAdded = (files: File[]) => {
    let settings: any = { toFmt: 'PDF' };
    
    if (initialUnitId === 'protect-pdf') settings = securityConfig;
    if (initialUnitId === 'translate-pdf') settings = translateConfig;
    if (initialUnitId === 'redact-pdf') settings = redactionConfig;

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

                      {initialUnitId === 'protect-pdf' && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-950/60 ml-1">Open Password</Label>
                            <Input 
                              type="password"
                              placeholder="Required to view..."
                              value={securityConfig.openPassword}
                              onChange={(e) => setSecurityConfig({...securityConfig, openPassword: e.target.value})}
                              className="h-12 bg-white/60 border-black/5 rounded-2xl font-bold"
                            />
                          </div>
                          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-primary">Allow Printing</span>
                              <Switch checked={securityConfig.allowPrint} onCheckedChange={(v) => setSecurityConfig({...securityConfig, allowPrint: v})} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-primary">Allow Copying</span>
                              <Switch checked={securityConfig.allowCopy} onCheckedChange={(v) => setSecurityConfig({...securityConfig, allowCopy: v})} />
                            </div>
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'translate-pdf' && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-950/60 ml-1">Target Language</Label>
                            <Select value={translateConfig.targetLanguage} onValueChange={(v) => setTranslateConfig({...translateConfig, targetLanguage: v})}>
                              <SelectTrigger className="h-12 bg-white/60 border-black/5 rounded-2xl font-black text-[10px] uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'].map(l => (
                                  <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase">Neural engine will preserve original coordinate matrices.</p>
                          </div>
                        </div>
                      )}

                      {initialUnitId === 'redact-pdf' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-slate-950">AI Auto-Detect</p>
                              <p className="text-[8px] font-bold text-slate-950/40 uppercase">Find PII/Financials</p>
                            </div>
                            <Switch checked={redactionConfig.aiAutoDetect} onCheckedChange={(v) => setRedactionConfig({...redactionConfig, aiAutoDetect: v})} />
                          </div>
                          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-red-600 uppercase">Warning: Redaction is permanent. Binary data is deleted.</p>
                          </div>
                        </div>
                      )}

                      {!['protect-pdf', 'translate-pdf', 'redact-pdf'].includes(initialUnitId || '') && (
                        <div className="p-6 bg-white/60 border border-black/5 rounded-[2rem] text-center space-y-4">
                          <Zap className="w-8 h-8 mx-auto text-primary animate-pulse" />
                          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">Execute Mastery to initialize system units.</p>
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
