
"use client";

import { motion } from 'framer-motion';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Layers, ShieldCheck, User, CheckCircle2 } from 'lucide-react';
import { NightSky } from '@/components/dashboard/night-sky';

/**
 * AJN Landing Page - Professional Standard
 * Featuring Founder & CEO Anjan Patel and 'Made by Indian' signature.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 relative text-slate-950 bg-transparent overflow-x-hidden">
      <NightSky />
      
      <header className="w-full max-w-7xl flex items-center justify-between h-20 px-6 z-50">
        <LogoAnimation className="w-20 h-10" showGlow={false} />
        <nav className="hidden md:flex items-center gap-10">
          {['Features', 'Solutions', 'Pricing', 'Story'].map((item) => (
            <Link key={item} href={item === 'Story' ? '/story' : '#'} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors">
              {item}
            </Link>
          ))}
        </nav>
        <Link href="/ajn">
          <Button variant="outline" className="h-10 border-black/10 bg-white/40 font-black text-[10px] tracking-[0.2em] rounded-xl uppercase px-6">
            Access Hub
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center gap-12 relative z-10 pt-20 md:pt-32 pb-32 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <LogoAnimation className="w-56 h-28 md:w-72 md:h-36" />
        </motion.div>
        
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase">
              All-in-One <br className="hidden md:block" /> Junction Network
            </h1>
            <div className="flex items-center justify-center gap-6">
              <span className="w-12 h-px bg-slate-950/10"></span>
              <p className="text-slate-950/60 text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase">
                Every File. One Smart Network.
              </p>
              <span className="w-12 h-px bg-slate-950/10"></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link href="/ajn">
              <Button className="h-14 md:h-16 px-10 md:px-12 bg-primary text-white hover:bg-primary/90 font-black text-xs rounded-2xl transition-all gap-4 shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                Discover Core <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/junction">
              <Button variant="outline" className="h-14 md:h-16 px-10 md:px-12 border-slate-950/10 bg-white/40 backdrop-blur-xl text-slate-950 font-black text-xs rounded-2xl transition-all gap-4 shadow-xl hover:bg-white/60 hover:border-primary/40 active:scale-95 uppercase tracking-widest">
                <Layers className="w-4.5 h-4.5 text-primary" /> Access Junction
              </Button>
            </Link>
          </div>

          <div className="pt-10 flex items-center justify-center gap-10 opacity-40">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Sandbox</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-slate-950" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Engine</span>
            </div>
          </div>
        </div>

        <section className="w-full pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-10 rounded-[3rem] space-y-5 hover:border-primary/20 transition-all shadow-2xl group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><User className="w-6 h-6 text-primary" /></div>
            <h3 className="text-2xl font-black tracking-tight">For Students</h3>
            <p className="text-xs font-bold text-slate-950/50 leading-relaxed uppercase tracking-[0.1em]">Master assignments with PDF merging, OCR extraction, and smart formatting. Complimentary for individual nodes.</p>
          </Card>
          <Card className="bg-white/40 backdrop-blur-xl border-black/5 p-10 rounded-[3rem] space-y-5 hover:border-primary/20 transition-all shadow-2xl group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-primary" /></div>
            <h3 className="text-2xl font-black tracking-tight">For Business</h3>
            <p className="text-xs font-bold text-slate-950/50 leading-relaxed uppercase tracking-[0.1em]">Industrial-grade batch processing, team workspaces, and AES-256 encryption for corporate enterprise assets.</p>
          </Card>
        </section>
      </main>

      {/* Founder Recognition */}
      <div className="absolute top-10 right-10 flex flex-col items-end gap-1 text-right opacity-40 group hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Founder & CEO</span>
        <Link href="/story" className="text-sm font-black tracking-tighter text-primary hover:underline">Anjan Patel</Link>
      </div>

      <footer className="w-full py-16 mt-auto border-t border-black/5 flex flex-col items-center gap-8 relative z-10">
        <nav className="flex gap-12 flex-wrap justify-center">
          {['Story', 'Blog', 'Privacy', 'Terms'].map((link) => (
            <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors">
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
            AJN Engineering Core • 2025
          </p>
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Made by Indian ❤️</span>
          </div>
          <p className="text-[9px] font-bold text-slate-950/30 uppercase tracking-widest">
            Contact: anjanpatel325@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}
