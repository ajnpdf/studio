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
  benefits?: string[];
  instructions?: string[];
  useCases?: string[];
};

export const ALL_UNITS: ServiceUnit[] = [
  { 
    id: 'merge-pdf', 
    name: 'Merge PDF', 
    desc: 'Consolidate separate PDF files into a single document.', 
    icon: Layout, 
    tag: 'Merge', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#3B82F6',
    benefits: ['Consolidates fragmented records', 'Reduces file management overhead', 'Optimizes document portability'],
    instructions: ['Inhale source files into the secure buffer.', 'Arrange segments in the desired sequence.', 'Execute the binary merge protocol.'],
    useCases: ['Merging assignment chapters.', 'Consolidating monthly financial reports.']
  },
  { 
    id: 'split-pdf', 
    name: 'Split PDF', 
    desc: 'Divide files by page range or segments.', 
    icon: Scissors, 
    tag: 'Split', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#6366F1',
    benefits: ['Extracts critical data points', 'Enables targeted information sharing', 'Decomposes oversized binaries'],
    instructions: ['Load document into the visual workspace.', 'Select specific page ranges for extraction.', 'Finalize segment isolation.'],
    useCases: ['Extracting specific textbook chapters.', 'Isolating individual invoices from a batch run.']
  },
  { 
    id: 'compress-pdf', 
    name: 'Compress PDF', 
    desc: 'Reduce document size while preserving quality.', 
    icon: Shrink, 
    tag: 'Compress', 
    cat: 'Optimize', 
    mode: 'Standard', 
    color: '#10B981',
    benefits: ['Minimizes storage infrastructure costs', 'Bypasses email attachment limits', 'Accelerates web-based document loading'],
    instructions: ['Select the target document.', 'Define the required reduction level (MB/KB).', 'Execute surgical stream deflation.'],
    useCases: ['Uploading compressed portfolios to portals.', 'Optimizing archival document storage.']
  },
  { 
    id: 'ocr-pdf', 
    name: 'Text Recognition', 
    desc: 'Convert scanned images to searchable PDF.', 
    icon: Search, 
    tag: 'OCR', 
    cat: 'Optimize', 
    mode: 'Advanced', 
    color: '#047857',
    benefits: ['Enables text searching in legacy scans', 'Supports automated data indexing', 'Improves document accessibility'],
    instructions: ['Inhale the raster image or scanned PDF.', 'Choose the target recognition language.', 'Run the character identification protocol.'],
    useCases: ['Converting handwritten notes to text.', 'Digitizing physical contracts for searchable archives.']
  },
  { 
    id: 'sign-pdf', 
    name: 'Sign PDF', 
    desc: 'Add professional digital signatures.', 
    icon: PenTool, 
    tag: 'Sign', 
    cat: 'Security', 
    mode: 'Standard', 
    color: '#1F2937',
    benefits: ['Executes legally binding authorizations', 'Operates entirely in local secure buffer', 'Eliminates physical printing costs'],
    instructions: ['Load document segment into editor.', 'Draw, type, or upload your signature asset.', 'Place signature box and commit to binary.'],
    useCases: ['Signing internship applications.', 'Authorizing commercial vendor agreements.']
  },
  { 
    id: 'word-pdf', 
    name: 'Word to PDF', 
    desc: 'High-fidelity DOCX to PDF conversion.', 
    icon: FileText, 
    tag: 'Convert', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#D97706',
    benefits: ['Preserves complex document layouts', 'Ensures universal platform compatibility', 'Locks content against accidental edits'],
    instructions: ['Browse and select Word-compatible files.', 'Verify page layout in the visionary preview.', 'Launch the OOXML-to-PDF transformation.'],
    useCases: ['Converting essays for submission.', 'Preparing professional proposals for clients.']
  },
  { 
    id: 'protect-pdf', 
    name: 'Protect PDF', 
    desc: 'Secure documents with 256-bit encryption.', 
    icon: Lock, 
    tag: 'Protect', 
    cat: 'Security', 
    mode: 'Standard', 
    color: '#059669', 
    benefits: ['Restricts unauthorized document access', 'Enforces strict viewing permissions', 'Secures sensitive personal data'], 
    instructions: ['Inhale the target document.', 'Define a robust master password.', 'Execute the encryption protocol.'], 
    useCases: ['Securing financial statements.', 'Protecting private legal records.'] 
  },
  { 
    id: 'edit-pdf', 
    name: 'Edit PDF', 
    desc: 'Modify existing document layers.', 
    icon: MousePointer2, 
    tag: 'Edit', 
    cat: 'Edit', 
    mode: 'Advanced', 
    color: '#BE185D', 
    benefits: ['Direct layer manipulation', 'Real-time text and image injection', 'Professional markup tools'], 
    instructions: ['Open document in advanced editor.', 'Select object or add new text/image layer.', 'Commit surgical changes to binary.'], 
    useCases: ['Editing document text and images in real time.'] 
  },
  { 
    id: 'pdf-jpg', 
    name: 'PDF to JPG', 
    desc: 'Convert PDF segments to images.', 
    icon: ImageIcon, 
    tag: 'Export', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#EF4444', 
    benefits: ['Enables social media document sharing', 'Creates lightweight presentation assets', 'Universal image compatibility'], 
    instructions: ['Load target PDF document.', 'Select specific pages or full range.', 'Export to high-fidelity JPEG matrix.'], 
    useCases: ['Sharing infographics.', 'Extracting slide frames for social channels.'] 
  },
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
                    <span className="text-[7px] md:text-[8px] font-black text-slate-950/30 uppercase tracking-[0.2em]">{unit.cat}</span>
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
