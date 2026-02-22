"use client";

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Download, FileText, ImageIcon, Video } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const demos = [
  { from: 'PDF', to: 'Word', icon: FileText, color: 'text-red-400' },
  { from: 'JPG', to: 'WebP', icon: ImageIcon, color: 'text-blue-400' },
  { from: 'MP4', to: 'MP3', icon: Video, color: 'text-purple-400' },
];

export function LiveDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setTimeout(() => {
            setActiveIdx(i => (i + 1) % demos.length);
            setProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [activeIdx]);

  const active = demos[activeIdx];

  return (
    <section className="py-24 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-card rounded-[3rem] p-12 border shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">Lightning Fast <br /><span className="text-gradient">Processing</span></h2>
              <p className="text-muted-foreground text-lg">
                Our distributed cloud engine processes your files in seconds, regardless of size or format.
              </p>
              <ul className="space-y-4">
                {['Direct browser-to-cloud upload', 'Parallel chunk processing', 'Optimized compression algorithms'].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted/30 rounded-[2rem] p-8 border border-primary/10 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border shadow-sm">
                    <active.icon className={`w-6 h-6 ${active.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">input_file.{active.from.toLowerCase()}</p>
                    <p className="text-[10px] text-muted-foreground">Source Format: {active.from}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-3 text-right">
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold">output_file.{active.to.toLowerCase()}</p>
                    <p className="text-[10px] text-muted-foreground">Target: {active.to}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <active.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Converting...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-muted" />
              </div>

              {progress === 100 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 gap-2 font-bold shadow-lg shadow-emerald-500/20">
                    <Download className="w-4 h-4" /> Download Result
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
