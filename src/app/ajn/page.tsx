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
  Activity
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
      
      <header className="fixed top-0 left-0 right-0 h-14 glass-header z-[60] px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-16 h-8" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/junction">
            <Button variant="outline" className="h-8 border-black/10 bg-white/40 hover:bg-primary hover:text-white font-black text-[9px] tracking-widest rounded-xl transition-all gap-2 px-3 shadow-sm text-slate-950">
              <Workflow className="w-3 h-3" /> Directory
            </Button>
          </Link>
          <div className="h-5 w-px bg-black/5" />
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-600 tracking-widest">Secured</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-4 pt-24 max-w-7xl mx-auto w-full space-y-12 pb-24">
        <section className="flex flex-col items-center gap-8 text-center">
          <LogoAnimation className="w-48 h-24 md:w-64 md:h-32 mx-auto" />

          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-20" />
            <div className="relative flex items-center bg-white/50 backdrop-blur-3xl border border-black/5 rounded-[2rem] overflow-hidden shadow-xl transition-all hover:border-primary/30">
              <Search className="absolute left-6 w-5 h-5 text-primary" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find Unit (e.g. 'Merge', 'OCR')..." 
                className="w-full h-16 bg-transparent pl-16 pr-20 text-base font-black text-slate-950 border-none focus-visible:ring-0 placeholder:text-slate-950/20"
              />
              <div className="absolute right-6 flex items-center gap-2 px-2 py-1 bg-black/5 rounded-lg border border-black/5">
                <Command className="w-2.5 h-2.5 text-slate-950/40" />
                <span className="text-[9px] font-black text-slate-950/40">K</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="animate-in fade-in duration-1000 delay-300">
          <div className="flex items-center gap-2 px-6 mb-4">
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.2em]">Operational Stream</span>
          </div>
          <UnitScroller />
        </section>

        <section className="space-y-8 pb-24">
          <div className="flex items-end justify-between px-4 border-b border-black/5 pb-4">
            <div className="space-y-1 text-left">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 leading-none">System Registry</h2>
              <p className="text-[9px] font-bold text-slate-950/40 uppercase tracking-widest">Global engineering instances</p>
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[9px] font-black uppercase text-primary hover:underline underline-offset-4">
                Reset View
              </button>
            )}
          </div>
          
          <ServicesGrid query={searchQuery} category="All" />
        </section>

        <footer className="py-12 flex flex-col items-center gap-4">
          <div className="flex gap-10 flex-wrap justify-center">
            {['Story', 'Blog', 'Privacy', 'Terms'].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-widest text-slate-950/40 hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-black text-slate-950/20 tracking-[0.4em] uppercase">
              AJN Core • 2025
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">Made by Indian ❤️</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}