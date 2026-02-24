"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { Settings2, Cpu, Zap, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Focused Real-Time Engineering Layout
 * Supports 100% valid binary downloads for all 30 tools.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const [config, setConfig] = useState<any>({});
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  
  const { phase, progress, logs, result, run, reset } = useAJNTool(initialUnitId || 'merge-pdf');

  /**
   * SMART INPUT FILTERING
   * Intelligently restricts browser file selection based on tool logic.
   */
  const getAcceptedExtensions = () => {
    if (!unit) return ".pdf";
    
    // Tools that convert FROM PDF
    if (unit.id.startsWith("pdf-")) return ".pdf";
    
    // Tools that convert TO PDF
    if (unit.id.endsWith("-pdf")) {
      if (unit.id.includes("jpg") || unit.id.includes("image")) return ".jpg,.jpeg,.png,.webp";
      if (unit.id.includes("word")) return ".docx,.doc";
      if (unit.id.includes("ppt")) return ".pptx,.ppt";
      if (unit.id.includes("excel")) return ".xlsx,.xls";
    }
    
    // Management tools (Merge, Compress, etc.)
    return ".pdf";
  };

  const handleFilesAdded = (files: File[]) => {
    run(files, config);
  };

  const set = (k: string, v: any) => setConfig({ ...config, [k]: v });

  const handleDownload = () => {
    if (!result || !result.blob) {
      toast({ variant: "destructive", title: "Export Error", description: "Binary buffer is empty or corrupted." });
      return;
    }

    const url = URL.createObjectURL(result.blob);
    const a = document.body.appendChild(document.createElement('a'));
    a.href = url;
    a.download = result.fileName;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Asset Exported",
      description: `Verified output [${result.fileName}] has been saved successfully.`,
    });
  };

  const renderConfig = () => {
    if (!unit) return null;
    const S = "text-[10px] font-black uppercase text-slate-950/60 ml-1";

    switch (unit.id) {
      case 'merge-pdf': return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className={S}>Output Filename</Label>
            <input 
              className="w-full h-10 px-3 bg-white/60 border border-black/5 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20" 
              value={config.name||""} 
              onChange={e=>set("name",e.target.value)} 
              placeholder="merged.pdf" 
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-black uppercase">Bookmark per file</p>
            <Switch checked={config.bookmarks} onCheckedChange={v=>set("bookmarks",v)} />
          </div>
        </div>
      );
      case 'compress-pdf': return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className={S}>Compression Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'Extreme'].map(lvl => (
                <Button 
                  key={lvl} 
                  variant="outline" 
                  size="sm" 
                  className={config.level === lvl ? "bg-primary text-white border-primary" : "bg-white/40"}
                  onClick={() => set("level", lvl)}
                >
                  {lvl}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
      default: return (
        <div className="p-10 border-2 border-dashed border-black/5 rounded-3xl text-center">
          <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.2em]">High-fidelity params active</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-12 space-y-10 max-w-6xl mx-auto">
            <header className="flex items-center justify-between px-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-xl">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">{unit?.name || "Junction Node"}</h2>
                  <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active engineering instance
                  </p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {phase === 'idle' && <DropZone onFiles={handleFilesAdded} accept={getAcceptedExtensions()} />}
                
                {phase === 'running' && (
                  <Card className="p-8 bg-white/60 border-2 border-black/5 rounded-[3.5rem] space-y-8 shadow-2xl overflow-hidden">
                    <CardContent className="p-0 space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Executing pipeline...
                        </h3>
                        <Badge className="bg-primary text-white border-none font-black text-[9px] px-2.5 h-5 rounded-full">
                          {Math.round(progress.pct)}%
                        </Badge>
                      </div>
                      
                      <ProgressBar pct={progress.pct} label={progress.detail} />

                      <LogStream logs={logs} />
                    </CardContent>
                  </Card>
                )}

                {phase === 'done' && result && (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-8 rounded-[3.5rem] shadow-2xl space-y-8 overflow-hidden">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">Mastery complete</h3>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-950/40 uppercase tracking-widest">{result.fileName}</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase">{(result.byteLength / 1024).toFixed(1)} KB • Verified Binary</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          onClick={handleDownload}
                          className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl gap-3 shadow-xl"
                        >
                          <Download className="w-4 h-4" /> Download export
                        </Button>
                        <Button variant="outline" onClick={reset} className="h-14 border-black/10 bg-white hover:bg-black/5 font-black text-xs uppercase tracking-widest rounded-2xl gap-3">
                          <RefreshCw className="w-4 h-4" /> Reset sector
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <Card className="p-8 bg-red-50 border-2 border-red-100 rounded-[3.5rem] text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-black text-red-900 uppercase">Pipeline Failure</h3>
                    <p className="text-sm text-red-700 font-medium">The neural engine encountered an unrecoverable error during binary synthesis.</p>
                    <Button onClick={reset} variant="destructive" className="h-12 px-10 rounded-2xl font-black text-xs uppercase">Retry Ingestion</Button>
                  </Card>
                )}
              </div>

              <aside className="lg:col-span-4 space-y-8">
                <Card className="bg-white/60 border-2 border-black/5 p-8 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5" /> Unit configuration
                    </h3>
                    <Zap className="w-3.5 h-3.5 text-primary/40 animate-pulse" />
                  </div>
                  {renderConfig()}
                </Card>
              </aside>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
