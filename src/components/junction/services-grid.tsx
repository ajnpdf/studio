
"use client";

import { useMemo } from 'react';
import { 
  FileText, 
  ImageIcon, 
  Table, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  Presentation,
  Cpu,
  Layout,
  Scissors,
  Trash2,
  Copy,
  Scan,
  Shrink,
  Wrench,
  Search,
  RotateCw,
  Hash,
  Type,
  Crop,
  Edit3,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  GitCompare,
  Globe,
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
  cat: 'Organize' | 'Optimize' | 'Convert' | 'Edit' | 'Security' | 'Intelligence';
  complexity: 'Wasm' | 'Smart' | 'Ai';
};

export const ALL_UNITS: ServiceUnit[] = [
  // --- ORGANIZE ---
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple documents and images into a single, linearized PDF buffer.', icon: Layout, tag: 'Sequence', cat: 'Organize', complexity: 'Wasm' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Divide documents by ranges, intervals, or bookmark indices into individual files.', icon: Scissors, tag: 'Divide', cat: 'Organize', complexity: 'Wasm' },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Prune unwanted pages and purge orphaned font/image resources.', icon: Trash2, tag: 'Prune', cat: 'Organize', complexity: 'Wasm' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate specific page ranges while maintaining transparency groups and vector graphics.', icon: Copy, tag: 'Isolate', cat: 'Organize', complexity: 'Smart' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Restructure /Pages and /Outlines trees with a visual drag-and-drop manager.', icon: Layout, tag: 'Tree', cat: 'Organize', complexity: 'Smart' },

  // --- OPTIMIZE ---
  { id: 'scan-to-pdf', name: 'Scan to PDF', desc: 'Capture prints via Camera API and apply deskew, thresholding, and shadow removal.', icon: Scan, tag: 'Capture', cat: 'Optimize', complexity: 'Wasm' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Re-encode bitstreams and subset fonts to achieve maximum storage efficiency.', icon: Shrink, tag: 'Minify', cat: 'Optimize', complexity: 'Smart' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Execute linear byte-scans to recover objects from corrupted cross-reference tables.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', complexity: 'Ai' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Synthesize an invisible text layer over raster scans using smart character recognition.', icon: Search, tag: 'Vision', cat: 'Optimize', complexity: 'Ai' },

  // --- CONVERT TO ---
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Wrap raster images into standardized, printable document containers.', icon: ImageIcon, tag: 'Raster', cat: 'Convert', complexity: 'Wasm' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert OOXML structures into high-fidelity, fixed-layout document buffers.', icon: FileText, tag: 'Office', cat: 'Convert', complexity: 'Wasm' },
  { id: 'pptx-pdf', name: 'PowerPoint to PDF', desc: 'Render slide decks into universal presentation-grade PDF files.', icon: Presentation, tag: 'Office', cat: 'Convert', complexity: 'Wasm' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map tabular grids into clean, coordinate-accurate document tables.', icon: Table, tag: 'Data', cat: 'Convert', complexity: 'Smart' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Execute DOM-to-Vector rendering for professional web archiving.', icon: Code2, tag: 'Web', cat: 'Convert', complexity: 'Smart' },

  // --- CONVERT FROM ---
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export high-resolution raster frames from document page streams.', icon: ImageIcon, tag: 'Export', cat: 'Convert', complexity: 'Wasm' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Reconstruct paragraph hierarchies from raw text and positioning vectors.', icon: FileText, tag: 'Edit', cat: 'Convert', complexity: 'Wasm' },
  { id: 'pdf-pptx', name: 'PDF to PowerPoint', desc: 'Synthesize editable slide objects from document layer metadata.', icon: Presentation, tag: 'Slides', cat: 'Convert', complexity: 'Wasm' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract semantic grid data into structured spreadsheet workbooks.', icon: Table, tag: 'Grid', cat: 'Convert', complexity: 'Smart' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'Enforce ISO long-term archiving standards by embedding mandatory metadata.', icon: ShieldCheck, tag: 'ISO', cat: 'Convert', complexity: 'Smart' },

  // --- EDIT ---
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Apply geometric rotation to document pages in 90-degree intervals.', icon: RotateCw, tag: 'Geometry', cat: 'Edit', complexity: 'Wasm' },
  { id: 'page-numbers', name: 'Add Page Numbers', desc: 'Inject dynamic page indices into header or footer coordinate slots.', icon: Hash, tag: 'Indexing', cat: 'Edit', complexity: 'Smart' },
  { id: 'watermark-pdf', name: 'Add Watermark', desc: 'Stamp identification text or image layers with adjustable opacity.', icon: Type, tag: 'Brand', cat: 'Edit', complexity: 'Smart' },
  { id: 'crop-pdf', name: 'Crop PDF', desc: 'Modify the visual canvas by adjusting the document crop-box boundaries.', icon: Crop, tag: 'Canvas', cat: 'Edit', complexity: 'Wasm' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Directly modify text and image objects within the existing PDF stream.', icon: Edit3, tag: 'Mastery', cat: 'Edit', complexity: 'Smart' },

  // --- SECURITY ---
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Bypass system restrictions and purge owner passwords from document streams.', icon: Unlock, tag: 'Access', cat: 'Security', complexity: 'Smart' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Seal documents with AES-256 encryption and custom user permissions.', icon: Lock, tag: 'Seal', cat: 'Security', complexity: 'Smart' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Apply digital signatures with verified audit trails and legal integrity.', icon: PenTool, tag: 'Legal', cat: 'Security', complexity: 'Smart' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently purge sensitive data from both the visual and binary layers.', icon: EyeOff, tag: 'Privacy', cat: 'Security', complexity: 'Ai' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Detect semantic differences between two versions of a document.', icon: GitCompare, tag: 'Audit', cat: 'Security', complexity: 'Ai' },

  // --- INTELLIGENCE ---
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Map document content into 50+ languages via smart translation models.', icon: Globe, tag: 'Smart', cat: 'Intelligence', complexity: 'Ai' },
];

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

  if (filteredUnits.length === 0) {
    return (
      <div className="py-24 text-center space-y-4 opacity-40 animate-in fade-in duration-500">
        <Cpu className="w-16 h-16 mx-auto text-slate-950" />
        <div className="space-y-1">
          <p className="text-sm font-bold tracking-tight text-slate-950">Unit Not Found</p>
          <p className="text-[10px] font-medium text-slate-950 uppercase tracking-widest">Adjust Search Parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32">
      {filteredUnits.map((unit) => (
        <Link key={unit.id} href={`/tools/${unit.id}`}>
          <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 hover:bg-white/60 transition-all duration-500 group cursor-pointer overflow-hidden border-2 relative backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            
            <CardContent className="p-6 flex flex-col h-full text-slate-950">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-black/5">
                  <unit.icon className="w-6 h-6 text-slate-950 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge className={cn(
                    "text-[8px] font-black h-4 px-1.5 border-none tracking-widest uppercase",
                    unit.complexity === 'Wasm' ? "bg-emerald-500/10 text-emerald-600" :
                    unit.complexity === 'Ai' ? "bg-primary/10 text-primary" :
                    "bg-orange-500/10 text-orange-600"
                  )}>
                    {unit.complexity}
                  </Badge>
                  <span className="text-[9px] font-bold text-slate-900/40 uppercase">{unit.tag}</span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-sm font-black tracking-tighter group-hover:text-primary transition-colors leading-none">{unit.name}</h3>
                <p className="text-[10px] leading-relaxed font-medium tracking-wide line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {unit.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-slate-900/60 uppercase">System Active</span>
                </div>
                <span className="text-[8px] font-bold text-slate-900/40 uppercase">{unit.cat}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
