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
  mode: 'Standard' | 'Advanced';
  color: string;
};

export const ALL_UNITS: ServiceUnit[] = [
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple documents.', icon: Layout, tag: 'Merge', cat: 'Organize', mode: 'Standard', color: '#3B82F6' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide files by page range.', icon: Scissors, tag: 'Split', cat: 'Organize', mode: 'Standard', color: '#6366F1' },
  { id: 'delete-pages', name: 'Remove Pages', desc: 'Delete unwanted pages.', icon: Trash2, tag: 'Remove', cat: 'Organize', mode: 'Standard', color: '#8B5CF6' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate specific pages.', icon: Copy, tag: 'Extract', cat: 'Organize', mode: 'Standard', color: '#A78BFA' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Reorder document pages.', icon: FolderOpen, tag: 'Organize', cat: 'Organize', mode: 'Standard', color: '#7C3AED' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce document file size.', icon: Shrink, tag: 'Compress', cat: 'Optimize', mode: 'Standard', color: '#10B981' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Fix corrupted PDF files.', icon: Wrench, tag: 'Repair', cat: 'Optimize', mode: 'Standard', color: '#059669' },
  { id: 'ocr-pdf', name: 'Text Recognition', desc: 'Recognize text in scans.', icon: Search, tag: 'OCR', cat: 'Optimize', mode: 'Advanced', color: '#047857' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'Archive compliant docs.', icon: ShieldCheck, tag: 'Archive', cat: 'Optimize', mode: 'Standard', color: '#065F46' },
  { id: 'grayscale-pdf', name: 'Grayscale PDF', desc: 'Convert to black and white.', icon: Paintbrush, tag: 'Grayscale', cat: 'Optimize', mode: 'Standard', color: '#4B5563' },
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Convert image to PDF.', icon: ImageIcon, tag: 'Convert', cat: 'Convert', mode: 'Standard', color: '#F59E0B' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert Word to PDF.', icon: FileText, tag: 'Convert', cat: 'Convert', mode: 'Standard', color: '#D97706' },
  { id: 'ppt-pdf', name: 'PPT to PDF', desc: 'Convert PowerPoint to PDF.', icon: Presentation, tag: 'Convert', cat: 'Convert', mode: 'Standard', color: '#B45309' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Convert Spreadsheet to PDF.', icon: Table, tag: 'Convert', cat: 'Convert', mode: 'Standard', color: '#92400E' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Convert Web page to PDF.', icon: Globe, tag: 'Convert', cat: 'Convert', mode: 'Standard', color: '#78350F' },
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Convert PDF to images.', icon: ImageIcon, tag: 'Export', cat: 'Export', mode: 'Standard', color: '#EF4444' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Convert PDF to Word doc.', icon: FileText, tag: 'Export', cat: 'Export', mode: 'Standard', color: '#DC2626' },
  { id: 'pdf-pptx', name: 'PDF to PPTX', desc: 'Convert PDF to slides.', icon: Presentation, tag: 'Export', cat: 'Export', mode: 'Standard', color: '#B91C1C' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Convert PDF to sheet.', icon: Table, tag: 'Export', cat: 'Export', mode: 'Standard', color: '#991B1C' },
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Correct page orientation.', icon: History, tag: 'Edit', cat: 'Edit', mode: 'Standard', color: '#EC4899' },
  { id: 'add-page-numbers', name: 'Add Numbers', desc: 'Add numbering to pages.', icon: Hash, tag: 'Edit', cat: 'Edit', mode: 'Standard', color: '#DB2777' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Modify document content.', icon: MousePointer2, tag: 'Edit', cat: 'Edit', mode: 'Advanced', color: '#BE185D' },
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove document password.', icon: Unlock, tag: 'Security', cat: 'Security', mode: 'Standard', color: '#000000' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Add password encryption.', icon: Lock, tag: 'Security', cat: 'Security', mode: 'Standard', color: '#111827' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Add digital signature.', icon: PenTool, tag: 'Security', cat: 'Security', mode: 'Standard', color: '#1F2937' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Mask sensitive information.', icon: EyeOff, tag: 'Security', cat: 'Security', mode: 'Advanced', color: '#374151' },
  { id: 'flatten-pdf', name: 'Flatten PDF', desc: 'Merge document layers.', icon: Layers, tag: 'Security', cat: 'Security', mode: 'Standard', color: '#4B5563' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Document translation.', icon: Globe, tag: 'Translate', cat: 'Intelligence', mode: 'Advanced', color: '#3B82F6' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Generate a brief summary.', icon: FileText, tag: 'Summary', cat: 'Intelligence', mode: 'Advanced', color: '#1D4ED8' },
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
      <div className="py-24 text-center space-y-4 opacity-30">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-black/5 rounded-3xl">
          <Search className="w-8 h-8" />
        </div>
        <p className="text-xs font-black tracking-widest uppercase">Tool Not Found</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-32">
      <AnimatePresence mode="popLayout">
        {filteredUnits.map((unit) => (
          <motion.div key={unit.id} layout variants={cardVariants} className="group h-full">
            <Link href={`/tools/${unit.id}`} className="block h-full">
              <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden border backdrop-blur-xl shadow-md group/card rounded-[2rem] md:rounded-3xl">
                <CardContent className="p-4 md:p-6 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/60 rounded-xl md:rounded-2xl flex items-center justify-center border border-black/5 group-hover/card:scale-110 group-hover/card:shadow-xl transition-all duration-700">
                      <unit.icon className="w-5 h-5 md:w-6 md:h-6 text-slate-950 group-hover/card:text-primary transition-colors" />
                    </div>
                    <Badge className="bg-primary/5 text-primary border-none text-[7px] md:text-[8px] font-black px-2 h-4.5 rounded-full">{unit.mode}</Badge>
                  </div>
                  <div className="space-y-1 flex-1 text-left">
                    <h3 className="text-xs md:text-sm font-black leading-tight tracking-tight uppercase">{unit.name}</h3>
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-950/40 uppercase tracking-widest line-clamp-2 md:line-clamp-none">{unit.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-black/5 mt-4 md:mt-6 flex items-center justify-between">
                    <span className="text-[7px] md:text-[8px] font-black text-slate-950/30 uppercase tracking-[0.2em]">{unit.cat === 'Intelligence' ? 'Advanced' : unit.cat}</span>
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
