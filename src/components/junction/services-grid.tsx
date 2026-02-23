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
  Activity
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
  cat: 'Organize' | 'Optimize' | 'Convert' | 'Edit' | 'Security' | 'Intelligence';
  complexity: 'System' | 'Smart' | 'Ai';
};

export const ALL_UNITS: ServiceUnit[] = [
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple documents and images into a single master document buffer.', icon: Layout, tag: 'Sequence', cat: 'Organize', complexity: 'System' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide documents by ranges or auto-detected chapters into individual files.', icon: Scissors, tag: 'Divide', cat: 'Organize', complexity: 'System' },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Prune unwanted pages and purge orphaned resources from the document tree.', icon: Trash2, tag: 'Prune', cat: 'Organize', complexity: 'System' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate specific page ranges while maintaining full transparency groups.', icon: Copy, tag: 'Isolate', cat: 'Organize', complexity: 'Smart' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Restructure the document tree with high-fidelity visual management.', icon: Layout, tag: 'Tree', cat: 'Organize', complexity: 'Smart' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', desc: 'Capture prints via Camera API with adaptive shadow and skew removal.', icon: Scan, tag: 'Capture', cat: 'Optimize', complexity: 'System' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Re-encode bitstreams and subset fonts for maximum storage efficiency.', icon: Shrink, tag: 'Minify', cat: 'Optimize', complexity: 'Smart' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Execute deep byte-scans to recover objects from corrupted cross-reference tables.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', complexity: 'Ai' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Synthesize searchable text layers over raster scans using smart recognition.', icon: Search, tag: 'Vision', cat: 'Optimize', complexity: 'Ai' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert OOXML structures into pixel-perfect fixed-layout documents.', icon: FileText, tag: 'Office', cat: 'Convert', complexity: 'System' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Reconstruct paragraph hierarchies and editable runs from raw vectors.', icon: FileText, tag: 'Reconstruct', cat: 'Convert', complexity: 'Smart' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map tabular grids into clean, coordinate-accurate document tables.', icon: Table, tag: 'Data', cat: 'Convert', complexity: 'Smart' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract grid data into structured spreadsheet workbooks with type inference.', icon: Table, tag: 'Grid', cat: 'Convert', complexity: 'Ai' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Execute DOM-to-Vector rendering for professional web archiving.', icon: Code2, tag: 'Web', cat: 'Convert', complexity: 'Smart' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Directly modify text, image, and vector objects within the live stream.', icon: Edit3, tag: 'Mastery', cat: 'Edit', complexity: 'Smart' },
  { id: 'watermark-pdf', name: 'Add Watermark', desc: 'Stamp identification text or image layers with precision opacity.', icon: Type, tag: 'Brand', cat: 'Edit', complexity: 'Smart' },
  { id: 'page-numbers', name: 'Add Page Numbers', desc: 'Inject dynamic page indices into header or footer coordinate slots.', icon: Hash, tag: 'Indexing', cat: 'Edit', complexity: 'Smart' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Seal documents with AES-256 encryption and custom permission flags.', icon: Lock, tag: 'Seal', cat: 'Security', complexity: 'Smart' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Apply digital signatures with verified audit trails and integrity logs.', icon: PenTool, tag: 'Legal', cat: 'Security', complexity: 'Smart' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently purge sensitive data from both visual and binary layers.', icon: EyeOff, tag: 'Privacy', cat: 'Security', complexity: 'Ai' },
  { id: 'digital-seal', name: 'Digital Seal', desc: 'Inject a cryptographic QR integrity seal into the document buffer.', icon: QrCode, tag: 'Integrity', cat: 'Security', complexity: 'Smart' },
  { id: 'metadata-purge', name: 'Metadata Purge', desc: 'Systematically strip tracking and authorship metadata from file headers.', icon: ShieldX, tag: 'Cleanse', cat: 'Security', complexity: 'Smart' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Map document content into 50+ languages while preserving layout.', icon: Globe, tag: 'Smart', cat: 'Intelligence', complexity: 'Ai' },
  { id: 'summarize-pdf', name: 'Summarize PDF', desc: 'Generate structured executive briefs and key insights from documents.', icon: FileText, tag: 'Brief', cat: 'Intelligence', complexity: 'Ai' },
  { id: 'ai-qa', name: 'AI Chat Q&A', desc: 'Engage in natural language dialogue with your document content.', icon: MessageSquare, tag: 'Dialogue', cat: 'Intelligence', complexity: 'Ai' },
  { id: 'form-creator', name: 'Form Creator', desc: 'Develop interactive fillable forms with smart validation logic.', icon: CheckCircle2, tag: 'AcroForm', cat: 'Edit', complexity: 'Smart' },
  { id: 'form-filler', name: 'Form Filler', desc: 'Auto-detect and populate existing form fields with session data.', icon: FileCode, tag: 'AutoFill', cat: 'Edit', complexity: 'Smart' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      type: "spring",
      stiffness: 120,
      damping: 16
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
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
                
                <CardContent className="p-8 flex flex-col h-full text-slate-950 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-white/60 rounded-[1.5rem] flex items-center justify-center group-hover/card:scale-110 group-hover/card:bg-primary/10 transition-all duration-700 border-2 border-black/5 shadow-inner">
                      <unit.icon className="w-8 h-8 text-slate-950 group-hover/card:text-primary transition-colors duration-500" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn(
                        "text-[9px] font-black h-5 px-2.5 border-none tracking-[0.2em] uppercase shadow-sm rounded-full",
                        unit.complexity === 'System' ? "bg-emerald-500/10 text-emerald-600" :
                        unit.complexity === 'Ai' ? "bg-primary/10 text-primary" :
                        "bg-orange-500/10 text-orange-600"
                      )}>
                        {unit.complexity}
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
                      <span className="text-[9px] font-black text-slate-950/60 uppercase tracking-widest">Instance Ready</span>
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
