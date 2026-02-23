import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Network, ShieldCheck } from 'lucide-react';

/**
 * AJN Landing Page - High-Fidelity Professional Entrance
 * Strictly Non-Scrollable, High-Contrast Black Text, Proper Case.
 */
export default function LandingPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden relative text-slate-950">
      <main className="w-full max-w-5xl flex flex-col items-center gap-10 md:gap-14 relative z-10 -mt-12 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Centerpiece Navy Blue Logo */}
        <LogoAnimation className="w-64 h-32 md:w-80 md:h-40" />
        
        <div className="text-center space-y-8 md:space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none">
              All-in-One Junction Network
            </h1>
            <div className="flex items-center justify-center gap-6">
              <span className="w-12 h-px bg-slate-950/10"></span>
              <p className="text-slate-950/60 text-[10px] md:text-[12px] font-bold tracking-[0.4em] uppercase">
                Every File. One Smart Network.
              </p>
              <span className="w-12 h-px bg-slate-950/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link href="/ajn">
              <Button className="h-14 md:h-16 px-10 md:px-12 bg-primary text-white hover:bg-primary/90 font-black text-xs rounded-2xl transition-all gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95">
                Discover the Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-14 md:h-16 px-10 md:px-12 border-slate-950/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-xs rounded-2xl transition-all gap-3 shadow-xl hover:bg-white/60 hover:border-primary/40 active:scale-95">
                <Network className="w-4 h-4 text-primary" /> Access Junction
              </Button>
            </Link>
          </div>

          {/* Infrastructure Metrics */}
          <div className="pt-10 flex items-center justify-center gap-12 opacity-60 transition-all duration-700 hover:opacity-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Wasm Buffer</span>
            </div>
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-slate-950" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Neural Mesh</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-8 text-[10px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
        AJN Global Node • 2025
      </footer>
    </div>
  );
}
