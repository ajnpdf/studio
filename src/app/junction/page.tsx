"use client";

import { JunctionCategories } from '@/components/junction/junction-categories';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Network } from 'lucide-react';
import Link from 'next/link';
import { LogoAnimation } from '@/components/landing/logo-animation';

export default function JunctionPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body flex flex-col">
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-50 px-4 md:px-8 flex items-center justify-between">
        <Link href="/ajn" className="flex items-center gap-2 md:gap-3 group">
          <LogoAnimation className="w-16 h-8 md:w-20 md:h-10" showGlow={false} />
          <span className="font-black text-lg md:text-xl tracking-tighter text-white uppercase ml-[-8px]">AJN JUNCTION</span>
        </Link>
        
        <Link href="/ajn">
          <Button variant="ghost" className="h-8 md:h-10 gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Return</span>
          </Button>
        </Link>
      </header>

      <main className="relative z-10 pt-24 md:pt-32 flex-1">
        <JunctionCategories />
      </main>

      <footer className="py-8 md:py-12 text-center text-[8px] md:text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] md:tracking-[0.5em]">
        AJN JUNCTION • NETWORK SECTOR • 2025
      </footer>
    </div>
  );
}
