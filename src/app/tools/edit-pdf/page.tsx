"use client";

import { useState } from 'react';
import { PDFEditor } from '@/components/dashboard/pdf-editor/pdf-editor';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, ShieldCheck, Activity, Loader2, FileText, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { DropZone } from '@/components/dashboard/conversion/drop-zone';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditPDFPage() {
  const [phase, setPhase] = useState<'upload' | 'initializing' | 'edit'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setPhase('initializing');
      // Simulate Surgical Engine Calibration
      setTimeout(() => {
        setPhase('edit');
      }, 1800);
    }
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setPhase('upload');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-body bg-slate-100">
      <NightSky />
      
      <header className="h-16 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-[60] shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/ajn">
            <LogoAnimation className="w-16 h-8" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Advanced Surgical Editor</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {phase === 'edit' && (
            <Button 
              variant="ghost" 
              onClick={handleReupload}
              className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all gap-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> New Ingestion
            </Button>
          )}
          <Link href="/ajn">
            <Button variant="ghost" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full px-6 space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-primary/20 shadow-xl">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-950">Inhale Document</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Initialize real-time surgical processing</p>
              </div>

              <DropZone onFiles={handleUpload} accept="application/pdf" />

              <div className="flex items-center justify-center gap-10 pt-10 border-t border-black/5 opacity-40">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Local WASM Buffer</span>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'initializing' && (
            <motion.div 
              key="initializing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <div className="relative">
                <Loader2 className="w-24 h-24 text-primary animate-spin mx-auto opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Calibrating Engine...</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Building surgical layers for {selectedFile?.name}</p>
              </div>
            </motion.div>
          )}

          {phase === 'edit' && (
            <motion.div 
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              <PDFEditor initialFileId={null} file={selectedFile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
