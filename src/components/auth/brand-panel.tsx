"use client";

import { Cloud, Zap, Shield, HardDrive, FileText, ImageIcon, Video, Music } from 'lucide-react';
import { useEffect, useState } from 'react';

const icons = [FileText, ImageIcon, Video, Music];

export function BrandPanel() {
  const [activeIconIdx, setActiveIconIdx] = useState(0);
  const [counter, setCounter] = useState(1998432);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIconIdx((prev) => (prev + 1) % icons.length);
    }, 2000);

    const counterInterval = setInterval(() => {
      setCounter((prev) => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => {
      clearInterval(iconInterval);
      clearInterval(counterInterval);
    };
  }, []);

  const ActiveIcon = icons[activeIconIdx];

  return (
    <section className="hidden md:flex w-2/5 bg-primary/10 backdrop-blur-3xl border-r border-white/5 flex-col p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="flex items-center gap-3 mb-16 z-10">
        <div className="p-2.5 bg-brand-gradient rounded-xl shadow-2xl">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <span className="font-black text-3xl tracking-tighter text-gradient">AJN</span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-12 z-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Every File.<br />
            <span className="text-primary">One Smart Network.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xs leading-relaxed">
            AJN – All-in-one Junction Network. The ultimate real-time intelligent file operating system.
          </p>
        </div>

        {/* Morphing Illustration */}
        <div className="relative h-32 flex items-center">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl border border-primary/10 blur-xl"></div>
          <div className="relative flex items-center gap-8 px-8">
            <div className="w-16 h-16 rounded-2xl bg-card border flex items-center justify-center animate-bounce">
              <ActiveIcon className="w-8 h-8 text-primary transition-all duration-500" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-2 w-32 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_2s_infinite]"></div>
              </div>
              <div className="h-2 w-24 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Process in Seconds</p>
              <p className="text-sm text-muted-foreground">Faster than desktop software for any size.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Bank-Level Security</p>
              <p className="text-sm text-muted-foreground">End-to-end 256-bit encryption for every user.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Cloud-Native Storage</p>
              <p className="text-sm text-muted-foreground">Access your files from any device, anywhere.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-auto border-t border-white/5 z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
          Join the Junction
        </p>
        <p className="text-lg font-black tracking-tight">
          {counter.toLocaleString()} users trusted us today
        </p>
      </div>
    </section>
  );
}
