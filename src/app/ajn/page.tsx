"use client";

import { useState, useRef, useEffect } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  ShieldCheck, 
  Upload,
  CheckCircle2,
  Workflow,
  Search,
  Command,
  ArrowRight,
  Zap,
  FileText,
  ImageIcon,
  Video,
  Music,
  X,
  Layers,
  FileCode,
  BrainCircuit,
  Wand2,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ALL_SERVICES = [
  { id: 'pdf-docx', name: 'PDF to Word Master', desc: 'Reconstruct layouts via Smart OCR', cat: 'Document', icon: FileText, tag: 'WASM' },
  { id: 'pdf-xlsx', name: 'PDF to Excel Grid', desc: 'Smart table detection & extraction', cat: 'Document', icon: Layers, tag: 'AI' },
  { id: 'img-webp', name: 'Universal WebP Transcode', desc: 'Lossless compression for web nodes', cat: 'Image', icon: ImageIcon, tag: 'WASM' },
  { id: 'bg-remove', name: 'Smart BG Removal', desc: 'AI-driven subject isolation', cat: 'Image', icon: Wand2, tag: 'Smart' },
  { id: 'vid-gif', name: 'Video to Smart GIF', desc: 'Frame-accurate temporal mapping', cat: 'Video', icon: Video, tag: 'FFmpeg' },
  { id: 'aud-trim', name: 'Audio Waveform Surgery', desc: 'Precise sample-level trimming', cat: 'Audio', icon: Music, tag: 'WASM' },
];

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

  const simulateProcessing = async (file: File) => {
    setFileMeta({ 
      name: file.name, 
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
    });
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 30));
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body flex flex-col"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) simulateProcessing(e.dataTransfer.files[0]); }}
    >
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-[60] px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          <span className="font-black text-lg md:text-xl tracking-tighter text-white uppercase ml-[-8px]">AJN</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-8 md:h-9 border-white/10 bg-white/5 hover:bg-white hover:text-black font-black text-[8px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all gap-2 px-3 md:px-4 shadow-2xl">
              <Workflow className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden sm:inline">Services</span> Hub
            </Button>
          </Link>
          <div className="h-6 md:h-8 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-500" />
            <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest hidden xs:inline">WASM ACTIVE</span>
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-0 md:pt-[15vh] px-0 md:px-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full h-full md:h-auto md:max-w-2xl bg-[#0d1225] border-none md:border md:border-white/10 md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="p-4 md:p-6 border-b border-white/5 relative flex items-center">
              <Search className="absolute left-6 md:left-8 w-5 h-5 text-primary" />
              <Input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a smart service..." 
                className="h-12 md:h-14 pl-12 md:pl-14 pr-12 bg-transparent border-none text-base md:text-lg font-bold placeholder:opacity-30 focus-visible:ring-0"
              />
              <button onClick={() => setShowSearch(false)} className="absolute right-6 md:right-8 p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-120px)] md:max-h-[60vh]">
              <div className="p-2 md:p-4 space-y-4 md:space-y-6">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1 md:gap-2">
                    {filteredServices.map((s) => (
                      <Link key={s.id} href={`/junction/units?cat=${s.cat}`} onClick={() => setShowSearch(false)}>
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <s.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 md:gap-3">
                              <h4 className="text-xs md:text-sm font-black uppercase tracking-tighter text-white/90">{s.name}</h4>
                              <Badge className="bg-primary/20 text-primary border-none text-[7px] md:text-[8px] font-black">{s.tag}</Badge>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white/10 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4 opacity-40">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No matching service units</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* DYNAMIC BACKGROUND */}
      <div className={cn(
        "fixed inset-0 pointer-events-none transition-all duration-1000 z-0",
        isDragging ? "opacity-100 scale-100" : "opacity-0 scale-110"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 mt-16 md:mt-20">
        <div className={cn(
          "w-full max-w-4xl transition-all duration-700 flex flex-col items-center gap-8 md:gap-12",
          isProcessing || showSearch ? "scale-95 opacity-40 blur-sm" : "scale-100"
        )}>
          
          {/* LARGE GLOBAL SEARCH BOX */}
          <div className="w-full max-w-2xl relative group animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-[#0d1225]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40">
              <Search className="absolute left-6 md:left-8 w-6 h-6 text-primary" />
              <input 
                readOnly
                onClick={() => setShowSearch(true)}
                placeholder="Search 300+ Service Units..." 
                className="w-full h-16 md:h-20 bg-transparent pl-16 md:pl-20 pr-24 text-base md:text-xl font-black uppercase tracking-widest text-white placeholder:text-muted-foreground/30 cursor-pointer outline-none"
              />
              <div className="absolute right-6 md:right-8 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                <Command className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-black text-muted-foreground">K</span>
              </div>
            </div>
          </div>

          {/* AJN ANIMATION - NOW BELOW SEARCH */}
          <div className={cn("transition-all duration-700", isDragging ? "scale-110" : "scale-100")}>
            <LogoAnimation />
          </div>

          {/* DROP ZONE Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group relative w-full max-w-2xl min-h-[280px] md:min-h-[340px] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04] overflow-hidden shadow-2xl",
              isDragging && "border-primary bg-primary/10 scale-[0.98]"
            )}
          >
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateProcessing(e.target.files[0])} />
            
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-2xl transition-all duration-500",
              isDragging ? "scale-125 rotate-6 bg-primary" : "group-hover:scale-110"
            )}>
              <Upload className={cn("w-8 h-8 md:w-10 md:h-10 transition-colors", isDragging ? "text-white" : "text-white/40")} />
            </div>

            <div className="text-center space-y-2 md:space-y-3 px-6 md:px-8">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">Drop to Optimize</h2>
              <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60">Professional Smart Transcoding System</p>
            </div>

            <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Encrypted</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Scanned</span>
            </div>
          </div>
        </div>

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-3xl animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-8 md:space-y-12 text-center p-8 md:p-12">
              <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-primary/40 border-t-primary rounded-full animate-spin" />
                <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white italic">Processing Engine</h2>
                  <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest truncate max-w-[200px] mx-auto">{fileMeta?.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">
                    <span>{progress}% SYNCHRONIZED</span>
                    <span>{fileMeta?.size}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="py-8 text-[8px] md:text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-auto">
          AJN JUNCTION • GLOBAL NODE • 2025
        </footer>
      </main>
    </div>
  );
}
