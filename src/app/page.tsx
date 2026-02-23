import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Network, ShieldCheck } from 'lucide-react';

/**
 * AJN Minimal Standalone Landing - Professional Overhaul
 * Fixed layout to prevent scrolling, removed Node Protocol label.
 */
export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <main className="w-full max-w-5xl flex flex-col items-center gap-8 md:gap-12 relative z-10 -mt-12">
        {/* Centerpiece Neural Animation - Navy Blue */}
        <LogoAnimation className="w-64 h-32 md:w-80 md:h-40" />
        
        {/* Minimal Brand Identifier - Proper Case & Black Text */}
        <div className="text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 leading-none">
              All-in-One Junction Network
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-black/10"></span>
              <p className="text-slate-950/60 text-[9px] md:text-[11px] font-bold tracking-[0.4em] uppercase">
                Every File. One Smart Network.
              </p>
              <span className="w-8 h-px bg-black/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/ajn">
              <Button className="h-12 md:h-14 px-8 md:px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all gap-3 shadow-2xl shadow-primary/20 hover:scale-105">
                Discover the Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-12 md:h-14 px-8 md:px-10 border-black/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all gap-3 shadow-xl hover:bg-white/60 hover:border-primary/40">
                <Network className="w-4 h-4 text-primary" /> Access Junction
              </Button>
            </Link>
          </div>

          {/* Infrastructure Verification - Proper Case & Black Text */}
          <div className="pt-6 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-950">Wasm Buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-slate-950" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-950">Neural Mesh</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-8 text-[9px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
        AJN Global Node • 2025
      </footer>
    </div>
  );
}