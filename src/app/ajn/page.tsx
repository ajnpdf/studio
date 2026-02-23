"use client";

import { useState } from 'react';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Search,
  Command,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ServicesGrid } from '@/components/junction/services-grid';
import { UnitScroller } from '@/components/junction/unit-scroller';

/**
 * AJN Gateway - Professional Gateway Entry
 * Features functional search, real-time service discovery with invisible scroll.
 */
export default function AJNPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen w-full text-slate-950 selection:bg-primary/10 relative font-body flex flex-col bg-transparent overflow-y-auto scrollbar-hide">
      <NightSky />
      
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-black/5 bg-white/40 backdrop-blur-xl z-[60] px-8 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-20 h-10" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/50 hover:bg-primary hover:text-white font-bold text-[10px] tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm text-slate-950">
              <Workflow className="w-3.5 h-3.5" /> Service Directory
            </Button>
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl border border-black/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-950/60 tracking-widest uppercase">System Secured</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-6 pt-24 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Search Sector */}
        <section className="flex flex-col items-center gap-8">
          <div className="w-full max-w-2xl relative group animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
              <Search className="absolute left-6 w-5 h-5 text-primary" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search All Service Units (e.g. 'Merge', 'Excel', 'Translate')..." 
                className="w-full h-16 bg-transparent pl-16 pr-20 text-base font-bold text-slate-950 border-none focus-visible:ring-0 placeholder:text-slate-950/30"
              />
              <div className="absolute right-6 flex items-center gap-2 px-2.5 py-1 bg-black/5 rounded-lg border border-black/5">
                <Command className="w-2.5 h-2.5 text-slate-950/40" />
                <span className="text-[9px] font-bold text-slate-950/40">K</span>
              </div>
            </div>
          </div>

          <div className="transition-all duration-1000 animate-in zoom-in-95">
            <LogoAnimation className="w-48 h-20" />
          </div>
        </section>

        {/* Dynamic Infinite Scroller */}
        <section className="animate-in fade-in duration-1000 delay-300">
          <UnitScroller />
        </section>

        {/* Integrated Services Grid */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 pb-20">
          <div className="flex items-center justify-between px-4 border-b border-black/5 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">System Library</h2>
              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Explore all functional service units</p>
            </div>
            {searchQuery && (
              <Button variant="ghost" onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase text-primary">
                Clear Search Result
              </Button>
            )}
          </div>
          
          <ServicesGrid query={searchQuery} category="All" />
        </section>

        <footer className="py-12 text-center text-[10px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
          AJN Gateway • Global Engine • 2025
        </footer>
      </main>
    </div>
  );
}
