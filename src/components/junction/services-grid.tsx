"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Scissors, Trash2, Copy, Search, Shrink, Wrench, Hash, Unlock, Lock, 
  PenTool, EyeOff, GitCompare, Globe, FolderOpen, Presentation, ShieldCheck, 
  MousePointer2, History, Paintbrush, Layers, ImageIcon, FileText, Table, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export type ServiceUnit = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  tag: string;
  cat: 'Organize' | 'Optimize' | 'Convert' | 'Edit' | 'Security' | 'Intelligence' | 'Export';
  mode: 'WASM' | 'SMART' | 'AI';
  color: string;
};

export const ALL_UNITS: ServiceUnit[] = [
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple assets.', icon: Layout, tag: 'Sequence', cat: 'Organize', mode: 'WASM', color: '#3B82F6' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide by ranges.', icon: Scissors, tag: 'Divide', cat: 'Organize', mode: 'WASM', color: '#6366F1' },
  { id: 'delete-pages', name: 'Remove Pages', desc: 'Prune unwanted pages.', icon: Trash2, tag: 'Prune', cat: 'Organize', mode: 'WASM', color: '#8B5CF6' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate page ranges.', icon: Copy, tag: 'Isolate', cat: 'Organize', mode: 'SMART', color: '#A78BFA' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Reorder structures.', icon: FolderOpen, tag: 'Structure', cat: 'Organize', mode: 'SMART', color: '#7C3AED' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce file size.', icon: Shrink, tag: 'Minify', cat: 'Optimize', mode: 'SMART', color: '#10B981' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Recover corrupted files.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', mode: 'AI', color: '#059669' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Text recognition.', icon: Search, tag: 'Vision', cat: 'Optimize', mode: 'AI', color: '#047857' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'ISO compliance.', icon: ShieldCheck, tag: 'Archive', cat: 'Optimize', mode: 'WASM', color: '#065F46' },
  { id: 'grayscale-pdf', name: 'Grayscale PDF', desc: 'Black & white.', icon: Paintbrush, tag: 'Tone', cat: 'Optimize', mode: 'WASM', color: '#4B5563' },
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Image to PDF.', icon: ImageIcon, tag: 'Imagery', cat: 'Convert', mode: 'WASM', color: '#F59E0B' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Doc to PDF.', icon: FileText, tag: 'Office', cat: 'Convert', mode: 'WASM', color: '#D97706' },
  { id: 'ppt-pdf', name: 'PPT to PDF', desc: 'Slides to PDF.', icon: Presentation, tag: 'Slides', cat: 'Convert', mode: 'SMART', color: '#B45309' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Data to PDF.', icon: Table, tag: 'Data', cat: 'Convert', mode: 'SMART', color: '#92400E' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Web to PDF.', icon: Globe, tag: 'Web', cat: 'Convert', mode: 'SMART', color: '#78350F' },
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'PDF to images.', icon: ImageIcon, tag: 'Raster', cat: 'Export', mode: 'WASM', color: '#EF4444' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'PDF to Doc.', icon: FileText, tag: 'Doc', cat: 'Export', mode: 'WASM', color: '#DC2626' },
  { id: 'pdf-pptx', name: 'PDF to PPTX', desc: 'PDF to slides.', icon: Presentation, tag: 'Slides', cat: 'Export', mode: 'AI', color: '#B91C1C' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'PDF to sheet.', icon: Table, tag: 'Grid', cat: 'Export', mode: 'AI', color: '#991B1C' },
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Correct orientation.', icon: History, tag: 'Geometry', cat: 'Edit', mode: 'WASM', color: '#EC4899' },
  { id: 'add-page-numbers', name: 'Add Numbers', desc: 'Page numbering.', icon: Hash, tag: 'Indexing', cat: 'Edit', mode: 'WASM', color: '#DB2777' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Modify content.', icon: MousePointer2, tag: 'Mastery', cat: 'Edit', mode: 'SMART', color: '#BE185D' },
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove password.', icon: Unlock, tag: 'Decrypt', cat: 'Security', mode: 'WASM', color: '#000000' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Add encryption.', icon: Lock, tag: 'Encrypt', cat: 'Security', mode: 'WASM', color: '#111827' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'E-signature.', icon: PenTool, tag: 'E-Sign', cat: 'Security', mode: 'SMART', color: '#1F2937' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Mask sensitive data.', icon: EyeOff, tag: 'Purge', cat: 'Security', mode: 'AI', color: '#374151' },
  { id: 'flatten-pdf', name: 'Flatten PDF', desc: 'Bake layers.', icon: Layers, tag: 'Static', cat: 'Security', mode: 'WASM', color: '#4B5563' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Language mapping.', icon: Globe, tag: 'Smart', cat: 'Intelligence', mode: 'AI', color: '#3B82F6' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Analyze changes.', icon: GitCompare, tag: 'Diff', cat: 'Intelligence', mode: 'AI', color: '#2563EB' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Neural summary.', icon: FileText, tag: 'Extract', cat: 'Intelligence', mode: 'AI', color: '#1D4ED8' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
};

const cardVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export function ServicesGrid({ query, category }: { query: string, category: string }) {
  const filteredUnits = useMemo(() => {
    return ALL_UNITS.filter(unit => {
      const matchesSearch = unit.name.toLowerCase().includes(query.toLowerCase()) || 
                           unit.desc.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || unit.cat === category;
      return matchesSearch && matchesCategory;
    });
  }, [query, category]);

  if (filteredUnits.length === 0) {
    return (
      <div className="py-32 text-center space-y-4 opacity-30">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-black/5 rounded-3xl">
          <Search className="w-8 h-8" />
        </div>
        <p className="text-sm font-black tracking-widest uppercase">Instance Not Found</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-32">
      <AnimatePresence mode="popLayout">
        {filteredUnits.map((unit) => (
          <motion.div key={unit.id} layout variants={cardVariants} className="group">
            <Link href={`/tools/${unit.id}`}>
              <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 transition-all duration-700 cursor-pointer overflow-hidden border backdrop-blur-xl shadow-md group/card rounded-3xl">
                <CardContent className="p-6 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 bg-white/60 rounded-2xl flex items-center justify-center border border-black/5 group-hover/card:scale-110 group-hover/card:shadow-lg transition-all duration-700">
                      <unit.icon className="w-5.5 h-5.5 text-slate-950 group-hover/card:text-primary transition-colors" />
                    </div>
                    <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black px-2.5 h-5 rounded-full">{unit.mode}</Badge>
                  </div>
                  <div className="space-y-1.5 flex-1 text-left">
                    <h3 className="text-sm font-black leading-none tracking-tight">{unit.name}</h3>
                    <p className="text-[10px] font-bold text-slate-950/40 uppercase tracking-widest truncate">{unit.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-black/5 mt-5 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-950/30 uppercase tracking-widest">{unit.cat}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary translate-x-2 group-hover/card:translate-x-0 transition-all opacity-0 group-hover/card:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
