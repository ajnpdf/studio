
import { LogoAnimation } from '@/components/landing/logo-animation';

/**
 * AJN Minimal Standalone Landing
 * A focused, high-fidelity brand experience.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sufw-gradient flex flex-col items-center justify-center p-6 overflow-hidden">
      <main className="w-full max-w-5xl flex flex-col items-center gap-16">
        {/* CENTERPIECE NEURAL ANIMATION */}
        <LogoAnimation />
        
        {/* MINIMAL BRAND IDENTIFIER */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">AJN – All-in-one Junction Network</h1>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-white/10"></span>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase">Every File. One Smart Network.</p>
            <span className="w-8 h-px bg-white/10"></span>
          </div>
        </div>
      </main>
    </div>
  );
}
