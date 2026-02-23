"use client";

import { motion } from 'framer-motion';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Layers, ShieldCheck, User, CheckCircle2 } from 'lucide-react';
import { NightSky } from '@/components/dashboard/night-sky';

/**
 * AJN Landing Page - Compact Professional Entrance
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 relative text-slate-950 bg-transparent overflow-x-hidden">
      <NightSky />
      
      <header className="w-full max-w-7xl flex items-center justify-between h-16 px-4 z-50">
        <LogoAnimation className="w-20 h-10" showGlow={false} />
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Solutions', 'Pricing', 'Story'].map((item) => (
            <Link key={item} href={item === 'Story' ? '/story' : '#'} className="text-[10px] font-black uppercase tracking-widest text-slate-950/40 hover:text-primary transition-colors">
              {item}
            </Link>
          ))}
        </nav>
        <Link href="/ajn">
          <Button variant="outline" className="h-9 border-black/10 bg-white/40 font-black text-[10px] tracking-widest rounded-xl uppercase">
            Access Hub
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center gap-10 relative z-10 pt-16 md:pt-24 pb-24">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <LogoAnimation className="w-48 h-24 md:w-64 md:h-32" />
        </motion.div>
        
        <div className="text-center space-y-6 md:space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-slate-950 leading-[0.9] uppercase">
              All-in-One <br className="hidden md:block" /> Junction Network
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="w-10 h-px bg-slate-950/10"></span>
              <p className="text-slate-950/60 text-[9px] md:text-[11px] font-bold tracking-[0.3em] uppercase">
                Every File. One Smart Network.
              </p>
              <span className="w-10 h-px bg-slate-950/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/ajn">
              <Button className="h-12 md:h-14 px-8 md:px-10 bg-primary text-white hover:bg-primary/90 font-black text-xs rounded-xl transition-all gap-3 shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                Discover Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-12 md:h-14 px-8 md:px-10 border-slate-950/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-xs rounded-xl transition-all gap-3 shadow-md hover:bg-white/60 hover:border-primary/40 active:scale-95 uppercase tracking-widest">
                <Layers className="w-4 h-4 text-primary" /> Access Junction
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span className="text-[9px] font-black uppercase tracking-widest">Secure Sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-950" />
              <span className="text-[9px] font-black uppercase tracking-widest">Smart Network</span>
            </div>
          </div>
        </div>

        <section className="w-full pt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all text-left">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <h3 className="text-xl font-black tracking-tight">For Students</h3>
            <p className="text-xs font-medium text-slate-950/60 leading-relaxed uppercase tracking-wider">Master assignments with PDF merging, OCR extraction, and smart formatting. Free for individual nodes.</p>
          </Card>
          <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-all text-left">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
            <h3 className="text-xl font-black tracking-tight">For Business</h3>
            <p className="text-xs font-medium text-slate-950/60 leading-relaxed uppercase tracking-wider">Industrial-grade batch processing, team workspaces, and AES-256 encryption for corporate assets.</p>
          </Card>
        </section>
      </main>

      <div className="absolute top-8 right-8 flex flex-col items-end gap-0.5 text-right opacity-60">
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Founder & CEO</span>
        <span className="text-xs font-black tracking-tighter text-primary">Anjan Patel</span>
      </div>

      <footer className="w-full py-12 mt-auto border-t border-black/5 flex flex-col items-center gap-6 relative z-10">
        <nav className="flex gap-10 flex-wrap justify-center">
          {['Story', 'Blog', 'Privacy', 'Terms'].map((link) => (
            <Link key={link} href={`/${link.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-widest text-slate-950/40 hover:text-primary transition-colors">
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-black text-slate-950/20 tracking-[0.4em] uppercase">
            AJN Engineering Core • 2025
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">Made by Indian ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}