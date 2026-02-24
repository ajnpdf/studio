"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { useAJNTool, ProgressBar, LogStream } from '@/hooks/use-ajn-tool';
import { Cpu, Download, RefreshCw, CheckCircle2, ShieldCheck, Activity, XCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ALL_UNITS } from './services-grid';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Props {
  defaultCategory: string;
  initialUnitId?: string;
}

/**
 * AJN Unit Workspace - Focused Engineering Hub
 * High-fidelity, distraction-free environment for master binary transformations.
 */
export function UnitWorkspace({ initialUnitId }: Props) {
  const unit = ALL_UNITS.find(u => u.id === initialUnitId);
  const { phase, progress, logs, result, error, run, reset } = useAJNTool(initialUnitId || 'merge-pdf');

  const getAcceptedExtensions = () => {
    if (!unit) return ".pdf";
    const id = unit.id;
    // PDF Source Tools
    if (id.startsWith("pdf-") || id === "merge-pdf" || id === "split-pdf" || id === "rotate-pdf" || 
        id === "compress-pdf" || id === "redact-pdf" || id === "protect-pdf" || id === "sign-pdf" || 
        id === "summarize-pdf" || id === "translate-pdf" || id === "ocr-pdf") {
      return ".pdf";
    }
    // PDF Creation Tools
    if (id.endsWith("-pdf")) {
      if (id.includes("jpg") || id.includes("image")) return ".jpg,.jpeg,.png,.webp";
      if (id.includes("word")) return ".docx,.doc";
      if (id.includes("ppt")) return ".pptx,.ppt";
      if (id.includes("excel")) return ".xlsx,.xls";
      if (id.includes("html")) return ".html,.htm";
    }
    return "*/*";
  };

  const handleFilesAdded = (files: File[]) => {
    run(files, { 
      quality: 90,
      targetFormat: unit?.id.split('-').pop()?.toUpperCase() || 'PDF'
    });
  };

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
    toast({ title: "Asset Exported", description: `Verified output [${result.fileName}] saved successfully.` });
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden relative text-slate-950 font-sans">
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 md:p-12 space-y-10 max-w-4xl mx-auto pb-32"
          >
            {/* HERO IDENTITY */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border-2 border-primary/20 shadow-2xl relative group">
                  <Cpu className="w-7 h-7 text-primary animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">{unit?.name || "Junction Node"}</h2>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black h-5 uppercase tracking-widest">{unit?.mode || 'WASM'}</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    Neural Registry Instance • Active Sector
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/40 border border-black/5 rounded-2xl shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-slate-950/60 uppercase tracking-widest">End-To-End Secure</span>
                </div>
              </div>
            </header>

            {/* MAIN INTERACTION ZONE */}
            <div className="space-y-10">
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <DropZone onFiles={handleFilesAdded} accept={getAcceptedExtensions()} />
                  </motion.div>
                )}
                
                {phase === 'running' && (
                  <motion.div 
                    key="running"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <Card className="p-10 bg-white/60 border-2 border-black/5 rounded-[3rem] space-y-10 shadow-2xl overflow-hidden backdrop-blur-3xl">
                      <CardContent className="p-0 space-y-10">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950 flex items-center gap-3">
                              <RefreshCw className="w-5 h-5 animate-spin text-primary" /> 
                              Executing Binary Sequence
                            </h3>
                            <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">WASM Pipeline Concurrency: High</p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-black text-primary tracking-tighter">{Math.round(progress.pct)}%</span>
                          </div>
                        </div>
                        
                        <ProgressBar pct={progress.pct} label={progress.detail} />
                        <LogStream logs={logs} />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {phase === 'done' && result && (
                  <motion.div 
                    key="done"
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-3xl mx-auto"
                  >
                    <Card className="bg-white/80 border-2 border-emerald-500/20 p-12 rounded-[4rem] shadow-[0_32px_64px_-12px_rgba(16,185,129,0.15)] space-y-10 overflow-hidden text-center backdrop-blur-3xl">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/20 shadow-xl">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-4 h-6 rounded-full uppercase tracking-widest mb-2">Mastery Successful</Badge>
                          <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-950">{result.fileName}</h3>
                          <p className="text-xs font-bold text-slate-950/40 uppercase tracking-[0.3em]">
                            Verified Binary Buffer • {(result.byteLength / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          onClick={handleDownload}
                          className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl gap-4 shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                          <Download className="w-5 h-5" /> Download Asset
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={reset} 
                          className="h-16 px-10 border-black/10 bg-white hover:bg-black/5 font-black text-sm uppercase tracking-widest rounded-2xl gap-4 transition-all"
                        >
                          <RefreshCw className="w-5 h-5" /> Process More
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {phase === 'error' && (
                  <motion.div key="error" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Card className="p-12 bg-red-50 border-2 border-red-100 rounded-[4rem] text-center space-y-8 shadow-2xl">
                      <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-red-200">
                        <XCircle className="w-10 h-10 text-red-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black text-red-900 uppercase tracking-tighter">Pipeline Interrupted</h3>
                        <p className="text-sm text-red-700 font-bold uppercase tracking-widest opacity-70">{error || "Unrecoverable binary synthesis error"}</p>
                      </div>
                      <Button onClick={reset} variant="destructive" className="h-14 px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Restart Neural Session</Button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
