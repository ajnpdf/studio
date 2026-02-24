"use client";

import { use, useState, useEffect } from 'react';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Activity, Info, CheckCircle2, Zap, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { ALL_UNITS } from '@/components/junction/services-grid';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * AJN Specialty Guide Page - Professional Technical Briefing
 * Comprehensive documentation for each specialized tool in the network.
 */
export default function ToolGuidePage({ params }: Props) {
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
    <div className="min-h-screen text-slate-950 flex flex-col relative font-sans bg-transparent overflow-y-auto scrollbar-hide">
      <NightSky />
      
      {/* PROFESSIONAL TOOLBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/ajn" className="flex items-center group">
            <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          </Link>
          <div className="h-6 w-px bg-black/5 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
              <BookOpen className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Technical Briefing</span>
            </div>
          </div>
        </div>

        <Link href={`/tools/${id}`}>
          <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Workspace
          </Button>
        </Link>
      </header>

      <main className="flex-1 pt-32 pb-32 max-w-5xl mx-auto w-full px-6 space-y-16 relative z-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase px-3 h-5 tracking-[0.2em]">{tool.cat} Specialty</Badge>
            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-none text-[9px] font-black uppercase px-3 h-5 tracking-[0.2em]">{tool.mode} Unit</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-slate-950 leading-none">
            {tool.name} <br />
            <span className="text-primary/40">Technical Briefing</span>
          </h1>
          <p className="text-sm font-bold text-slate-950/40 uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
            Professional guidance for advanced document transformation workflows
          </p>
        </section>

        {/* CORE INFORMATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BENEFITS */}
          <Card className="bg-white/40 backdrop-blur-3xl border-black/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Core Benefits</h3>
            </div>
            <ul className="space-y-4">
              {tool.benefits?.map((benefit, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-950/60 leading-relaxed">{benefit}</span>
                </li>
              )) || <p className="text-[10px] uppercase font-bold text-slate-400">Professional optimization pending.</p>}
            </ul>
          </Card>

          {/* USE CASES */}
          <Card className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Layers className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Applications</h3>
            </div>
            <div className="space-y-6 relative z-10">
              {tool.useCases?.map((useCase, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{useCase}</p>
                </div>
              )) || <p className="text-[10px] uppercase font-bold opacity-40">Network applications expanding.</p>}
            </div>
          </Card>
        </div>

        {/* INSTRUCTIONS PROTOCOL */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-black/5 pb-6 px-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Execution Protocol</h2>
              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.3em]">Operational instructions for {tool.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.instructions?.map((step, i) => (
              <div key={i} className="p-8 bg-white/40 border border-black/5 rounded-3xl space-y-4 shadow-xl hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="text-lg font-black">{i + 1}</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-950/60 leading-relaxed">{step}</p>
              </div>
            )) || <p className="text-[10px] uppercase font-bold opacity-40 px-4">Instructions protocol in calibration.</p>}
          </div>
        </section>

        {/* SYSTEM ATTRIBUTION */}
        <footer className="pt-20 border-t border-black/5 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
              AJN Core • 2026
            </p>
            <div className="flex items-center gap-2.5 px-5 py-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span></span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
