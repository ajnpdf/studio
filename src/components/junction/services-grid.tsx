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
  Signature,
  EyeOff,
  GitCompare,
  Globe
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
  complexity: 'WASM' | 'SMART' | 'AI';
};

/**
 * AJN Service Units - Professional PDF Matrix
 * High-fidelity transformation units following Proper Case standards.
 */
export const ALL_UNITS: ServiceUnit[] = [
  // --- ORGANIZE PDF ---
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple files into a single, mastered PDF document.', icon: Layout, tag: 'Merge', cat: 'Organize', complexity: 'WASM' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Separate PDF pages into individual files or extract a specific range.', icon: Scissors, tag: 'Split', cat: 'Organize', complexity: 'WASM' },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Prune unwanted pages from your document with pinpoint accuracy.', icon: Trash2, tag: 'Prune', cat: 'Organize', complexity: 'WASM' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Isolate and export specific pages into a new high-fidelity buffer.', icon: Copy, tag: 'Extract', cat: 'Organize', complexity: 'WASM' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Rearrange, rotate, and manage the hierarchical structure of your PDF.', icon: Layout, tag: 'Structure', cat: 'Organize', complexity: 'SMART' },

  // --- OPTIMIZE PDF ---
  { id: 'scan-to-pdf', name: 'Scan to PDF', desc: 'Convert physical scans and photos into professional vector PDFs.', icon: Scan, tag: 'Capture', cat: 'Optimize', complexity: 'SMART' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce file size while preserving high-fidelity visual assets.', icon: Shrink, tag: 'Optimize', cat: 'Optimize', complexity: 'WASM' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Rebuild damaged cross-reference tables and recover corrupted streams.', icon: Wrench, tag: 'Recovery', cat: 'Optimize', complexity: 'SMART' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Apply neural character recognition to unlock editable text layers.', icon: Search, tag: 'Vision', cat: 'Optimize', complexity: 'AI' },

  // --- CONVERT TO PDF ---
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Transform raster images into standardized, printable documents.', icon: ImageIcon, tag: 'Image', cat: 'Convert', complexity: 'WASM' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert Word documents into professional, layout-locked PDFs.', icon: FileText, tag: 'OOXML', cat: 'Convert', complexity: 'WASM' },
  { id: 'pptx-pdf', name: 'PowerPoint to PDF', desc: 'Transform slide decks into highly-compatible presentation PDFs.', icon: Presentation, tag: 'OOXML', cat: 'Convert', complexity: 'WASM' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map spreadsheet grids into clean, printable tabular layouts.', icon: Table, tag: 'OOXML', cat: 'Convert', complexity: 'SMART' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Render web pages directly into optimized vector PDF buffers.', icon: Code2, tag: 'Web', cat: 'Convert', complexity: 'SMART' },

  // --- CONVERT FROM PDF ---
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export document pages as high-resolution raster images.', icon: ImageIcon, tag: 'JPG', cat: 'Convert', complexity: 'WASM' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Deconstruct PDF layers into editable document structures.', icon: FileText, tag: 'DOCX', cat: 'Convert', complexity: 'WASM' },
  { id: 'pdf-pptx', name: 'PDF to PowerPoint', desc: 'Rebuild PDF pages as high-fidelity presentation slides.', icon: Presentation, tag: 'PPTX', cat: 'Convert', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Extract grid data from documents into clean spreadsheet files.', icon: Table, tag: 'XLSX', cat: 'Convert', complexity: 'SMART' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'Standardize documents for ISO-compliant long-term archiving.', icon: ShieldCheck, tag: 'ISO', cat: 'Convert', complexity: 'SMART' },

  // --- EDIT PDF ---
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Apply geometric rotation to individual pages or entire documents.', icon: RotateCw, tag: 'Geometry', cat: 'Edit', complexity: 'WASM' },
  { id: 'page-numbers', name: 'Add Page Numbers', desc: 'Inject dynamic page indices into the document header or footer.', icon: Hash, tag: 'Stamping', cat: 'Edit', complexity: 'SMART' },
  { id: 'watermark-pdf', name: 'Add Watermark', desc: 'Apply custom text or image overlays for brand protection.', icon: Type, tag: 'Brand', cat: 'Edit', complexity: 'SMART' },
  { id: 'crop-pdf', name: 'Crop PDF', desc: 'Adjust the visible canvas by adjusting the neural crop box.', icon: Crop, tag: 'Canvas', cat: 'Edit', complexity: 'WASM' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Directly modify text, images, and shapes within the PDF layer.', icon: Edit3, tag: 'Mastery', cat: 'Edit', complexity: 'SMART' },

  // --- SECURITY ---
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove restrictions and passwords from secured document streams.', icon: Unlock, tag: 'Access', cat: 'Security', complexity: 'SMART' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Apply AES-256 cryptographic seals to prevent unauthorized access.', icon: Lock, tag: 'Seal', cat: 'Security', complexity: 'SMART' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Apply professional digital signatures with verified audit trails.', icon: Signature, tag: 'Legal', cat: 'Security', complexity: 'SMART' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently purge sensitive data from the visual and binary layers.', icon: EyeOff, tag: 'Privacy', cat: 'Security', complexity: 'AI' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Analyze two versions of a document to detect semantic changes.', icon: GitCompare, tag: 'Audit', cat: 'Security', complexity: 'AI' },

  // --- INTELLIGENCE ---
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Translate document content into 50+ languages via neural mapping.', icon: Globe, tag: 'Intelligence', cat: 'Intelligence', complexity: 'AI' },
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
          <p className="text-[10px] font-medium text-slate-950 uppercase tracking-widest">Adjust search parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32">
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
                    unit.complexity === 'WASM' ? "bg-emerald-500/10 text-emerald-600" :
                    unit.complexity === 'AI' ? "bg-primary/10 text-primary" :
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
                  <span className="text-[8px] font-bold text-slate-900/60 uppercase">Active Node</span>
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
