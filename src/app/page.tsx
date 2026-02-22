
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Network } from 'lucide-react';

/**
 * AJN Minimal Standalone Landing
 * A focused, high-fidelity brand experience.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
      <main className="w-full max-w-5xl flex flex-col items-center gap-16">
        {/* CENTERPIECE NEURAL ANIMATION */}
        <LogoAnimation />
        
        {/* MINIMAL BRAND IDENTIFIER */}
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">AJN – All-in-one Junction Network</h1>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-white/10"></span>
              <p className="text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase">Every File. One Smart Network.</p>
              <span className="w-8 h-px bg-white/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/ajn">
              <Button className="h-12 px-8 bg-white text-black hover:bg-white/90 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all gap-3 shadow-2xl">
                Discover the Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all gap-3 shadow-2xl">
                <Network className="w-4 h-4" /> Access Junction
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
