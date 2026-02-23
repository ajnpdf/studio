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
  ArrowRight,
  Zap,
  FileText,
  Cpu,
  Lock,
  Network
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const PDF_SERVICES = [
  "JPG to PDF", "Word to PDF", "PowerPoint to PDF", "Excel to PDF", "HTML to PDF",
  "PDF to JPG", "PDF to Word", "PDF to PowerPoint", "PDF to Excel", "PDF to PDF/A"
];

const QUICK_UNITS = [
  { id: 'pdf-word', name: 'PDF to Word Master', desc: 'Reconstruct layouts via Smart OCR', cat: 'Document', icon: FileText, tag: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel Grid', desc: 'Smart table detection & extraction', cat: 'Document', icon: Layers, tag: 'AI' },
  { id: 'word-pdf', name: 'Universal Word to PDF', desc: 'High-fidelity OOXML reconstruction', cat: 'Document', icon: ShieldCheck, tag: 'WASM' },
];

export default function AJNPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      className="h-screen text-slate-950 selection:bg-primary/10 relative font-body flex flex-col overflow-hidden"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) simulateProcessing(e.dataTransfer.files[0]); }}
    >
      <NightSky />
      
      {/* HUD Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-black/5 bg-white/40 backdrop-blur-xl z-[60] px-8 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-20 h-10" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-bold text-[10px] tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm text-slate-950">
              <Workflow className="w-3.5 h-3.5" /> Services Hub
            </Button>
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl border border-black/5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-slate-950/60 tracking-widest uppercase">Protocol Secured</span>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 mt-20 scrollbar-hide">
        <div className="flex flex-col items-center">
          {/* Top Focal Search */}
          <div className="w-full max-w-xl relative group animate-in fade-in slide-in-from-top-8 duration-1000 mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40">
              <Search className="absolute left-6 w-5 h-5 text-primary" />
              <input 
                readOnly
                onClick={() => setShowSearch(true)}
                placeholder="Search 300+ service units..." 
                className="w-full h-14 bg-transparent pl-16 pr-20 text-sm font-bold text-slate-950 placeholder:text-slate-950/30 cursor-pointer outline-none"
              />
              <div className="absolute right-6 flex items-center gap-2 px-2.5 py-1 bg-black/5 rounded-lg border border-black/5">
                <Command className="w-2.5 h-2.5 text-slate-950/40" />
                <span className="text-[9px] font-bold text-slate-950/40">K</span>
              </div>
            </div>
          </div>

          {/* Brand Centerpiece */}
          <div className={cn("transition-all duration-1000 mb-10 animate-in zoom-in-95", isDragging ? "scale-110" : "scale-100")}>
            <LogoAnimation className="w-64 h-28" />
          </div>

          <div className={cn(
            "w-full max-w-3xl transition-all duration-1000 flex flex-col items-center gap-10",
            isProcessing || showSearch ? "scale-95 opacity-40 blur-sm" : "scale-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
          )}>
            
            {/* Enhanced Drop Zone */}
            <div className="w-full max-w-xl space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative w-full min-h-[200px] bg-white/40 backdrop-blur-md border-2 border-dashed border-black/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-primary/40 hover:bg-white/60 overflow-hidden shadow-xl",
                  isDragging && "border-primary bg-primary/5 scale-[0.98]"
                )}
              >
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateProcessing(e.target.files[0])} />
                
                <div className={cn(
                  "w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all duration-500",
                  isDragging ? "scale-125 rotate-6 bg-primary" : "group-hover:scale-110"
                )}>
                  <Upload className={cn("w-7 h-7 transition-colors", isDragging ? "text-white" : "text-primary")} />
                </div>

                <div className="text-center space-y-1.5 px-8">
                  <h2 className="text-xl font-black tracking-tight text-slate-950 leading-none">Drop to Optimize</h2>
                  <p className="text-[10px] font-bold text-slate-950/40 tracking-[0.3em] uppercase">In-Session Processing Buffer</p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-6 text-[9px] font-bold text-slate-950/30 tracking-widest uppercase">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Encrypted</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> 100% Local</span>
                </div>
              </div>
              
              {/* Micro-Hints */}
              <div className="flex justify-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-950/30 animate-pulse">
                <span>Drag files here</span>
                <span>•</span>
                <span>Auto-detect format</span>
                <span>•</span>
                <span>Secure buffer</span>
              </div>
            </div>

            {/* Infrastructure Monitor */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 animate-in fade-in duration-1000 delay-500">
              {[
                { label: 'Neural Ingestion', sub: 'Node 01 Active', icon: Cpu, color: 'text-blue-600' },
                { label: 'Velocity Pipeline', sub: 'Optimal Velocity', icon: Zap, color: 'text-amber-600' },
                { label: 'Buffer Isolation', sub: '256-bit Secure', icon: Lock, color: 'text-emerald-600' },
                { label: 'Protocol Mesh', sub: '300+ Units Sync', icon: Network, color: 'text-indigo-600' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl space-y-2 group hover:border-primary/20 transition-all cursor-default shadow-sm">
                  <div className="flex items-center justify-between">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-950 tracking-tight leading-tight uppercase">{stat.label}</p>
                    <p className="text-[8px] font-bold text-slate-950/40 tracking-widest uppercase">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Marquee */}
            <div className="w-full overflow-hidden mt-8 mb-16 relative group animate-in fade-in duration-1000 delay-700">
              <div className="flex animate-marquee-fast whitespace-nowrap gap-10 items-center mb-4">
                {[...PDF_SERVICES, ...PDF_SERVICES].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span className="text-[11px] font-black text-slate-950 tracking-wider uppercase">{s}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#e9cdfa] via-[#e9cdfa]/80 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#c8e4f7] via-[#c8e4f7]/80 to-transparent z-10" />
            </div>
          </div>
        </div>

        {/* Global Search Overlay */}
        {showSearch && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white border border-black/5 rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
              <div className="p-5 border-b border-black/5 relative flex items-center">
                <Search className="absolute left-7 w-4 h-4 text-primary" />
                <Input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a smart service..." 
                  className="h-14 pl-14 pr-12 bg-transparent border-none text-base font-bold placeholder:opacity-30 focus-visible:ring-0 text-slate-950"
                />
                <button onClick={() => setShowSearch(false)} className="absolute right-7 p-2 hover:bg-black/5 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-slate-950/40" />
                </button>
              </div>
              
              <ScrollArea className="max-h-[50vh]">
                <div className="p-3 space-y-5">
                  <div className="grid grid-cols-1 gap-1.5">
                    {QUICK_UNITS.map((s) => (
                      <Link key={s.id} href={`/tools/${s.id}`} onClick={() => setShowSearch(false)}>
                        <div className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-primary/5 transition-all group cursor-pointer border border-transparent hover:border-primary/10">
                          <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/10">
                            <s.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 overflow-hidden text-slate-950">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black uppercase">{s.name}</h4>
                              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black">{s.tag}</Badge>
                            </div>
                            <p className="text-[10px] opacity-60 font-black uppercase truncate tracking-widest">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-black/10 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        <footer className="py-8 text-[10px] font-black text-slate-900/20 tracking-[0.5em] mt-auto text-center">
          AJN Junction • Global Node • 2025
        </footer>
      </main>

      <style jsx global>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 40s linear infinite;
        }
      `}</style>
    </div>
  );
}