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
 * AJN Junction Page - Professional Light Theme with Invisible Scroll
 */
export default function JunctionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="h-screen text-slate-900 selection:bg-primary/10 relative font-body flex flex-col overflow-hidden bg-transparent">
      <NightSky />
      
      {/* HUD Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-black/5 bg-white/40 backdrop-blur-xl z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <Link href="/ajn" className="flex items-center group">
          <LogoAnimation className="w-16 h-8 md:w-24 md:h-12" showGlow={false} />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl border border-black/5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">System Stable</span>
          </div>
          <Link href="/ajn">
            <Button variant="ghost" className="h-8 md:h-10 gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-black/5">
              <ArrowLeft className="w-3.5 h-3.5" /> Sector Exit
            </Button>
          </Link>
        </div>
      </header>

      {/* Scrollable Content Area - Invisible Scrollbar */}
      <main className="relative z-10 flex-1 overflow-y-auto pt-24 md:pt-32 pb-20 scrollbar-hide">
        {/* Direct Access Controls */}
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 leading-none">
                PDF <span className="text-primary">Tools</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-900/40 uppercase tracking-[0.3em]">
                Explore our complete library of professional document tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find tool (e.g. 'OCR', 'Merge')..." 
                  className="h-12 pl-12 bg-white/60 border-black/5 text-sm font-bold focus:ring-primary/20 rounded-2xl shadow-sm text-slate-950"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 border-black/5 bg-white/60 gap-3 rounded-2xl font-bold text-xs shadow-sm text-slate-950">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {['All', 'Organize', 'Optimize', 'Convert', 'Edit', 'Security', 'Intelligence'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                    : 'bg-white/60 border-black/5 text-slate-600 hover:border-primary/20 hover:text-primary shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
          <ServicesGrid query={searchQuery} category={activeTab} />
        </div>

        <footer className="py-12 text-center">
          <p className="text-[10px] font-black text-slate-900/20 uppercase tracking-[0.5em]">
            AJN Junction • Global Access Hub • 2025
          </p>
        </footer>
      </main>
    </div>
  );
}
