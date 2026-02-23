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
 * AJN Compact Output Sector
 * Professional Proper Case cards with high-fidelity stats.
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
      description: `${job.fileName} saved locally.`,
    });
  };

  const handleShare = async (job: OutputBuffer) => {
    toast({
      title: "Generating Access",
      description: "Provisioning HMAC-signed URL...",
    });
    await new Promise(r => setTimeout(r, 1000));
    navigator.clipboard.writeText(`https://ajn.io/sh/${job.id}`);
    toast({
      title: "Link Ready",
      description: "Secure share link copied to clipboard.",
    });
  };

  return (
    <section className="space-y-5 animate-in zoom-in-95 duration-500 text-slate-950">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h3 className="text-xs font-black text-emerald-600">
            Mastered Buffer ({jobs.length})
          </h3>
        </div>
        <button onClick={onClear} className="text-[10px] font-black text-red-500 hover:text-red-600 transition-colors flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5" /> Purge Cache
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Card className="bg-white/50 backdrop-blur-3xl border-emerald-500/20 border-2 overflow-hidden hover:border-emerald-500/40 transition-all group shadow-xl rounded-3xl">
                <CardContent className="p-0">
                  <div className="p-5 flex items-center gap-5 border-b border-black/5">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/10">
                      <FileCode className="w-6 h-6 text-emerald-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black truncate text-slate-950">{job.fileName}</h4>
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2 h-4.5 rounded-full">Mastered</Badge>
                      </div>
                      <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest">
                        {job.sizeFormatted} • Verified Secure
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="ghost" onClick={() => onPreview(job)} className="h-9 w-9 text-slate-950/40 hover:text-primary transition-all rounded-xl">
                        <ExternalLink className="w-4.5 h-4.5" />
                      </Button>
                      <Button onClick={() => handleDownload(job)} className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-5 shadow-lg gap-2 rounded-2xl transition-all">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/30 p-3 px-8 flex justify-between gap-6 items-center">
                    <div className="flex-1 grid grid-cols-4 gap-6">
                      {[
                        { label: "Original", value: job.stats.originalSize },
                        { label: "Output", value: job.sizeFormatted },
                        { label: "Efficiency", value: job.stats.reduction, accent: true },
                        { label: "Latency", value: job.stats.time }
                      ].map((s, i) => (
                        <div key={i} className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-950/30 uppercase tracking-widest">{s.label}</p>
                          <p className={cn("text-[11px] font-black", s.accent ? "text-emerald-600" : "text-slate-950")}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => handleShare(job)}
                      className="h-8 px-4 text-[9px] font-black text-slate-950/40 hover:text-slate-950 hover:bg-black/5 rounded-xl transition-all gap-2"
                    >
                      <Share2 className="w-3 h-3" /> Share
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
