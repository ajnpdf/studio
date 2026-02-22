
"use client";

import { useState, useRef, useEffect } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Cpu, 
  ShieldCheck, 
  Lock,
  Upload,
  CheckCircle2,
  Workflow,
  Search,
  Command,
  ArrowRight,
  Zap,
  BrainCircuit,
  FileText,
  ImageIcon,
  Video,
  Music,
  X,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ALL_SERVICES = [
  { id: 'pdf-docx', name: 'PDF to Word Mastery', desc: 'Reconstruct layouts via Neural OCR', cat: 'Document', icon: FileText, tag: 'WASM' },
  { id: 'pdf-xlsx', name: 'PDF to Excel Grid', desc: 'Neural table detection & extraction', cat: 'Document', icon: Layers, tag: 'AI' },
  { id: 'img-webp', name: 'Universal WebP Transcode', desc: 'Lossless compression for web nodes', cat: 'Image', icon: ImageIcon, tag: 'WASM' },
  { id: 'vid-gif', name: 'Video to Neural GIF', desc: 'Frame-accurate temporal mapping', cat: 'Video', icon: Video, tag: 'FFmpeg' },
  { id: 'aud-trim', name: 'Audio Waveform Surgery', desc: 'Precise sample-level trimming', cat: 'Audio', icon: Music, tag: 'WASM' },
  { id: 'ocr-search', name: 'Searchable PDF Layer', desc: 'Inject invisible semantic text', cat: 'Specialized', icon: BrainCircuit, tag: 'Neural' },
  { id: 'bg-remove', name: 'Neural BG Removal', desc: 'AI-driven subject isolation', cat: 'Image', icon: ImageIcon, tag: 'AI' },
  { id: 'vid-4k', name: '4K Lab Transcode', desc: 'Hardware accelerated rendering', cat: 'Video', icon: Video, tag: 'FFmpeg' },
];

/**
 * AJN Core - Neural Gateway
 * Enhanced with Global Service Search and Immersive Processing.
 */
export default function AJNPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredServices = ALL_SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

    for (let i = 0; i <= 100; i += 2) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 40));
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-[60] px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white rounded-lg shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
            <Network className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">AJN</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center relative group">
            <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <input 
              readOnly
              onClick={() => setShowSearch(true)}
              placeholder="Search services..." 
              className="h-9 w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all outline-none"
            />
            <div className="absolute right-3 flex items-center gap-1 opacity-40">
              <Command className="w-2.5 h-2.5" />
              <span className="text-[8px] font-black">K</span>
            </div>
          </div>

          <Link href="/junction">
            <Button variant="outline" className="h-9 border-white/10 bg-white/5 hover:bg-white hover:text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-2xl">
              <Workflow className="w-3.5 h-3.5" /> Junction Network
            </Button>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">WASM Layer Active</span>
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0d1225] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="p-6 border-b border-white/5 relative flex items-center">
              <Search className="absolute left-8 w-5 h-5 text-primary" />
              <Input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a neural service (e.g. 'PDF to DOCX', 'Upscale')..." 
                className="h-14 pl-14 pr-12 bg-transparent border-none text-lg font-bold placeholder:opacity-30 focus-visible:ring-0"
              />
              <button onClick={() => setShowSearch(false)} className="absolute right-8 p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="p-4 space-y-6">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredServices.map((s) => (
                      <Link key={s.id} href={`/junction/units?cat=${s.cat}`} onClick={() => setShowSearch(false)}>
                        <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <s.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-black uppercase tracking-tighter text-white/90">{s.name}</h4>
                              <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black">{s.tag}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4 opacity-40">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No matching neural logic found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[8px] font-black text-muted-foreground uppercase"><Command className="w-2 h-2" /> + K to toggle</span>
                <span className="flex items-center gap-1.5 text-[8px] font-black text-muted-foreground uppercase"><Zap className="w-2 h-2" /> Global Node Active</span>
              </div>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">AJN DIRECTORY v1.0</p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC BACKGROUND */}
      <div className={cn(
        "fixed inset-0 pointer-events-none transition-all duration-1000 z-0",
        isDragging ? "opacity-100 scale-100" : "opacity-0 scale-110"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className={cn(
          "w-full max-w-4xl transition-all duration-700 flex flex-col items-center gap-12",
          isProcessing || showSearch ? "scale-95 opacity-40 blur-sm" : "scale-100"
        )}>
          <div className={cn("transition-all duration-700", isDragging ? "scale-110" : "scale-100")}>
            <LogoAnimation />
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group relative w-full max-w-2xl min-h-[340px] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04] overflow-hidden shadow-2xl",
              isDragging && "border-primary bg-primary/10 scale-[0.98] shadow-primary/20"
            )}
          >
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateNeuralProcessing(e.target.files[0])} />
            
            <div className={cn(
              "w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-2xl transition-all duration-500",
              isDragging ? "scale-125 rotate-6 bg-primary" : "group-hover:scale-110"
            )}>
              <Upload className={cn("w-10 h-10 transition-colors", isDragging ? "text-white" : "text-white/40")} />
            </div>

            <div className="text-center space-y-3 px-8">
              <h2 className="text-4xl font-black tracking-tight text-white uppercase leading-none">Drop files to optimize</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] opacity-60">Supports 300+ formats up to 10GB</p>
            </div>

            <div className="mt-12 flex items-center gap-8 text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> End-to-end encrypted</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Virus scanned</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-3xl animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-12 text-center p-12">
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-primary/40 border-t-primary rounded-full animate-spin" />
                <Cpu className="w-12 h-12 text-primary animate-pulse" />
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">Neural Analysis</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{fileMeta?.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">
                    <span>{progress}% SECURED</span>
                    <span>{fileMeta?.size}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest pt-2">
                  <Lock className="w-3 h-3" /> Secure Node Handshake Active
                </div>
              </div>
            </div>
            
            <div className="absolute inset-x-0 h-px bg-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan-y top-0 pointer-events-none" />
          </div>
        )}

        <footer className="fixed bottom-8 text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.5em]">
          AJN JUNCTION • GLOBAL NODE • 2025
        </footer>
      </main>

      <style jsx global>{`
        @keyframes scan-y {
          from { transform: translateY(0vh); }
          to { transform: translateY(100vh); }
        }
        .animate-scan-y {
          animation: scan-y 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

import { ScrollArea } from '@/components/ui/scroll-area';
