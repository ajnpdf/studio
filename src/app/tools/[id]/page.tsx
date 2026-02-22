
"use client";

import { use } from 'react';
import { UnitWorkspace } from '@/components/junction/unit-workspace';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Activity, Cpu } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { ALL_UNITS } from '@/components/junction/services-grid';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ToolPage({ params }: Props) {
  const { id } = use(params);
  const tool = ALL_UNITS.find(u => u.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden">
      <NightSky />
      
      {/* PROFESSIONAL TOOLBAR */}
      <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/junction" className="flex items-center gap-2 group">
            <LogoAnimation className="w-14 h-7" showGlow={false} />
            <span className="font-black text-sm tracking-tighter uppercase ml-[-4px]">
              {tool.name} <span className="text-primary/60 ml-2 hidden sm:inline">UNIT: {id.toUpperCase()}</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-white/10 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">WASM Worker</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Buffer Secured</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-white/10 bg-white/5 hover:bg-white hover:text-black font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-2xl">
              <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Tool Hero Info */}
          <div className="p-8 pb-0 text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              {tool.name}
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-60 max-w-2xl mx-auto leading-relaxed">
              {tool.desc}
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <UnitWorkspace defaultCategory={tool.cat} initialUnitId={id} />
          </div>
        </div>
      </main>
    </div>
  );
}
