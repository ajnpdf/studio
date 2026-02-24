"use client";

import { motion } from 'framer-motion';
import { NightSky } from '@/components/dashboard/night-sky';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, ShieldCheck, Globe, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * AJN About Us Page - Professional Industrial Standard 2026
 */
export default function OurStoryPage() {
  const founderImage = PlaceHolderImages.find(img => img.id === 'founder-portrait');

  return (
    <div className="min-h-screen text-slate-950 font-body relative overflow-x-hidden bg-transparent">
      <NightSky />
      
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 max-w-7xl mx-auto w-full z-[60] bg-transparent">
        <Link href="/">
          <LogoAnimation className="w-24 h-12" showGlow={false} />
        </Link>
        <Link href="/">
          <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest gap-2 bg-white/40 border-black/5 rounded-xl px-6 h-10 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Exit Story
          </Button>
        </Link>
      </header>

      <main className="relative z-10 pt-32 pb-32">
        {/* Mission Hero */}
        <section className="max-w-5xl mx-auto px-8 space-y-12 text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-primary/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Mission</span>
              <div className="w-12 h-px bg-primary/20" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-slate-950">
              Every File. One Simple <span className="text-primary">Network.</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-950/60 max-w-2xl mx-auto leading-relaxed">
              AJN (All-in-one Junction Network) provides professional browser-native tools for all your digital document needs.
            </p>
          </motion.div>
        </section>

        {/* Meet the Founder */}
        <section className="max-w-6xl mx-auto px-8 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-square max-w-[400px] mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/60 group">
                <Image 
                  src={founderImage?.imageUrl || "https://picsum.photos/seed/anjan/600/600"} 
                  alt="Anjan Patel" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  data-ai-hint="professional man portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-40" />
                
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-3xl rounded-[2rem] border border-white/60 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black text-slate-950 tracking-tighter">Anjan Patel</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">Founder</p>
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                      <Activity className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-slate-950">
                A Vision for Real-Time <span className="text-primary">Simplicity</span>
              </h2>
              <div className="prose prose-slate max-w-none text-slate-950/70 font-medium space-y-6 leading-relaxed text-base md:text-lg">
                <p>
                  "Our journey started with a singular, powerful ambition: To simplify complex file processing for every professional."
                </p>
                <p>
                  "AJN was designed to solve this by bringing professional tools directly into your local browser. We believe your data should never leave your possession."
                </p>
                <p className="font-bold text-slate-950 italic">
                  — Anjan Patel, Founder
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5 flex items-center justify-center shadow-xl">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[8px] font-black text-slate-950/40 uppercase tracking-widest">Global Access</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="bg-white/40 backdrop-blur-3xl py-32 border-y border-black/5">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-950">Core Features</h2>
              <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-[0.4em]">The Standards of Excellence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Zap, title: "Fast Processing", desc: "Optimized local execution in your secure browser buffer." },
                { icon: ShieldCheck, title: "Privacy", desc: "No permanent storage. Your data remains yours, always." },
                { icon: Activity, title: "Advanced Tools", desc: "Professional tools for document analysis and transformation." }
              ].map((item, i) => (
                <div key={i} className="p-10 bg-white/60 rounded-[3rem] border border-black/5 shadow-xl space-y-6 hover:border-primary/20 transition-all group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">{item.title}</h3>
                  <p className="text-sm font-medium text-slate-950/50 leading-relaxed uppercase tracking-widest">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-8 text-center space-y-10">
          <div className="flex gap-10 justify-center">
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-6xl font-black tracking-tighter">2026</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40">ESTABLISHED</p>
            </div>
            <div className="h-16 w-px bg-black/5" />
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-6xl font-black tracking-tighter">100%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40">PRIVACY</p>
            </div>
            <div className="h-16 w-px bg-black/5" />
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-6xl font-black tracking-tighter">30+</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40">TOOLS ACTIVE</p>
            </div>
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-8 border-t border-black/5 pt-20 flex flex-col items-center gap-10">
          <div className="flex gap-12 flex-wrap justify-center">
            {['Blog', 'Privacy', 'Terms', 'Contact'].map((link) => (
              <Link key={link} href={link === 'Contact' ? 'mailto:anjanpatel325@gmail.com' : `/${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950/40 hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] font-black text-slate-950/20 tracking-[0.5em] uppercase">
              AJN Core • 2026
            </p>
            <div className="flex items-center gap-2.5 px-5 py-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Made in INDIAN❤️</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
