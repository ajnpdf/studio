import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Network, ShieldCheck } from 'lucide-react';

/**
 * AJN Minimal Standalone Landing - Professional Light Theme
 * Synced with global animated atmosphere.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* HUD Accent */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black text-slate-950/40 uppercase tracking-[0.3em]">Node Protocol Active</span>
      </div>

      <main className="w-full max-w-5xl flex flex-col items-center gap-12 relative z-10">
        {/* CENTERPIECE NEURAL ANIMATION - Navy Blue */}
        <LogoAnimation className="w-80 h-40" />
        
        {/* MINIMAL BRAND IDENTIFIER */}
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase leading-none">
              All-in-one Junction Network
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-black/10"></span>
              <p className="text-slate-950/40 text-[10px] md:text-[11px] font-black tracking-[0.5em] uppercase">
                Every File. One Smart Network.
              </p>
              <span className="w-12 h-px bg-black/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/ajn">
              <Button className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all gap-3 shadow-2xl shadow-primary/20 hover:scale-105">
                Discover the Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-14 px-10 border-black/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all gap-3 shadow-xl hover:bg-white/60 hover:border-primary/40">
                <Network className="w-4 h-4 text-primary" /> Access Junction
              </Button>
            </Link>
          </div>

          {/* Infrastructure Verification */}
          <div className="pt-8 flex items-center justify-center gap-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">WASM Buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Neural Mesh</span>
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