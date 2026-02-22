
"use client";

import { UnitWorkspace } from '@/components/junction/unit-workspace';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Network, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * AJN Units Page
 * Immersive workspace for executing neural transformations.
 */
function UnitsContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'Document';

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden">
      <NightSky />
      
      {/* PROFESSIONAL WORKSPACE HEADER */}
      <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/junction" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-white rounded-lg shadow-2xl transition-all group-hover:rotate-6">
              <Network className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-sm tracking-tighter uppercase">Neural Unit Workspace</span>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Worker: Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">WASM Stable</span>
            </div>
          </div>
        </div>

        <Link href="/junction">
          <Button variant="outline" className="h-9 border-white/10 bg-white/5 hover:bg-white hover:text-black font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-2xl">
            <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
          </Button>
        </Link>
      </header>

      <main className="flex-1 overflow-hidden">
        <UnitWorkspace defaultCategory={initialCat} />
      </main>
    </div>
  );
}

export default function UnitsPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-background flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Neural Layer...</div>}>
      <UnitsContent />
    </Suspense>
  );
}
