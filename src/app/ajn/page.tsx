import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { Network, Zap, Shield, Cpu, Activity, ArrowRight, Binary, Workflow, Globe } from 'lucide-react';
import Link from 'next/link';

/**
 * AJN Core Page
 * An immersive, high-fidelity deep dive into the AJN Network architecture.
 */
export default function AJNPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body">
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white rounded-lg shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
            <Network className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">AJN</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-6">
            {['Protocol', 'Sectors', 'Architecture', 'Nodes'].map(item => (
              <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">{item}</button>
            ))}
          </nav>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Network Stable</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-32 relative z-10">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center space-y-12 py-12">
          <div className="animate-in fade-in zoom-in-95 duration-1000">
            <LogoAnimation />
          </div>
          
          <div className="space-y-6 max-w-3xl animate-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Activity className="w-3 h-3 animate-pulse" /> Live Neural Junction
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              All-in-one <br />
              <span className="text-white/10">Junction Network</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-lg uppercase tracking-widest leading-relaxed opacity-60 max-w-2xl mx-auto">
              The singular operating layer for global data streams. <br />
              High-concurrency neural processing, delivered in real-time.
            </p>
            <div className="pt-8 flex flex-col items-center gap-4">
              <Button className="h-16 px-12 bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                Initialize Connection <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">v1.0 Production Alpha • Global Node Access</p>
            </div>
          </div>
        </section>

        {/* METRICS HUD */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { label: "Active Nodes", val: "1,242" },
            { label: "Latency", val: "14ms" },
            { label: "Success Rate", val: "99.98%" },
            { label: "Throughput", val: "4.2 GB/s" }
          ].map((m, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-xl">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-2xl font-black tracking-tighter text-white">{m.val}</p>
            </div>
          ))}
        </section>

        {/* PILLARS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Universal Routing", 
              desc: "Mapping 300+ format combinations via real-time WebAssembly workers.", 
              icon: Workflow,
              color: "text-blue-400"
            },
            { 
              title: "Neural Logic", 
              desc: "Deep semantic analysis and OCR layers processed locally in-browser.", 
              icon: Cpu,
              color: "text-primary"
            },
            { 
              title: "Encrypted Vaults", 
              desc: "End-to-end 256-bit encryption for seamless session-based processing.", 
              icon: Shield,
              color: "text-emerald-400"
            }
          ].map((pillar, i) => (
            <div 
              key={i} 
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                <pillar.icon className="w-32 h-32" />
              </div>
              <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 ${pillar.color}`}>
                <pillar.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">{pillar.title}</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-60">
                {pillar.desc}
              </p>
            </div>
          ))}
        </section>

        {/* INFRASTRUCTURE MAP STUB */}
        <section className="py-24 border-y border-white/5">
          <div className="flex flex-col items-center gap-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Global Infrastructure Map</h3>
            <div className="relative w-full aspect-[21/9] bg-white/[0.02] rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center group">
               <Globe className="w-32 h-32 text-primary/20 animate-pulse transition-all group-hover:scale-110" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: `${i * 0.5}s` }} />
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* TECH STACK FOOTER */}
        <footer className="text-center space-y-8 pt-20 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             {['WASM', 'FFmpeg', 'Tesseract', 'PDF-Lib', 'Three.js'].map(tech => (
               <span key={tech} className="text-[10px] font-black tracking-[0.3em] uppercase">{tech}</span>
             ))}
          </div>
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em]">
            AJN JUNCTION • GLOBAL DATA LAYER • 2025
          </p>
          <Link href="/" className="inline-block text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.3em]">
            ← Return to Interface
          </Link>
        </footer>
      </main>
    </div>
  );
}
