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

/**
 * AJN Hub Page - Professional Industrial Layout 2026
 */
export default function AJNPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen w-full text-slate-950 relative font-body flex flex-col bg-transparent overflow-y-auto scrollbar-hide">
      <NightSky />
      
      <header className="fixed top-0 left-0 right-0 h-16 glass-header z-[60] px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <LogoAnimation className="w-16 h-8" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-5">
          <Link href="/junction">
            <Button variant="outline" className="h-9 border-black/10 bg-white/40 hover:bg-primary hover:text-white font-black text-[10px] tracking-widest rounded-xl transition-all gap-2 px-4 shadow-sm text-slate-950">
              <Workflow className="w-3.5 h-3.5" /> Tool Directory
            </Button>
          </Link>
          <div className="h-6 w-px bg-black/5" />
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Verified Secure</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-6 pt-28 max-w-7xl mx-auto w-full space-y-16 pb-32">
        <section className="flex flex-col items-center gap-10 text-center">
          <LogoAnimation className="w-48 h-24 md:w-64 md:h-32 mx-auto" />

          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur-2xl opacity-20" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/30">
              <Search className="absolute left-7 w-5 h-5 text-primary" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. 'OCR', 'Merge')..." 
                className="w-full h-16 bg-transparent pl-16 pr-20 text-base font-bold text-slate-950 border-none focus-visible:ring-0 placeholder:text-slate-950/20"
              />
              <div className="absolute right-7 flex items-center gap-2 px-2.5 py-1 bg-black/5 rounded-lg border border-black/5">
                <Command className="w-3 h-3 text-slate-950/40" />
                <span className="text-[10px] font-black text-slate-950/40">K</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="animate-in fade-in duration-1000 delay-300">
          <div className="flex items-center gap-3 px-8 mb-6">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[11px] font-black text-slate-950/40 uppercase tracking-[0.3em]">Featured Tools</span>
          </div>
          <UnitScroller />
        </section>

        <section className="space-y-10 pb-24">
          <div className="flex items-end justify-between px-6 border-b border-black/5 pb-6">
            <div className="space-y-1 text-left">
              <h2 className="text-3xl font-black tracking-tighter text-slate-950 leading-none">PDF Tool Library</h2>
              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-[0.4em]">Fast and secure document processing ready for use</p>
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase text-primary hover:underline underline-offset-4 tracking-widest">
                Reset Grid
              </button>
            )}
          </div>
          
          <ServicesGrid query={searchQuery} category="All" />
        </section>

        <footer className="py-16 border-t border-black/5 flex flex-col items-center gap-6">
          <div className="flex gap-12 flex-wrap justify-center">
            {['Story', 'Blog', 'Privacy', 'Terms'].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
              AJN Core • 2026
            </p>
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Made in INDIAN❤️</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
