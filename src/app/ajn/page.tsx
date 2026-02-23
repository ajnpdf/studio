
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ServicesGrid } from '@/components/junction/services-grid';
import { UnitScroller } from '@/components/junction/unit-scroller';

/**
 * Animated Title Component
 * Features character-by-character 3D flip animation
 */
function CharacterTitle({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-[0.1em]">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: -90, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: i * 0.03
          }}
          className="inline-block origin-bottom"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

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

      <main className="relative z-10 flex-1 p-6 pt-24 max-w-7xl mx-auto w-full space-y-12">
        {/* Top Search Sector */}
        <section className="flex flex-col items-center gap-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-3xl border border-black/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
              <Search className="absolute left-6 w-5 h-5 text-primary" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 40+ Intelligent Units (e.g. 'Merge', 'OCR', 'Translate')..." 
                className="w-full h-16 bg-transparent pl-16 pr-20 text-base font-bold text-slate-950 border-none focus-visible:ring-0 placeholder:text-slate-950/30"
              />
              <div className="absolute right-6 flex items-center gap-2 px-2.5 py-1 bg-black/5 rounded-lg border border-black/5">
                <Command className="w-2.5 h-2.5 text-slate-950/40" />
                <span className="text-[9px] font-bold text-slate-950/40">K</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 text-center">
            <div className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase leading-none">
              <CharacterTitle text="AJN SYSTEM UNITS" />
            </div>
            <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.5em]">Every File. One Smart Network.</p>
          </div>
        </section>

        {/* Dynamic Infinite Scroller */}
        <section className="animate-in fade-in duration-1000 delay-300">
          <div className="flex items-center gap-2 px-8 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">Real-Time Activity Stream</span>
          </div>
          <UnitScroller />
        </section>

        {/* Integrated Services Grid */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center justify-between px-4 border-b border-black/5 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Library Registry</h2>
              <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">Explore all functional system units</p>
            </div>
            {searchQuery && (
              <Button variant="ghost" onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase text-primary hover:bg-primary/5">
                Reset Registry View
              </Button>
            )}
          </div>
          
          <ServicesGrid query={searchQuery} category="All" />
        </section>

        <footer className="py-12 text-center text-[10px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
          AJN Gateway Hub • Global Engine • 2025
        </footer>
      </main>
    </div>
  );
}
