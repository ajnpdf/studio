'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Scissors, Shrink, FileText, MousePointer2, 
  PenTool, Lock, Wrench, Search, GitCompare,
  ArrowRight, Archive, Scan, Layers, Type, RotateCw, 
  Trash2, Copy, Hash, Unlock, GitBranch, Globe, 
  FolderOpen, Presentation, ShieldCheck, History,
  Paintbrush, Table, FileCode, Plus, ListChecks
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
  cat: 'Organize' | 'Optimize' | 'Convert' | 'Edit' | 'Security' | 'Export' | 'Intelligence';
  mode: 'Standard' | 'Advanced';
  color: string;
};

export const ALL_UNITS: ServiceUnit[] = [
  { 
    id: 'merge-pdf', 
    name: 'Merge PDF', 
    desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', 
    icon: Layout, 
    tag: 'Merge', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#3B82F6'
  },
  { 
    id: 'split-pdf', 
    name: 'Split PDF', 
    desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', 
    icon: Scissors, 
    tag: 'Split', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#6366F1'
  },
  { 
    id: 'compress-pdf', 
    name: 'Compress PDF', 
    desc: 'Reduce file size while optimizing for maximal PDF quality.', 
    icon: Shrink, 
    tag: 'Compress', 
    cat: 'Optimize', 
    mode: 'Standard', 
    color: '#10B981'
  },
  { 
    id: 'repair-pdf', 
    name: 'Repair PDF', 
    desc: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.', 
    icon: Wrench, 
    tag: 'Repair', 
    cat: 'Optimize', 
    mode: 'Advanced', 
    color: '#B91C1C'
  },
  { 
    id: 'edit-pdf', 
    name: 'Edit PDF', 
    desc: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.', 
    icon: MousePointer2, 
    tag: 'Edit', 
    cat: 'Edit', 
    mode: 'Advanced', 
    color: '#BE185D'
  },
  { 
    id: 'sign-pdf', 
    name: 'Sign PDF', 
    desc: 'Sign yourself or request electronic signatures from others.', 
    icon: PenTool, 
    tag: 'Sign', 
    cat: 'Security', 
    mode: 'Standard', 
    color: '#1F2937'
  },
  { 
    id: 'ocr-pdf', 
    name: 'OCR PDF', 
    desc: 'Easily convert scanned PDF into searchable and selectable documents.', 
    icon: Search, 
    tag: 'OCR', 
    cat: 'Optimize', 
    mode: 'Advanced', 
    color: '#065F46'
  },
  { 
    id: 'compare-pdf', 
    name: 'Compare PDF', 
    desc: 'Show a side-by-side document comparison and easily spot changes between different file versions.', 
    icon: GitCompare, 
    tag: 'Compare', 
    cat: 'Intelligence', 
    mode: 'Advanced', 
    color: '#1E40AF'
  },
  { 
    id: 'protect-pdf', 
    name: 'Protect PDF', 
    desc: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', 
    icon: Lock, 
    tag: 'Protect', 
    cat: 'Security', 
    mode: 'Standard', 
    color: '#059669'
  },
  { 
    id: 'pdf-word', 
    name: 'PDF to Word', 
    desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.', 
    icon: FileText, 
    tag: 'Word', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#3B82F6'
  }
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
        <p className="text-xs font-black tracking-widest uppercase">Unit Not Calibrated</p>
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