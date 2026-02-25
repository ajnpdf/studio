'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Scissors, Trash2, Copy, Search, Shrink, Wrench, Hash, Unlock, Lock, 
  PenTool, EyeOff, GitCompare, Globe, FolderOpen, Presentation, ShieldCheck, 
  MousePointer2, History, Paintbrush, Layers, ImageIcon, FileText, Table, ArrowRight,
  FileCode, Plus, RotateCw, Type, ListChecks, Scan, Archive
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
  benefits?: string[];
  instructions?: string[];
  useCases?: string[];
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
    color: '#3B82F6',
    benefits: ['Universal segment combining', 'Logic-based page ordering', 'Industrial speed'],
    instructions: ['Inhale source PDFs', 'Adjust visionary grid', 'Execute merge'],
    useCases: ['Academic report assembly', 'Business document consolidation']
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
    id: 'pdf-word', 
    name: 'PDF to Word', 
    desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.', 
    icon: FileText, 
    tag: 'Word', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#3B82F6'
  },
  { 
    id: 'pdf-pptx', 
    name: 'PDF to PowerPoint', 
    desc: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', 
    icon: Presentation, 
    tag: 'PPT', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#D97706'
  },
  { 
    id: 'pdf-excel', 
    name: 'PDF to Excel', 
    desc: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', 
    icon: Table, 
    tag: 'Excel', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#059669'
  },
  { 
    id: 'word-pdf', 
    name: 'Word to PDF', 
    desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', 
    icon: FileText, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#2563EB'
  },
  { 
    id: 'ppt-pdf', 
    name: 'PowerPoint to PDF', 
    desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', 
    icon: Presentation, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#EA580C'
  },
  { 
    id: 'excel-pdf', 
    name: 'Excel to PDF', 
    desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', 
    icon: Table, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#16A34A'
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
    id: 'pdf-jpg', 
    name: 'PDF to JPG', 
    desc: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', 
    icon: ImageIcon, 
    tag: 'JPG', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#EF4444'
  },
  { 
    id: 'jpg-pdf', 
    name: 'JPG to PDF', 
    desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', 
    icon: ImageIcon, 
    tag: 'PDF', 
    cat: 'Convert', 
    mode: 'Standard', 
    color: '#3B82F6'
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
    id: 'watermark-pdf', 
    name: 'Watermark', 
    desc: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', 
    icon: Type, 
    tag: 'Watermark', 
    cat: 'Edit', 
    mode: 'Standard', 
    color: '#6366F1'
  },
  { 
    id: 'rotate-pdf', 
    name: 'Rotate PDF', 
    desc: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', 
    icon: RotateCw, 
    tag: 'Rotate', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#8B5CF6'
  },
  { 
    id: 'html-pdf', 
    name: 'HTML to PDF', 
    desc: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.', 
    icon: Globe, 
    tag: 'HTML', 
    cat: 'Convert', 
    mode: 'Advanced', 
    color: '#0EA5E9'
  },
  { 
    id: 'unlock-pdf', 
    name: 'Unlock PDF', 
    desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', 
    icon: Unlock, 
    tag: 'Unlock', 
    cat: 'Security', 
    mode: 'Standard', 
    color: '#F59E0B'
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
    id: 'organize-pdf', 
    name: 'Organize PDF', 
    desc: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.', 
    icon: FolderOpen, 
    tag: 'Organize', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#4F46E5'
  },
  { 
    id: 'pdf-pdfa', 
    name: 'PDF to PDF/A', 
    desc: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.', 
    icon: Archive, 
    tag: 'Archival', 
    cat: 'Export', 
    mode: 'Standard', 
    color: '#111827'
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
    id: 'add-page-numbers', 
    name: 'Page numbers', 
    desc: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.', 
    icon: Hash, 
    tag: 'Pages', 
    cat: 'Organize', 
    mode: 'Standard', 
    color: '#4B5563'
  },
  { 
    id: 'scan-pdf', 
    name: 'Scan to PDF', 
    desc: 'Capture document scans from your mobile device and send them instantly to your browser.', 
    icon: Scan, 
    tag: 'Scan', 
    cat: 'Convert', 
    mode: 'Advanced', 
    color: '#047857'
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
