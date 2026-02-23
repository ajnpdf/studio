"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Search,
  Command,
  Workflow,
  Activity,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ServicesGrid } from '@/components/junction/services-grid';
import { UnitScroller } from '@/components/junction/unit-scroller';

export default function AJNPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen w-full text-slate-950 relative font-body flex flex-col bg-transparent overflow-y-auto scrollbar-hide">
      <NightSky />
      
      {/* PROFESSIONAL GLASSMORPISM HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-header z-[60] px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-20 h-10" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/40 hover:bg-primary hover:text-white font-black text-[10px] tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm text-slate-950">
              <Workflow className="w-3.5 h-3.5" /> Service Directory
            </Button>
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">System Secured</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-6 pt-32 max-w-7xl mx-auto w-full space-y-16">
        {/* CENTERED SEARCH & BRANDING SECTOR */}
        <section className="flex flex-col items-center gap-12 text-center">
          <div className="space-y-2">
            <LogoAnimation className="w-64 h-32 md:w-80 md:h-40 mx-auto" />
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-60 transition duration-1000" />
            <div className="relative flex items-center bg-white/50 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40 focus-within:ring-8 focus-within:ring-primary/5">
              <Search className="absolute left-8 w-6 h-6 text-primary" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find Smart Unit (e.g. 'Master', 'Merge', 'OCR')..." 
                className="w-full h-20 bg-transparent pl-20 pr-24 text-lg font-black text-slate-950 border-none focus-visible:ring-0 placeholder:text-slate-950/20"
              />
              <div className="absolute right-8 flex items-center gap-3 px-3 py-1.5 bg-black/5 rounded-xl border border-black/5 shadow-inner">
                <Command className="w-3 h-3 text-slate-950/40" />
                <span className="text-[10px] font-black text-slate-950/40">K</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* REAL-TIME SYSTEM STREAM (SCROLLER) */}
        <section className="animate-in fade-in duration-1000 delay-300">
          <div className="flex items-center gap-3 px-8 mb-6">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.3em]">Operational Unit Stream</span>
          </div>
          <UnitScroller />
        </section>

        {/* SERVICE GRID SECTOR */}
        <section className="space-y-10 pb-32">
          <div className="flex items-end justify-between px-4 border-b border-black/5 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 uppercase leading-none">System Registry</h2>
              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Access all functional Engineering Instances</p>
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase text-primary hover:underline underline-offset-4">
                Reset Sector View
              </button>
            )}
          </div>
          
          <ServicesGrid query={searchQuery} category="All" />
        </section>

        <footer className="py-16 flex flex-col items-center gap-6">
          <div className="flex gap-12">
            {['Story', 'Blog', 'Privacy', 'Terms'].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-slate-950/40 hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-black text-slate-950/20 tracking-[0.6em] uppercase">
              AJN Engineering Core • 2025
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">MADE BY INDIAN ❤️</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
