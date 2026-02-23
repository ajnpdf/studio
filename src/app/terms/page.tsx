"use client";

import { motion } from 'framer-motion';
import { NightSky } from '@/components/dashboard/night-sky';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen text-slate-950 font-body relative">
      <NightSky />
      
      <header className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto w-full relative z-50">
        <Link href="/">
          <LogoAnimation className="w-24 h-12" showGlow={false} />
        </Link>
        <Link href="/">
          <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-20 space-y-12 relative z-10">
        <section className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">Terms & Conditions</h1>
          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">Last Updated: February 15, 2025</p>
        </section>

        <div className="prose prose-slate max-w-none text-slate-950/80 font-medium space-y-8 uppercase tracking-widest text-sm">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AJN (All-in-one Junction Network), you agree to be bound by these terms. 
              Our platform is provided "as-is" for professional engineering and file transformation purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">2. Prohibited Use</h2>
            <p>
              Users are prohibited from using AJN for any illegal activities, including but not limited to the 
              distribution of malicious software, copyrighted materials without authorization, or data mining.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">3. Intellectual Property</h2>
            <p>
              The AJN brand, logo, and engineering core are the intellectual property of Anjan Patel and the 
              AJN development team. Unauthorized replication of our systems is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4 pt-12 border-t border-black/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-950/40">
              For legal inquiries, please contact <span className="text-primary select-all">anjanpatel325@gmail.com</span>
            </p>
          </section>
        </div>

        <footer className="pt-20 pb-10 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-950/20 uppercase tracking-[0.5em]">
            MADE BY INDIAN ❤️
          </p>
        </footer>
      </main>
    </div>
  );
}