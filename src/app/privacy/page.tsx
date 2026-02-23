"use client";

import { motion } from 'framer-motion';
import { NightSky } from '@/components/dashboard/night-sky';
import { LogoAnimation } from '@/components/landing/logo-animation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">Privacy Policy</h1>
          <p className="text-[10px] font-black text-slate-950/40 uppercase tracking-widest">Effective Date: February 15, 2025</p>
        </section>

        <div className="prose prose-slate max-w-none text-slate-950/80 font-medium space-y-8 uppercase tracking-widest text-sm">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">1. Data Sovereignty</h2>
            <p>
              At AJN, we believe your data belongs to you. Our architecture is designed to process files in a local, 
              sandboxed environment within your browser. We do not permanently store your documents on our servers 
              unless explicitly requested for workspace persistence.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">2. Encryption</h2>
            <p>
              All data transmitted through our network is secured using bank-level AES-256 encryption. We utilize 
              SSL/TLS protocols for all connections to ensure your session remains private and protected.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950">3. Information Collection</h2>
            <p>
              We collect minimal information required to provide our services, such as your email address for account 
              management and technical logs to monitor system health and prevent abuse.
            </p>
          </section>

          <section className="space-y-4 pt-12 border-t border-black/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-950/40">
              For any questions regarding your privacy, contact our legal team at <span className="text-primary select-all">anjanpatel325@gmail.com</span>
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