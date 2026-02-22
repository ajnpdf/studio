"use client";

import { useState, useEffect } from 'react';
import { Upload, Monitor, HardDrive, Link as LinkIcon, FileText, Video, ImageIcon, Music, Database, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formatPills = [
  { icon: FileText, label: 'PDF', color: 'text-red-400' },
  { icon: Video, label: 'MP4', color: 'text-blue-400' },
  { icon: ImageIcon, label: 'PNG', color: 'text-green-400' },
  { icon: FileCode, label: 'DOCX', color: 'text-indigo-400' },
  { icon: Music, label: 'MP3', color: 'text-pink-400' },
  { icon: Database, label: 'XLSX', color: 'text-emerald-400' },
];

export function HeroZone() {
  const [fileCount, setFileCount] = useState(4827341);

  useEffect(() => {
    const interval = setInterval(() => {
      setFileCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-40 pb-32 overflow-hidden min-h-screen flex flex-col items-center justify-center text-center bg-sufw-gradient">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-1000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Neural Processing Network Active
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">
            Every File. <br />
            <span className="text-gradient">One Smart Network.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            The professional all-in-one junction for real-time conversion, intelligence, and file mastery. 
            Used by 2M+ creators and developers.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="relative max-w-3xl mx-auto">
          {/* Animated Format Pills Orbit */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {formatPills.map((pill, idx) => (
              <div 
                key={idx}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit"
                style={{ animationDelay: `${idx * -5}s`, animationDuration: '30s' }}
              >
                <div className="bg-card/80 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-xl transition-transform hover:scale-110 cursor-default">
                  <pill.icon className={cn("w-5 h-5", pill.color)} />
                  <span className="text-[10px] font-black tracking-widest">{pill.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-[3rem] p-1.5 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative group">
            <div className="bg-background/40 rounded-[2.8rem] p-12 border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all duration-500 cursor-pointer flex flex-col items-center gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer"></div>
              
              <div className="w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight">Drop files to optimize</h3>
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Supports 300+ Formats up to 10GB</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> End-to-End Encrypted
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> Virus Scanned
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="device" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 w-full sm:w-auto">
                <TabsTrigger value="device" className="gap-2 px-8 rounded-xl data-[state=active]:bg-primary font-black text-[10px] tracking-widest">
                  <Monitor className="w-4 h-4" /> MY DEVICE
                </TabsTrigger>
                <TabsTrigger value="drive" className="gap-2 px-8 rounded-xl font-black text-[10px] tracking-widest">
                  <HardDrive className="w-4 h-4" /> CLOUD STORAGE
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2 px-8 rounded-xl font-black text-[10px] tracking-widest">
                  <LinkIcon className="w-4 h-4" /> PASTE URL
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-16 space-y-8 flex flex-col items-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-12 h-px bg-white/10"></span>
            {fileCount.toLocaleString()} FILES MASTERED TODAY
            <span className="w-12 h-px bg-white/10"></span>
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="h-16 px-12 text-sm font-black tracking-widest bg-brand-gradient hover:opacity-90 shadow-2xl shadow-primary/20 rounded-2xl group uppercase">
              Get Started for Free <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}