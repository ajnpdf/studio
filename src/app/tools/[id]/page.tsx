"use client";

import { use } from 'react';
import { UnitWorkspace } from '@/components/junction/unit-workspace';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { ALL_UNITS } from '@/components/junction/services-grid';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Tool Specific Page - Professional Light Theme
 */
export default function ToolPage({ params }: Props) {
  const { id } = use(params);
  const tool = ALL_UNITS.find(u => u.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="h-screen text-foreground flex flex-col overflow-hidden relative">
      <NightSky />
      
      {/* PROFESSIONAL TOOLBAR */}
      <header className="h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/junction" className="flex items-center group">
            <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Active Session</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Secure Buffer</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm">
              <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        <div className="h-full flex flex-col">
          {/* Tool Hero Info - Proper Case */}
          <div className="p-8 pb-0 text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
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
