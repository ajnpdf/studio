"use client";

import { UnitWorkspace } from '@/components/junction/unit-workspace';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';

/**
 * AJN Units Page - Professional Light Theme
 * Immersive workspace for executing smart transformations.
 */
function UnitsContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'Document';

  return (
    <div className="h-screen text-foreground flex flex-col overflow-hidden relative">
      <NightSky />
      
      {/* PROFESSIONAL WORKSPACE HEADER */}
      <header className="h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/junction" className="flex items-center group">
            <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Active Node</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Stable Protocol</span>
            </div>
          </div>
        </div>

        <Link href="/junction">
          <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
          </Button>
        </Link>
      </header>

      <main className="flex-1 overflow-hidden relative z-10">
        <UnitWorkspace defaultCategory={initialCat} />
      </main>
    </div>
  );
}

export default function UnitsPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-transparent flex items-center justify-center font-black uppercase tracking-[0.5em] text-primary/20">Loading Layer...</div>}>
      <UnitsContent />
    </Suspense>
  );
}
