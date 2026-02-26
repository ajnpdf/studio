'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Scissors, 
  Shrink, 
  FileText, 
  MousePointer2, 
  ArrowRight, 
  FileCode,
  ImageIcon,
  Presentation,
  Table,
  RotateCw
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
  cat: 'Organize' | 'Optimize' | 'Convert' | 'Edit' | 'Security' | 'Export';
  mode: 'Standard' | 'Advanced';
  color: string;
  benefits?: string[];
  instructions?: string[];
  useCases?: string[];
};

/**
 * AJN Major Registry - 2026 Industrial Standards
 * Refined Suite of 10 Professional Units.
 */
export const ALL_UNITS: ServiceUnit[] = [
  { 
    id: 'edit-pdf', 
    name: 'Edit PDF', 
    desc: 'Add text, images, shapes or freehand annotations to a PDF document. Edit PDF content in real-time.', 
    icon: MousePointer2, 
    tag: 'Edit', 
    cat: 'Edit', 
    mode: 'Advanced', 
    color: '#EC4899',
    benefits: ['Real-time object manipulation', 'Native browser performance', 'Zero-latency sync'],
    instructions: ['Inhale PDF binary', 'Apply surgical modifications', 'Export master output'],
    useCases: ['Legal redaction', 'Dynamic annotations', 'Visual audits']
  },
  { 
    id: 'merge-pdf', 
    name: 'Merge PDF', 
    desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', 
    icon: Layout, 
    tag: 'Merge', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#3B82F6',
    benefits: ['Multi-asset synchronization', 'Binary order control', 'Optimized trailer handling'],
    instructions: ['Select 2+ PDF segments', 'Arrange operational order', 'Stitch into master binary'],
    useCases: ['Report assembly', 'Document grouping', 'Portfolio creation']
  },
  { 
    id: 'split-pdf', 
    name: 'Split PDF', 
    desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', 
    icon: Scissors, 
    tag: 'Split', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#6366F1',
    benefits: ['Precision segment extraction', 'Dynamic page mapping', 'Lightweight output'],
    instructions: ['Select source PDF', 'Identify target segments', 'Execute surgical extraction'],
    useCases: ['Page isolation', 'Asset decomposition', 'Specific segment export']
  },
  { 
    id: 'compress-pdf', 
    name: 'Compress PDF', 
    desc: 'Reduce file size while optimizing for maximal PDF quality.', 
    icon: Shrink, 
    tag: 'Compress', 
    cat: 'Optimize', 
    mode: 'Standard', 
    color: '#10B981',
    benefits: ['Intelligent stream deflation', 'Image layer optimization', 'Fidelity preservation'],
    instructions: ['Upload large asset', 'Adjust reduction strength', 'Download optimized binary'],
    useCases: ['Email optimization', 'Web performance', 'Storage conservation']
  },
  { 
    id: 'pdf-word', 
    name: 'PDF to Word', 
    desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', 
    icon: FileText, 
    tag: 'Word', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#3B82F6',
    benefits: ['Neural text extraction', 'Layout reconstruction', 'Editable OOXML output'],
    instructions: ['Load PDF binary', 'Analyze text layers', 'Export DOCX container'],
    useCases: ['Content repurposing', 'Document editing', 'Text recovery']
  },
  { 
    id: 'word-pdf', 
    name: 'Word to PDF', 
    desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', 
    icon: FileCode, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#2563EB',
    benefits: ['High-fidelity OOXML rendering', 'Font embedding sync', 'Universal readability'],
    instructions: ['Inhale Word asset', 'Execute layout engine', 'Download master PDF'],
    useCases: ['Official submissions', 'Clean sharing', 'Fixed layout archival']
  },
  { 
    id: 'jpg-pdf', 
    name: 'JPG to PDF', 
    desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', 
    icon: ImageIcon, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#4F46E5',
    benefits: ['Raster to vector mapping', 'Multi-frame assembly', 'Margin calibration'],
    instructions: ['Select image assets', 'Confirm visual order', 'Generate PDF document'],
    useCases: ['Image archiving', 'Photo report assembly', 'Social media export']
  },
  { 
    id: 'ppt-pdf', 
    name: 'PowerPoint to PDF', 
    desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', 
    icon: Presentation, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#D97706',
    benefits: ['Slide-perfect rendering', 'Animation layer flattening', 'Universal viewing'],
    instructions: ['Load presentation file', 'Parse slide indices', 'Export document binary'],
    useCases: ['Handout generation', 'Presentation sharing', 'Archival snapshots']
  },
  { 
    id: 'excel-pdf', 
    name: 'Excel to PDF', 
    desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', 
    icon: Table, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#059669',
    benefits: ['Grid-aware reconstruction', 'Pagination calibration', 'Format preservation'],
    instructions: ['Upload spreadsheet', 'Select worksheets', 'Generate grid-perfect PDF'],
    useCases: ['Financial reporting', 'Data snapshots', 'Inventory exports']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    desc: 'Rotate your PDFs the way you need them. Apply Right or Left orientation in bulk.',
    icon: RotateCw,
    tag: 'Rotate',
    cat: 'Organize',
    mode: 'Standard',
    color: '#f59e0b',
    benefits: ['Real-time orientation sync', 'Bulk direction control', 'Binary degree hardening'],
    instructions: ['Select PDF segments', 'Apply Right/Left rotate', 'Download oriented binary'],
    useCases: ['Scan correction', 'Orientation audits', 'Layout alignment']
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-32">
      <AnimatePresence mode="popLayout">
        {filteredUnits.map((unit) => (
          <motion.div key={unit.id} layout variants={cardVariants} className="group h-full">
            <Link href={unit.id === 'edit-pdf' ? '/tools/edit-pdf' : `/tools/${unit.id}`} className="block h-full">
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
