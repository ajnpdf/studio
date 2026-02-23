"use client";

import { useState, useRef, useEffect } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Upload,
  CheckCircle2,
  Workflow,
  Search,
  Command,
  X,
  Layers,
  BrainCircuit,
  Cpu,
  Lock,
  Globe,
  Gauge,
  ArrowRight,
  Activity,
  Zap,
  Network
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const PDF_SERVICES = [
  "Merge PDF", "Split PDF", "Compress PDF", "PDF to Word", "PDF to PowerPoint", 
  "PDF to Excel", "Word to PDF", "PowerPoint to PDF", "Excel to PDF", "Edit PDF", 
  "PDF to JPG", "JPG to PDF", "Sign PDF", "Watermark", "Rotate PDF", 
  "HTML to PDF", "Unlock PDF", "Protect PDF", "Organize PDF", "PDF to PDF/A", 
  "Repair PDF", "Page numbers", "Scan to PDF", "OCR PDF", "Compare PDF", 
  "Redact PDF", "Crop PDF", "Translate PDF"
];

const ALL_SERVICES = [
  { id: 'pdf-docx', name: 'PDF to Word Master', desc: 'Reconstruct layouts via Smart OCR', cat: 'Document', icon: ShieldCheck, tag: 'WASM' },
  { id: 'pdf-xlsx', name: 'PDF to Excel Grid', desc: 'Smart table detection & extraction', cat: 'Document', icon: Layers, tag: 'AI' },
  { id: 'img-webp', name: 'Universal WebP Transcode', desc: 'Lossless compression for web nodes', cat: 'Image', icon: ShieldCheck, tag: 'WASM' },
];

