
"use client";

import { JunctionCategories } from '@/components/junction/junction-categories';
import { NightSky } from '@/components/dashboard/night-sky';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Network, Grid2X2 } from 'lucide-react';
import Link from 'next/link';

/**
 * AJN Junction Page
 * High-fidelity category hub for the Neural Network.
 */
export default function JunctionPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 relative overflow-hidden font-body">
      <NightSky />
      
      {/* HUD HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-background/20 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
        <Link href="/ajn" className="flex items-center gap-3 group">
          <div className="p-2 bg-white rounded-lg shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
            <Network className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">AJN JUNCTION</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/ajn">
            <Button variant="ghost" className="h-10 gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-4 h-4" /> Return to Gateway
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-32">
        <JunctionCategories />
      </main>

      <footer className="py-12 text-center text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.5em]">
        AJN JUNCTION • NETWORK SECTOR v1.0 • 2025
      </footer>
    </div>
  );
}
