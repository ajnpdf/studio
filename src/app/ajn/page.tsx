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
  ArrowRight,
  Zap,
  FileText
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
  { id: 'pdf-docx', name: 'PDF to Word Master', desc: 'Reconstruct layouts via Smart OCR', cat: 'Document', icon: FileText, tag: 'WASM' },
  { id: 'pdf-xlsx', name: 'PDF to Excel Grid', desc: 'Smart table detection & extraction', cat: 'Document', icon: Layers, tag: 'AI' },
  { id: 'img-webp', name: 'Universal WebP Transcode', desc: 'Lossless compression for web nodes', cat: 'Image', icon: ShieldCheck, tag: 'WASM' },
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
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl z-[60] px-4 md:px-8 flex items-center justify-between shadow-sm animate-in fade-in duration-700">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-16 h-8 md:w-24 md:h-12" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-8 md:h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-bold text-[10px] md:text-[11px] uppercase tracking-widest rounded-xl transition-all gap-2 px-3 md:px-4 shadow-sm">
              <Workflow className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden sm:inline">Services</span> Hub
            </Button>
          </Link>
          <div className="h-6 md:h-8 w-px bg-black/5 hidden sm:block" />
          <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white/5 rounded-xl border border-black/5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#000080]" />
            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden xs:inline">Stable Protocol</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center p-4 md:p-6 mt-24 md:mt-32">
        {/* GLOBAL SEARCH BOX - REDUCED SIZE */}
        <div className="w-full max-w-xl relative group animate-in fade-in slide-in-from-top-8 duration-1000 mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#000080]/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-[#000080]/40">
            <Search className="absolute left-5 md:left-6 w-5 h-5 text-[#000080]" />
            <input 
              readOnly
              onClick={() => setShowSearch(true)}
              placeholder="Search 300+ service units..." 
              className="w-full h-14 md:h-16 bg-transparent pl-14 md:pl-16 pr-20 text-sm md:text-base font-bold text-slate-900 placeholder:text-slate-900/30 cursor-pointer outline-none"
            />
            <div className="absolute right-5 md:right-6 flex items-center gap-2 px-2.5 py-1 bg-black/5 rounded-lg border border-black/5">
              <Command className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[9px] font-bold text-muted-foreground">K</span>
            </div>
          </div>
        </div>

        {/* AJN ANIMATION - CENTERED */}
        <div className={cn("transition-all duration-1000 mb-10 animate-in zoom-in-95 duration-1000", isDragging ? "scale-110" : "scale-100")}>
          <LogoAnimation className="w-48 h-20 md:w-64 md:h-28" />
        </div>

        <div className={cn(
          "w-full max-w-3xl transition-all duration-1000 flex flex-col items-center gap-8 md:gap-10",
          isProcessing || showSearch ? "scale-95 opacity-40 blur-sm" : "scale-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
        )}>
          
          {/* DROP ZONE Area - REDUCED SIZE */}
          <div className="w-full max-w-xl space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative w-full min-h-[200px] md:min-h-[260px] bg-white/40 backdrop-blur-md border-2 border-dashed border-black/5 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:border-[#000080]/40 hover:bg-white/60 overflow-hidden shadow-xl hover:shadow-[#000080]/5",
                isDragging && "border-[#000080] bg-[#000080]/5 scale-[0.98]"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && simulateProcessing(e.target.files[0])} />
              
              <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 bg-[#000080]/5 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm transition-all duration-500",
                isDragging ? "scale-125 rotate-6 bg-[#000080]" : "group-hover:scale-110"
              )}>
                <Upload className={cn("w-6 h-6 md:w-8 md:h-8 transition-colors", isDragging ? "text-white" : "text-[#000080]")} />
              </div>

              <div className="text-center space-y-1.5 md:space-y-2 px-6 md:px-8">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none">Drop to Optimize</h2>
                <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Smart Processing Gateway</p>
              </div>

              <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-[8px] md:text-[9px] font-bold uppercase text-muted-foreground/40 tracking-widest">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Encrypted</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Local</span>
              </div>
            </div>
            
            {/* Small Letters Hint - PROPER CASING */}
            <div className="flex justify-center gap-6 text-[8px] font-bold uppercase tracking-[0.3em] text-slate-900/30 animate-pulse">
              <span>Drag files here</span>
              <span>•</span>
              <span>Auto-detect format</span>
              <span>•</span>
              <span>Secure buffer</span>
            </div>
          </div>

          {/* PDF SERVICE TICKER */}
          <div className="w-full overflow-hidden mt-8 mb-16 relative group animate-in fade-in duration-1000 delay-500">
            <div className="flex animate-marquee-fast whitespace-nowrap gap-10 items-center mb-4">
              {[...PDF_SERVICES, ...PDF_SERVICES].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#000080]/60" />
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-800 tracking-wider">{s}</span>
                </div>
              ))}
            </div>
            <div className="flex animate-marquee-slow-reverse whitespace-nowrap gap-10 items-center opacity-30">
              {[...PDF_SERVICES, ...PDF_SERVICES].reverse().map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-[9px] font-medium text-slate-600 tracking-wide">{s}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#e9cdfa] via-[#e9cdfa]/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#c8e4f7] via-[#c8e4f7]/80 to-transparent z-10" />
          </div>
        </div>

        {/* SEARCH OVERLAY */}
        {showSearch && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-0 md:pt-[15vh] px-0 md:px-6 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full h-full md:h-auto md:max-w-xl bg-white border-none md:border md:border-black/5 md:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
              <div className="p-4 md:p-5 border-b border-black/5 relative flex items-center">
                <Search className="absolute left-6 md:left-7 w-4 h-4 text-[#000080]" />
                <Input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a smart service..." 
                  className="h-12 md:h-14 pl-12 md:pl-14 pr-12 bg-transparent border-none text-base font-bold placeholder:opacity-30 focus-visible:ring-0 text-slate-900"
                />
                <button onClick={() => setShowSearch(false)} className="absolute right-6 md:right-7 p-2 hover:bg-black/5 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <ScrollArea className="h-[calc(100vh-120px)] md:max-h-[50vh]">
                <div className="p-2 md:p-3 space-y-4 md:space-y-5">
                  {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1 md:gap-1.5">
                      {filteredServices.map((s) => (
                        <Link key={s.id} href={`/tools/${s.id}`} onClick={() => setShowSearch(false)}>
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-3.5 rounded-xl hover:bg-[#000080]/5 transition-all group cursor-pointer border border-transparent hover:border-[#000080]/10">
                            <div className="w-10 h-10 bg-[#000080]/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <s.icon className="w-5 h-5 text-[#000080]" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs md:text-sm font-bold text-slate-800">{s.name}</h4>
                                <Badge className="bg-[#000080]/10 text-[#000080] border-none text-[7px] md:text-[8px] font-black">{s.tag}</Badge>
                              </div>
                              <p className="text-[10px] md:text-xs text-muted-foreground font-medium truncate">{s.desc}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 md:w-4 h-4 text-black/10 group-hover:text-[#000080] transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-3 opacity-40">
                      <Search className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No matching service units</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-3xl animate-in fade-in duration-500">
            <div className="w-full max-w-sm space-y-8 md:space-y-10 text-center p-8">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#000080]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-[#000080]/40 border-t-[#000080] rounded-full animate-spin" />
                <BrainCircuit className="w-10 h-10 text-[#000080]" />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">Processing Engine</h2>
                  <p className="text-[10px] font-bold text-[#000080] uppercase tracking-widest truncate max-w-[200px] mx-auto">{fileMeta?.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground px-1 tracking-widest">
                    <span>{progress}% Synchronized</span>
                    <span>{fileMeta?.size}</span>
                  </div>
                  <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
                    <div 
                      className="h-full bg-[#000080] transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="py-8 text-[9px] font-bold text-slate-900/20 uppercase tracking-[0.4em] mt-auto animate-in fade-in duration-1000 delay-700">
          AJN Junction • Global Node • 2025
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