const ADVANCED_FEATURES = [
  { icon: BrainCircuit, title: "Neural Ingestion Core", desc: "High-fidelity data acquisition via distributed processing nodes." },
  { icon: Zap, title: "Velocity Pipeline", desc: "High-throughput architecture optimized for mission-critical workloads." },
  { icon: Lock, title: "Buffer Isolation", desc: "Ephemeral session-based security with 256-bit cryptographic anchoring." },
  { icon: Network, title: "Protocol Mesh", desc: "Seamless semantic mapping across 300+ professional service units." }
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
      className="min-h-screen text-foreground selection:bg-primary/10 relative overflow-hidden font-body flex flex-col"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) simulateProcessing(e.dataTransfer.files[0]); }}
    >
      <NightSky />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl z-[60] px-4 md:px-8 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-16 h-8 md:w-24 md:h-12" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-8 md:h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest rounded-xl transition-all gap-2 px-3 md:px-4 shadow-sm">
              <Workflow className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden sm:inline">Services</span> Hub
            </Button>
          </Link>
          <div className="h-6 md:h-8 w-px bg-black/5 hidden sm:block" />
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 rounded-xl border border-black/5">
            <ShieldCheck className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-600" />
            <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest hidden xs:inline">STABLE PROTOCOL</span>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-0 md:pt-[15vh] px-0 md:px-6 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full h-full md:h-auto md:max-w-2xl bg-white border-none md:border md:border-black/5 md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="p-4 md:p-6 border-b border-black/5 relative flex items-center">
              <Search className="absolute left-6 md:left-8 w-5 h-5 text-primary" />
              <Input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a smart service..." 
                className="h-12 md:h-14 pl-12 md:pl-14 pr-12 bg-transparent border-none text-base md:text-lg font-bold placeholder:opacity-30 focus-visible:ring-0 text-slate-900"
              />
              <button onClick={() => setShowSearch(false)} className="absolute right-6 md:right-8 p-2 hover:bg-black/5 rounded-xl transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-120px)] md:max-h-[60vh]">
              <div className="p-2 md:p-4 space-y-4 md:space-y-6">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1 md:gap-2">
                    {filteredServices.map((s) => (
                      <Link key={s.id} href={`/junction/units?cat=${s.cat}`} onClick={() => setShowSearch(false)}>
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-primary/5 transition-all group cursor-pointer border border-transparent hover:border-primary/10">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <s.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 md:gap-3">
                              <h4 className="text-xs md:sm font-black uppercase tracking-tighter text-slate-800">{s.name}</h4>
                              <Badge className="bg-primary/10 text-primary border-none text-[7px] md:text-[8px] font-black">{s.tag}</Badge>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 md:w-4 h-4 text-black/10 group-hover:text-primary transition-colors" />
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

      <main className="relative z-10 flex-1 flex flex-col items-center p-4 md:p-6 mt-24 md:mt-32">
        {/* ADVANCED PDF SERVICE TICKER */}
        <div className="w-full overflow-hidden mb-12 relative group">
          <div className="flex animate-marquee-fast whitespace-nowrap gap-12 items-center mb-4">
            {[...PDF_SERVICES, ...PDF_SERVICES].map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-black/5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(30,58,138,0.5)]" />
                <span className="text-[10px] md:text-[12px] font-black text-slate-900 tracking-[0.2em] uppercase">{s}</span>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee-slow-reverse whitespace-nowrap gap-12 items-center opacity-40">
            {[...PDF_SERVICES, ...PDF_SERVICES].reverse().map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-slate-600 tracking-[0.4em] uppercase">{s}</span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#e9cdfa] via-[#e9cdfa]/80 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#c8e4f7] via-[#c8e4f7]/80 to-transparent z-10" />
        </div>

        <div className={cn(
          "w-full max-w-4xl transition-all duration-700 flex flex-col items-center gap-8 md:gap-12",
          isProcessing || showSearch ? "scale-95 opacity-40 blur-sm" : "scale-100"
        )}>
          
          {/* 1. LARGE GLOBAL SEARCH BOX - FIRST */}
          <div className="w-full max-w-2xl relative group animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40">
              <Search className="absolute left-6 md:left-8 w-6 h-6 text-primary" />
              <input 
                readOnly
                onClick={() => setShowSearch(true)}
                placeholder="Search 300+ Service Units..." 
                className="w-full h-16 md:h-20 bg-transparent pl-16 md:pl-20 pr-24 text-base md:text-xl font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-900/30 cursor-pointer outline-none"
              />
              <div className="absolute right-6 md:right-8 flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-xl border border-black/5">
                <Command className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-black text-muted-foreground">K</span>
              </div>
            </div>
          </div>

          {/* 2. AJN ANIMATION - MIDDLE */}
          <div className={cn("transition-all duration-700", isDragging ? "scale-110" : "scale-100")}>
            <LogoAnimation />
          </div>

          {/* 3. DROP ZONE Area */}
          <div className="w-full max-w-2xl space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative w-full min-h-[280px] md:min-h-[340px] bg-white/40 backdrop-blur-md border-2 border-dashed border-black/5 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-primary/40 hover:bg-white/60 overflow-hidden shadow-xl",
                isDragging && "border-primary bg-primary/10 scale-[0.98]"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateProcessing(e.target.files[0])} />
              
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-sm transition-all duration-500",
                isDragging ? "scale-125 rotate-6 bg-primary" : "group-hover:scale-110"
              )}>
                <Upload className={cn("w-8 h-8 md:w-10 md:h-10 transition-colors", isDragging ? "text-white" : "text-primary")} />
              </div>

              <div className="text-center space-y-2 md:space-y-3 px-6 md:px-8">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 uppercase leading-none">Drop to Optimize</h2>
                <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60">Professional Smart Processing System</p>
              </div>

              <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Encrypted</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Local</span>
              </div>
            </div>
            {/* Small Letters Hint */}
            <div className="flex justify-center gap-6 text-[7px] font-black uppercase tracking-[0.4em] text-slate-900/30 animate-pulse">
              <span>Drag files here</span>
              <span>•</span>
              <span>Auto-detect format</span>
              <span>•</span>
              <span>Secure buffer</span>
            </div>
          </div>

          {/* 4. PROFESSIONAL ADVANCED CAPABILITIES GRID */}
          <section className="w-full max-w-5xl py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {ADVANCED_FEATURES.map((f, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-white/40 backdrop-blur-md border border-black/5 hover:border-primary/20 transition-all group shadow-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-900 mb-3">{f.title}</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold leading-relaxed uppercase tracking-wider opacity-60">{f.desc}</p>
              </div>
            ))}
          </section>
        </div>

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-3xl animate-in fade-in duration-500">
            <div className="w-full max-w-md space-y-8 md:space-y-12 text-center p-8 md:p-12">
              <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-primary/40 border-t-primary rounded-full animate-spin" />
                <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 italic">Processing Engine</h2>
                  <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest truncate max-w-[200px] mx-auto">{fileMeta?.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">
                    <span>{progress}% SYNCHRONIZED</span>
                    <span>{fileMeta?.size}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
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

        <footer className="py-8 text-[8px] md:text-[9px] font-black text-slate-900/20 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-auto">
          AJN JUNCTION • GLOBAL NODE • 2025
        </footer>
      </main>

      <style jsx global>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-slow-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 40s linear infinite;
        }
        .animate-marquee-slow-reverse {
          animation: marquee-slow-reverse 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
