
"use client";

import { useState, useRef } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Activity, 
  FileCode, 
  Loader2,
  Lock,
  Grid2X2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * AJN Core - Neural Gateway
 * A minimalist, high-fidelity interactive file junction.
 */
export default function AJNPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateNeuralProcessing(files[0]);
    }
  };

  const simulateNeuralProcessing = async (file: File) => {
    setFileMeta({ 
      name: file.name, 
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
    });
    setIsProcessing(true);
    setProgress(0);

    // Neural Scan Animation Sequence
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }

    setTimeout(() => {
      setIsProcessing(false);
      // Logic for redirect or result would go here
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <NightSky />
      
      {/* PERSISTENT HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white rounded-lg shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
            <Network className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">AJN</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/services">
            <Button variant="outline" className="h-9 border-white/10 bg-white/5 hover:bg-white hover:text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-2xl">
              <Grid2X2 className="w-3.5 h-3.5" /> Services Directory
            </Button>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">WASM Layer Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Node Synchronized</span>
          </div>
        </div>
      </header>

      {/* DYNAMIC BACKGROUND EFFECTS */}
      <div className={cn(
        "fixed inset-0 pointer-events-none transition-all duration-1000 z-0",
        isDragging ? "opacity-100 scale-100" : "opacity-0 scale-110"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* CENTRAL NEURAL JUNCTION */}
        <div className={cn(
          "w-full max-w-4xl transition-all duration-700 flex flex-col items-center gap-12",
          isProcessing ? "scale-95 opacity-40 blur-sm" : "scale-100"
        )}>
          <div className={cn(
            "transition-all duration-700",
            isDragging ? "scale-110" : "scale-100"
          )}>
            <LogoAnimation />
          </div>

          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Neural Data Gateway</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-60">Initialize local master sequence</p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative h-24 px-12 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center cursor-pointer transition-all hover:border-primary/40 hover:bg-white/[0.07] overflow-hidden",
                isDragging && "border-primary bg-primary/10"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateNeuralProcessing(e.target.files[0])} />
              <div className="flex items-center gap-4 relative z-10">
                <Zap className={cn("w-5 h-5 transition-colors", isDragging ? "text-primary" : "text-white/40")} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Drop big data or browse</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/60 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-12 text-center p-12">
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-primary/40 border-t-primary rounded-full animate-spin" />
                <Cpu className="w-12 h-12 text-primary animate-pulse" />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Neural Analysis</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{fileMeta?.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground px-1">
                    <span>{progress}% SECURED</span>
                    <span>{fileMeta?.size}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" /> End-to-end Session Encrypted
                </p>
              </div>
            </div>
            
            {/* SCANNING LINE EFFECT */}
            <div className="absolute inset-x-0 h-px bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-y top-0 pointer-events-none" />
          </div>
        )}

        {/* FOOTER METRIC */}
        <footer className={cn(
          "fixed bottom-8 text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.5em] transition-opacity duration-500",
          isProcessing && "opacity-0"
        )}>
          AJN JUNCTION • LOCAL NODE v1.0 • 2025
        </footer>
      </main>

      <style jsx global>{`
        @keyframes scan-y {
          from { transform: translateY(0vh); }
          to { transform: translateY(100vh); }
        }
        .animate-scan-y {
          animation: scan-y 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
