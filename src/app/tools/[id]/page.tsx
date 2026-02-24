"use client";

import { use, useState, useEffect } from 'react';
import { UnitWorkspace } from '@/components/junction/unit-workspace';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Activity, Settings2, History, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { ALL_UNITS } from '@/components/junction/services-grid';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Tool Specific Page - Professional Advance Setup
 * Optimized for real-time document transformation.
 */
export default function ToolPage({ params }: Props) {
  const { id } = use(params);
  const tool = ALL_UNITS.find(u => u.id === id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!tool) {
    notFound();
  }

  if (!mounted) return null;

  return (
    <div className="h-screen text-slate-950 flex flex-col overflow-hidden relative font-sans">
      <NightSky />
      
      {/* PROFESSIONAL TOOLBAR */}
      <header className="h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/ajn" className="flex items-center group">
            <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Secure Session Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Encrypted Local Buffer</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/tools/${id}/guide`}>
            <Button variant="ghost" className="h-9 border-black/5 bg-black/5 hover:bg-primary hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4">
              <BookOpen className="w-3.5 h-3.5" /> Technical Briefing
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-950/40 hover:text-slate-950">
            <History className="w-4 h-4" />
          </Button>
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm">
              <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {/* Tool Header - Professional Context */}
        <div className="px-10 pt-8 pb-4 flex items-end justify-between border-b border-black/5 bg-white/20">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase px-2 h-4.5 tracking-widest">{tool.cat}</Badge>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-slate-950 leading-none">
                {tool.name}
              </h1>
            </div>
            <p className="text-[10px] text-slate-950/40 font-bold uppercase tracking-[0.3em]">
              {tool.desc} • Use for student purpose and business purpose • useful to students and business and more
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-xl border border-black/5">
              <Settings2 className="w-3.5 h-3.5 text-slate-950/40" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-950/60">Advanced Protocol</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <UnitWorkspace defaultCategory={tool.cat} initialUnitId={id} />
        </div>

        {/* Footer Attribution */}
        <footer className="h-12 border-t border-black/5 bg-white/40 backdrop-blur-md flex items-center justify-center px-8 shrink-0">
          <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">
            AJN Workspace • 2026 • Made in INDIAN❤️
          </p>
        </footer>
      </main>
    </div>
  );
}
