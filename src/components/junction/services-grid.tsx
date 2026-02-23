"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ImageIcon, 
  Table, 
  Code2, 
  ArrowRight,
  Layout,
  Scissors,
  Trash2,
  Copy,
  Scan,
  Shrink,
  Wrench,
  Search,
  Hash,
  Type,
  Edit3,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  GitCompare,
  Globe,
  QrCode,
  ShieldX,
  MessageSquare,
  FileCode,
  Layers,
  History,
  CheckCircle2,
  Accessibility,
  FolderOpen,
  Workflow,
  Sparkles,
  Zap,
  Activity,
  Maximize,
  Presentation
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  // Organize
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple files and images into a single master document buffer.', icon: Layout, tag: 'Sequence', cat: 'Organize', mode: 'WASM', color: '#3B82F6' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide documents by ranges or auto-detected chapters into individual files.', icon: Scissors, tag: 'Divide', cat: 'Organize', mode: 'WASM', color: '#6366F1' },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Prune unwanted pages and purge orphaned resources from the document tree.', icon: Trash2, tag: 'Prune', cat: 'Organize', mode: 'WASM', color: '#8B5CF6' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate specific page ranges while maintaining full transparency groups.', icon: Copy, tag: 'Isolate', cat: 'Organize', mode: 'SMART', color: '#A78BFA' },
  
  // Optimize
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Re-encode bitstreams and subset fonts for maximum storage efficiency.', icon: Shrink, tag: 'Minify', cat: 'Optimize', mode: 'SMART', color: '#10B981' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Execute deep byte-scans to recover objects from corrupted cross-reference tables.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', mode: 'AI', color: '#059669' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Synthesize searchable text layers over raster scans using smart recognition.', icon: Search, tag: 'Vision', cat: 'Optimize', mode: 'AI', color: '#047857' },
  
  // Convert TO
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert OOXML structures into pixel-perfect fixed-layout documents.', icon: FileText, tag: 'Office', cat: 'Convert', mode: 'WASM', color: '#F59E0B' },
  { id: 'ppt-pdf', name: 'PowerPoint to PDF', desc: 'Transform slide decks into high-fidelity presentation PDF documents.', icon: Presentation, tag: 'Slides', cat: 'Convert', mode: 'SMART', color: '#D97706' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map tabular grids into clean, coordinate-accurate document tables.', icon: Table, tag: 'Data', cat: 'Convert', mode: 'SMART', color: '#D97706' },
  
  // Export FROM
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Reconstruct paragraph hierarchies and editable runs from raw vectors.', icon: FileText, tag: 'Reconstruct', cat: 'Export', mode: 'WASM', color: '#EF4444' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract grid data into structured spreadsheet workbooks with type inference.', icon: Table, tag: 'Grid', cat: 'Export', mode: 'AI', color: '#DC2626' },
  { id: 'pdf-pptx', name: 'PDF to PPTX', desc: 'Convert document pages into editable presentation slides with AI layout mapping.', icon: Presentation, tag: 'Slides', cat: 'Export', mode: 'AI', color: '#F97316' },
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export document pages as high-resolution imagery buffers.', icon: ImageIcon, tag: 'Export', cat: 'Export', mode: 'WASM', color: '#B91C1C' },

  // Intelligence
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Map document content into 50+ languages while preserving layout.', icon: Globe, tag: 'Smart', cat: 'Intelligence', mode: 'AI', color: '#EC4899' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Generate structured executive briefs and key insights from documents.', icon: FileText, tag: 'Brief', cat: 'Intelligence', mode: 'AI', color: '#DB2777' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.92 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] }
  }
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
      <div className="py-32 text-center space-y-6 opacity-30">
        <div className="w-24 h-24 mx-auto text-slate-950 flex items-center justify-center bg-black/5 rounded-[3rem]">
          <Search className="w-12 h-12" />
        </div>
        <p className="text-xl font-black uppercase">Instance Not Found</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-40"
    >
      <AnimatePresence mode="popLayout">
        {filteredUnits.map((unit) => (
          <motion.div key={unit.id} layout variants={cardVariants} className="group h-full">
            <Link href={`/tools/${unit.id}`}>
              <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 transition-all duration-700 cursor-pointer overflow-hidden border-2 relative backdrop-blur-2xl shadow-xl group/card">
                <CardContent className="p-8 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-white/60 rounded-[1.5rem] flex items-center justify-center border-2 border-black/5">
                      <unit.icon className="w-8 h-8 text-slate-950 group-hover/card:text-primary transition-colors" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">{unit.mode}</Badge>
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-black uppercase leading-none">{unit.name}</h3>
                    <p className="text-[11px] font-bold text-slate-950/50 uppercase leading-relaxed">{unit.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-black/5 mt-8 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-950/60 uppercase">{unit.cat}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0" />
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
