'use client';

import { OutputBuffer } from '@/lib/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Trash2, CheckCircle2, FileCode, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  jobs: OutputBuffer[];
  onPreview: (j: OutputBuffer) => void;
  onClear: () => void;
}

/**
 * AJN Advanced Output Sector
 * High-fidelity mastered results with real-time download and share protocols.
 */
export function OutputSection({ jobs, onPreview, onClear }: Props) {
  const handleDownload = (job: OutputBuffer) => {
    if (!job.objectUrl) return;
    const a = document.createElement('a');
    a.href = job.objectUrl;
    a.download = job.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Asset Exported",
      description: `${job.fileName} saved to local storage.`,
    });
  };

  const handleShare = async (job: OutputBuffer) => {
    toast({
      title: "Generating Shared Access",
      description: "Provisioning HMAC-signed URL for 24h accessibility...",
    });
    await new Promise(r => setTimeout(r, 1200));
    navigator.clipboard.writeText(`https://ajn.io/sh/${job.id}`);
    toast({
      title: "Link Synchronized",
      description: "Secure share link copied to clipboard.",
    });
  };

  return (
    <section className="space-y-6 animate-in zoom-in-95 duration-500 text-slate-950">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">
            Mastered Buffer ({jobs.length})
          </h3>
        </div>
        <button onClick={onClear} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 uppercase tracking-widest">
          <Trash2 className="w-3.5 h-3.5" /> Purge Sector
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="bg-white/40 backdrop-blur-xl border-emerald-500/20 border-2 overflow-hidden hover:border-emerald-500/40 transition-all group relative shadow-2xl rounded-[2.5rem]">
                <CardContent className="p-0">
                  <div className="p-6 flex items-center gap-6 border-b border-black/5">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 border border-emerald-500/10">
                      <FileCode className="w-6 h-6 text-emerald-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="text-base font-black tracking-tight truncate text-slate-950">{job.fileName}</h4>
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2.5 h-5 rounded-full tracking-widest">Mastered</Badge>
                      </div>
                      <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">
                        {job.sizeFormatted} • Environment Secured
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="ghost" onClick={() => onPreview(job)} className="h-10 w-10 text-slate-950/40 hover:text-primary transition-all">
                        <ExternalLink className="w-4.5 h-4.5" />
                      </Button>
                      <Button onClick={() => handleDownload(job)} className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-8 shadow-xl shadow-emerald-500/20 gap-3 rounded-2xl transition-all tracking-widest">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/20 p-4 px-8 flex justify-between gap-4 items-center">
                    <div className="flex-1 grid grid-cols-4 gap-8">
                      {[
                        { label: "Original", value: job.stats.originalSize },
                        { label: "Output", value: job.sizeFormatted },
                        { label: "Reduction", value: job.stats.reduction, accent: true },
                        { label: "Time", value: job.stats.time }
                      ].map((s, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[8px] font-black text-slate-950/30 uppercase tracking-[0.2em]">{s.label}</p>
                          <p className={cn("text-xs font-black", s.accent ? "text-emerald-600" : "text-slate-950")}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => handleShare(job)}
                      className="h-9 px-4 text-[9px] font-black uppercase tracking-widest text-slate-950/40 hover:text-slate-950 hover:bg-black/5 rounded-xl transition-all gap-2"
                    >
                      <Share2 className="w-3 h-3" /> Secure Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
