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
  Maximize
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
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Restructure the document tree with high-fidelity visual management.', icon: Layout, tag: 'Tree', cat: 'Organize', mode: 'SMART', color: '#7C3AED' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', desc: 'Capture prints via Camera API with adaptive shadow and skew removal.', icon: Scan, tag: 'Capture', cat: 'Organize', mode: 'WASM', color: '#5B21B6' },
  
  // Optimize
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Re-encode bitstreams and subset fonts for maximum storage efficiency.', icon: Shrink, tag: 'Minify', cat: 'Optimize', mode: 'SMART', color: '#10B981' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Execute deep byte-scans to recover objects from corrupted cross-reference tables.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', mode: 'AI', color: '#059669' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Synthesize searchable text layers over raster scans using smart recognition.', icon: Search, tag: 'Vision', cat: 'Optimize', mode: 'AI', color: '#047857' },
  
  // Convert TO
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert OOXML structures into pixel-perfect fixed-layout documents.', icon: FileText, tag: 'Office', cat: 'Convert', mode: 'WASM', color: '#F59E0B' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map tabular grids into clean, coordinate-accurate document tables.', icon: Table, tag: 'Data', cat: 'Convert', mode: 'SMART', color: '#D97706' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Execute DOM-to-Vector rendering for professional web archiving.', icon: Code2, tag: 'Web', cat: 'Convert', mode: 'WASM', color: '#B45309' },
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Transform images into printable documents with precision margins.', icon: ImageIcon, tag: 'Imagery', cat: 'Convert', mode: 'WASM', color: '#92400E' },
  
  // Export FROM
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Reconstruct paragraph hierarchies and editable runs from raw vectors.', icon: FileText, tag: 'Reconstruct', cat: 'Export', mode: 'WASM', color: '#EF4444' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract grid data into structured spreadsheet workbooks with type inference.', icon: Table, tag: 'Grid', cat: 'Export', mode: 'SMART', color: '#DC2626' },
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export document pages as high-resolution imagery buffers.', icon: ImageIcon, tag: 'Export', cat: 'Export', mode: 'WASM', color: '#B91C1C' },
  { id: 'pdf-a', name: 'PDF to PDF/A', desc: 'Standardize for ISO-compliant long-term archival storage.', icon: CheckCircle2, tag: 'Archive', cat: 'Export', mode: 'WASM', color: '#7F1D1D' },

  // Edit
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Directly modify text, image, and vector objects within the live stream.', icon: Edit3, tag: 'Mastery', cat: 'Edit', mode: 'SMART', color: '#06B6D4' },
  { id: 'watermark-pdf', name: 'Add Watermark', desc: 'Stamp identification text or image layers with precision opacity.', icon: Type, tag: 'Brand', cat: 'Edit', mode: 'WASM', color: '#0E7490' },
  { id: 'page-numbers', name: 'Add Page Numbers', desc: 'Inject dynamic page indices into header or footer coordinate slots.', icon: Hash, tag: 'Indexing', cat: 'Edit', mode: 'SMART', color: '#0891B2' },
  { id: 'crop-pdf', name: 'Crop PDF', desc: 'Adjust the visible canvas with a high-fidelity precision crop box.', icon: Maximize, tag: 'Canvas', cat: 'Edit', mode: 'SMART', color: '#155E75' },

  // Security
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Seal documents with AES-256 encryption and custom permission flags.', icon: Lock, tag: 'Seal', cat: 'Security', mode: 'SMART', color: '#F97316' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Apply digital signatures with verified audit trails and integrity logs.', icon: PenTool, tag: 'Legal', cat: 'Security', mode: 'AI', color: '#EA580C' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently purge sensitive data from both visual and binary layers.', icon: EyeOff, tag: 'Privacy', cat: 'Security', mode: 'AI', color: '#C2410C' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Detect semantic changes between different document versions.', icon: GitCompare, tag: 'Audit', cat: 'Security', mode: 'AI', color: '#9A3412' },

  // Intelligence
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Map document content into 50+ languages while preserving layout.', icon: Globe, tag: 'Smart', cat: 'Intelligence', mode: 'AI', color: '#EC4899' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Generate structured executive briefs and key insights from documents.', icon: FileText, tag: 'Brief', cat: 'Intelligence', mode: 'AI', color: '#DB2777' },
  { id: 'ai-qa', name: 'AI Chat Q&A', desc: 'Ask questions about document content in natural language.', icon: MessageSquare, tag: 'Dialogue', cat: 'Intelligence', mode: 'AI', color: '#BE185D' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.92 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.25, 1, 0.5, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.25 } 
  }
};

export function ServicesGrid({ query, category }: { query: string, category: string }) {
  const filteredUnits = useMemo(() => {
    return ALL_UNITS.filter(unit => {
      const matchesSearch = unit.name.toLowerCase().includes(query.toLowerCase()) || 
                           unit.desc.toLowerCase().includes(query.toLowerCase()) ||
                           unit.tag.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || unit.cat === category;
      return matchesSearch && matchesCategory;
    });
  }, [query, category]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  if (filteredUnits.length === 0) {
    return (
      <div className="py-32 text-center space-y-6 opacity-30 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 mx-auto text-slate-950 flex items-center justify-center bg-black/5 rounded-[3rem]">
          <Search className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black tracking-tight text-slate-950 uppercase">Instance Not Found</p>
          <p className="text-[11px] font-bold text-slate-950/60 uppercase tracking-[0.4em]">Calibrate search parameters for match</p>
        </div>
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
          <motion.div
            key={unit.id}
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseMove={handleMouseMove}
            className="group h-full"
          >
            <Link href={`/tools/${unit.id}`}>
              <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 hover:bg-white/60 transition-all duration-700 cursor-pointer overflow-hidden border-2 relative backdrop-blur-2xl shadow-xl glow-border group/card">
                <div className="scan-line opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-4 group-hover/card:translate-x-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                {/* Accent Glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${unit.color}11 0%, transparent 70%)`
                  }}
                />

                <CardContent className="p-8 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-white/60 rounded-[1.5rem] flex items-center justify-center group-hover/card:scale-110 group-hover/card:bg-primary/10 transition-all duration-700 border-2 border-black/5 shadow-inner">
                      <unit.icon className="w-8 h-8 text-slate-950 group-hover/card:text-primary transition-colors duration-500" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn(
                        "text-[9px] font-black h-5 px-2.5 border tracking-[0.1em] uppercase shadow-sm rounded-full",
                        unit.mode === 'WASM' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                        unit.mode === 'AI' ? "bg-pink-500/10 text-pink-600 border-pink-500/20" :
                        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      )}>
                        {unit.mode}
                      </Badge>
                      <span className="text-[10px] font-black text-slate-950/30 uppercase tracking-[0.3em]">{unit.tag}</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-black tracking-tighter group-hover/card:text-primary transition-colors duration-500 leading-none uppercase">{unit.name}</h3>
                    <p className="text-[11px] leading-relaxed font-bold tracking-wide line-clamp-3 text-slate-950/50 group-hover/card:text-slate-950/80 transition-colors duration-500 uppercase">
                      {unit.desc}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-black/5 mt-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest">Engine Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-slate-950/20" />
                      <span className="text-[9px] font-black text-slate-950/40 uppercase tracking-[0.2em]">{unit.cat}</span>
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
