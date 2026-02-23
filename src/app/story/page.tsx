"use client";

import { motion } from 'framer-motion';
import { NightSky } from '@/components/dashboard/night-sky';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Heart, ShieldCheck, Cpu, User } from 'lucide-react';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <div className="min-h-screen text-slate-950 font-body relative overflow-x-hidden">
      <NightSky />
      
      <header className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto w-full relative z-50">
        <Link href="/">
          <LogoAnimation className="w-24 h-12" showGlow={false} />
        </Link>
        <Link href="/">
          <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-20 space-y-24 relative z-10">
        <section className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Master Mission</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              The <span className="text-primary">AJN</span> <br /> Story
            </h1>
            <div className="pt-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-[1.5rem] border border-black/5 flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-xl font-black uppercase tracking-tight text-slate-950">Founded by Anjan Patel</p>
                <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest leading-relaxed">
                  Founder & CEO • From Vision to Reality
                </p>
              </div>
            </div>
          </motion.div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-950/80 font-medium leading-relaxed">
            <p className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              AJN (All-in-one Junction Network) started with a singular, powerful vision: 
              To build the world's most advanced, real-time file engineering environment 
              that operates entirely within the browser.
            </p>
            <p className="uppercase tracking-widest text-sm">
              Our founder, Anjan Patel, recognized a massive gap in how modern professionals 
              handle digital assets. Traditional tools were slow, server-dependent, or 
              fragmented. AJN was designed to solve this by bringing high-concurrency 
              WASM (WebAssembly) processing and Neural Intelligence into a unified "Junction".
            </p>
            <p className="uppercase tracking-widest text-sm">
              Today, AJN serves thousands of nodes daily, providing hardware-accelerated 
              transformations without ever compromising user privacy. We are committed to 
              continuous development, with more modern features and units arriving every cycle.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Speed", desc: "Hardware-accelerated processing in your local buffer." },
            { icon: ShieldCheck, title: "Security", desc: "No permanent storage. Your data remains yours." },
            { icon: Heart, title: "Passion", desc: "Built with precision and pride by Indian engineers." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/40 backdrop-blur-xl border border-black/5 rounded-[2.5rem] space-y-4 shadow-xl group hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">{item.title}</h3>
              <p className="text-[11px] font-bold text-slate-950/40 uppercase tracking-widest">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="py-20 border-t border-black/5 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">More coming soon</h2>
            <p className="text-sm font-bold text-slate-950/40 uppercase tracking-[0.3em]">
              Our engineering roadmap is expanding every day.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary">
            <Cpu className="w-4 h-4 animate-pulse" /> Global Scale Deployment
          </div>
        </section>

        <footer className="pt-20 pb-10 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">
              MADE BY INDIAN ❤️
            </p>
            <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
              anjanpatel325@gmail.com
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}