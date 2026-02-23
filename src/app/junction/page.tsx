"use client";

import { useState } from 'react';
import { ServicesGrid } from '@/components/junction/services-grid';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Input } from '@/components/ui/input';

/**
 * AJN Junction Page - Redesigned for the Light Theme
 */
export default function JunctionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/10 relative overflow-hidden font-body flex flex-col">
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <Link href="/ajn" className="flex items-center group">
          <LogoAnimation className="w-16 h-8 md:w-24 md:h-12" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl border border-black/5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">STABLE PROTOCOL</span>
          </div>
          <Link href="/ajn">
            <Button variant="ghost" className="h-8 md:h-10 gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-slate-900 hover:bg-black/5">
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Sector Exit</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-24 md:pt-32 flex-1 flex flex-col">
        {/* DIRECT ACCESS CONTROLS */}
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                Service <span className="text-primary">Units</span>
              </h1>
              <p className="text-[9px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-60">
                Direct access to the 300+ unit smart network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find unit (e.g. 'PDF', 'RAW', '4K')..." 
                  className="h-12 pl-12 bg-white/60 border-black/5 text-xs font-black uppercase tracking-widest focus:ring-primary/40 rounded-2xl shadow-sm"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 border-black/5 bg-white/60 gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {['All', 'Document', 'Image', 'Video', 'Audio', 'Data', 'Archive'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                    : 'bg-white/60 border-black/5 text-muted-foreground hover:border-primary/20 hover:text-primary shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* SERVICES GRID */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-20 flex-1">
          <ServicesGrid query={searchQuery} category={activeTab} />
        </div>
      </main>

      <footer className="py-8 border-t border-black/5 bg-white/20 text-center text-[8px] md:text-[9px] font-black text-slate-900/20 uppercase tracking-[0.3em] md:tracking-[0.5em]">
        AJN JUNCTION • GLOBAL ACCESS NODE • 2025
      </footer>
    </div>
  );
}
