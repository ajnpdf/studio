"use client";

import { useState, useEffect } from 'react';
import { Upload, Monitor, HardDrive, Link as LinkIcon, FileText, Video, ImageIcon, Music, Database, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
    <section className="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Convert, Edit, Compress — <br />
            <span className="text-gradient">Any File. Instantly.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No software. No limits. 300+ format combinations.
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
                style={{ animationDelay: `${idx * -3}s`, animationDuration: '25s' }}
              >
                <div className="bg-card border border-primary/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl backdrop-blur-md">
                  <pill.icon className={cn("w-4 h-4", pill.color)} />
                  <span className="text-xs font-bold">{pill.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card/50 backdrop-blur-xl border-2 border-dashed border-primary/30 rounded-[2.5rem] p-12 mb-8 animate-pulse-slow group hover:border-primary transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Drop your files here</h3>
                <p className="text-muted-foreground">or click to browse your computer</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="device" className="w-full">
            <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-xl h-12">
              <TabsTrigger value="device" className="gap-2 rounded-lg data-[state=active]:bg-primary">
                <Monitor className="w-4 h-4" /> My Device
              </TabsTrigger>
              <TabsTrigger value="drive" className="gap-2 rounded-lg">
                <HardDrive className="w-4 h-4" /> Google Drive
              </TabsTrigger>
              <TabsTrigger value="dropbox" className="gap-2 rounded-lg">
                <Database className="w-4 h-4" /> Dropbox
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2 rounded-lg">
                <LinkIcon className="w-4 h-4" /> Paste URL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {fileCount.toLocaleString()} files processed today
          </p>
          <Button size="lg" className="h-14 px-10 text-lg font-bold bg-brand-gradient hover:opacity-90 shadow-2xl">
            Start Converting — It&apos;s Free
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </section>
  );
}
