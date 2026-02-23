"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ImageIcon, 
  Table, 
  ArrowRight,
  Layout,
  Scissors,
  Trash2,
  Copy,
  Search,
  Shrink,
  Wrench,
  Hash,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  GitCompare,
  Globe,
  FolderOpen,
  Presentation,
  ShieldCheck,
  Cpu,
  MousePointer2,
  History,
  Paintbrush,
  Layers
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
  // --- ORGANIZE ---
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple assets into a single master document buffer.', icon: Layout, tag: 'Sequence', cat: 'Organize', mode: 'WASM', color: '#3B82F6' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide documents by ranges or auto-detected sections.', icon: Scissors, tag: 'Divide', cat: 'Organize', mode: 'WASM', color: '#6366F1' },
  { id: 'delete-pages', name: 'Remove Pages', desc: 'Prune unwanted indices and purge orphaned resources.', icon: Trash2, tag: 'Prune', cat: 'Organize', mode: 'WASM', color: '#8B5CF6' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate specific page ranges into new documents.', icon: Copy, tag: 'Isolate', cat: 'Organize', mode: 'SMART', color: '#A78BFA' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Reorder, rotate, and manage document structures.', icon: FolderOpen, tag: 'Structure', cat: 'Organize', mode: 'SMART', color: '#C084FC' },

  // --- OPTIMIZE ---
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Re-encode bitstreams for maximum storage efficiency.', icon: Shrink, tag: 'Minify', cat: 'Optimize', mode: 'SMART', color: '#10B981' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Execute deep byte-scans to recover corrupted objects.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', mode: 'AI', color: '#059669' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Synthesize searchable text layers over raster scans.', icon: Search, tag: 'Vision', cat: 'Optimize', mode: 'AI', color: '#047857' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'Hardened archival conversion for ISO compliance.', icon: ShieldCheck, tag: 'Archive', cat: 'Optimize', mode: 'WASM', color: '#065F46' },
  { id: 'grayscale-pdf', name: 'Grayscale PDF', desc: 'Convert all color streams to monochromatic luminosity.', icon: Paintbrush, tag: 'Tone', cat: 'Optimize', mode: 'WASM', color: '#4B5563' },

  // --- CONVERT ---
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Transform imagery sequences into pixel-perfect documents.', icon: ImageIcon, tag: 'Imagery', cat: 'Convert', mode: 'WASM', color: '#F59E0B' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert OOXML structures into fixed-layout PDFs.', icon: FileText, tag: 'Office', cat: 'Convert', mode: 'WASM', color: '#D97706' },
  { id: 'ppt-pdf', name: 'PowerPoint to PDF', desc: 'Transform slide decks into high-fidelity presentations.', icon: Presentation, tag: 'Slides', cat: 'Convert', mode: 'SMART', color: '#B45309' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map tabular grids into clean, coordinate-accurate tables.', icon: Table, tag: 'Data', cat: 'Convert', mode: 'SMART', color: '#92400E' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Render web content into segmented document containers.', icon: Globe, tag: 'Web', cat: 'Convert', mode: 'SMART', color: '#78350F' },

  // --- EXPORT ---
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export document pages as high-resolution imagery buffers.', icon: ImageIcon, tag: 'Raster', cat: 'Export', mode: 'WASM', color: '#EF4444' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Reconstruct paragraph hierarchies from raw vectors.', icon: FileText, tag: 'Doc', cat: 'Export', mode: 'WASM', color: '#DC2626' },
  { id: 'pdf-pptx', name: 'PDF to PPTX', desc: 'Convert pages into editable presentation slides.', icon: Presentation, tag: 'Slides', cat: 'Export', mode: 'AI', color: '#B91C1C' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract grid data into structured spreadsheet workbooks.', icon: Table, tag: 'Grid', cat: 'Export', mode: 'AI', color: '#991B1C' },

  // --- EDIT ---
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Correct orientations via metadata transformation.', icon: History, tag: 'Geometry', cat: 'Edit', mode: 'WASM', color: '#EC4899' },
  { id: 'add-page-numbers', name: 'Add Numbers', desc: 'Precision coordinate-mapped document numbering.', icon: Hash, tag: 'Indexing', cat: 'Edit', mode: 'WASM', color: '#DB2777' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Full interactive object-model document manipulation.', icon: MousePointer2, tag: 'Mastery', cat: 'Edit', mode: 'SMART', color: '#BE185D' },

  // --- SECURITY ---
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Purge encryption handlers and permission flags.', icon: Unlock, tag: 'Decrypt', cat: 'Security', mode: 'WASM', color: '#000000' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Hardened AES-256 encryption and permissions.', icon: Lock, tag: 'Encrypt', cat: 'Security', mode: 'WASM', color: '#111827' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Cryptographic digital signatures and e-signing.', icon: PenTool, tag: 'E-Sign', cat: 'Security', mode: 'SMART', color: '#1F2937' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanent surgical binary data removal.', icon: EyeOff, tag: 'Purge', cat: 'Security', mode: 'AI', color: '#374151' },
  { id: 'flatten-pdf', name: 'Flatten PDF', desc: 'Hard-bake form fields and annotations into the raster layer.', icon: Layers, tag: 'Static', cat: 'Security', mode: 'WASM', color: '#4B5563' },

  // --- INTELLIGENCE ---
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Map document content into 50+ languages.', icon: Globe, tag: 'Smart', cat: 'Intelligence', mode: 'AI', color: '#3B82F6' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Differential analysis of text and visual layers.', icon: GitCompare, tag: 'Diff', cat: 'Intelligence', mode: 'AI', color: '#2563EB' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Generate structured briefs from complex data.', icon: FileText, tag: 'Extract', cat: 'Intelligence', mode: 'AI', color: '#1D4ED8' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
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
        <div className="w-20 h-20 mx-auto text-slate-950 flex items-center justify-center bg-black/5 rounded-[2.5rem]">
          <Search className="w-10 h-10" />
        </div>
        <p className="text-lg font-black uppercase tracking-widest text-slate-950">Instance Not Found</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32"
    >
      <AnimatePresence mode="popLayout">
        {filteredUnits.map((unit) => (
          <motion.div key={unit.id} layout variants={cardVariants} className="group h-full">
            <Link href={`/tools/${unit.id}`}>
              <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 transition-all duration-700 cursor-pointer overflow-hidden border-2 relative backdrop-blur-2xl shadow-xl group/card rounded-[2.5rem]">
                <CardContent className="p-8 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center border-2 border-black/5 group-hover/card:scale-110 transition-transform duration-500 shadow-inner">
                      <unit.icon className="w-7 h-7 text-slate-950 group-hover/card:text-primary transition-colors" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2.5 h-5 rounded-full">{unit.mode}</Badge>
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-black uppercase leading-none tracking-tight">{unit.name}</h3>
                    <p className="text-[10px] font-bold text-slate-950/40 uppercase leading-relaxed tracking-wide">{unit.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-black/5 mt-8 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-950/30 uppercase tracking-[0.2em]">{unit.cat}</span>
                    <div className="flex items-center gap-2 group-hover/card:text-primary transition-all">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 translate-x-2 group-hover/card:translate-x-0 transition-all">Execute</span>
                      <ArrowRight className="w-4 h-4 text-primary translate-x-4 group-hover/card:translate-x-0 transition-all" />
                    </div>
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