
"use client";

import { useMemo } from 'react';
import { 
  FileText, 
  ImageIcon, 
  Video, 
  Music, 
  Layers, 
  Wand2, 
  Scissors, 
  Zap, 
  Scan, 
  Repeat, 
  Table, 
  Type, 
  Box, 
  Code2, 
  HardDrive, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Monitor,
  Presentation,
  BookOpen,
  FileJson,
  FileCode,
  ShieldAlert,
  Merge,
  RotateCw,
  Lock,
  Unlock,
  Layout,
  FileSearch,
  Languages,
  Printer,
  Hammer,
  Hash,
  Crop,
  Camera
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ServiceUnit = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  tag: string;
  cat: 'Document' | 'Image' | 'Video' | 'Audio' | 'Data' | 'Archive';
  complexity: 'WASM' | 'SMART' | '4K' | 'AI';
};

const ALL_UNITS: ServiceUnit[] = [
  // --- PDF MANIPULATION & TOOLS ---
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple documents into one in any order.', icon: Merge, tag: 'CORE', cat: 'Document', complexity: 'WASM' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Separate pages or extract entire sets into new files.', icon: Scissors, tag: 'CORE', cat: 'Document', complexity: 'WASM' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce file size while maximizing visual quality.', icon: Zap, tag: 'SMART', cat: 'Document', complexity: 'SMART' },
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Add text, images, shapes, and annotations directly.', icon: Wand2, tag: 'MASTER', cat: 'Document', complexity: 'WASM' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Securely sign or request electronic signatures.', icon: Type, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  { id: 'watermark-pdf', name: 'Watermark PDF', desc: 'Stamp images or text with opacity control.', icon: Printer, tag: 'BRAND', cat: 'Document', complexity: 'SMART' },
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Bulk rotate pages to any orientation.', icon: RotateCw, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Delete, add, or sort pages within your document.', icon: Layout, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'AES-256 encryption for sensitive documents.', icon: Lock, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove password security and permissions.', icon: Unlock, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'ISO archival standard for long-term storage.', icon: ShieldCheck, tag: 'ISO', cat: 'Document', complexity: 'SMART' },
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Recover data from corrupted or damaged files.', icon: Hammer, tag: 'TOOL', cat: 'Document', complexity: 'SMART' },
  { id: 'page-numbers', name: 'Page Numbers', desc: 'Add customizable numbering to all pages.', icon: Hash, tag: 'TOOL', cat: 'Document', complexity: 'SMART' },
  { id: 'scan-pdf', name: 'Scan to PDF', desc: 'Capture documents via mobile camera to browser.', icon: Camera, tag: 'MOBILE', cat: 'Document', complexity: 'SMART' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Make scanned documents searchable and selectable.', icon: Scan, tag: 'AI', cat: 'Document', complexity: 'AI' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Side-by-side version change detection.', icon: FileSearch, tag: 'PRO', cat: 'Document', complexity: 'AI' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently remove sensitive information.', icon: ShieldAlert, tag: 'SECURE', cat: 'Document', complexity: 'AI' },
  { id: 'crop-pdf', name: 'Crop PDF', desc: 'Adjust margins or select specific print areas.', icon: Crop, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'AI-powered translation preserving layout.', icon: Languages, tag: 'AI', cat: 'Document', complexity: 'AI' },

  // --- OFFICE TO PDF ---
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert DOCX/DOC to high-fidelity PDF.', icon: FileText, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'pptx-pdf', name: 'PowerPoint to PDF', desc: 'Slide-accurate presentation export.', icon: Presentation, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Grid-perfect spreadsheet rendering.', icon: Table, tag: 'OOXML', cat: 'Document', complexity: 'SMART' },
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Convert and merge images into PDF docs.', icon: ImageIcon, tag: 'IMAGE', cat: 'Document', complexity: 'WASM' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Convert web pages to professional documents.', icon: Code2, tag: 'WEB', cat: 'Document', complexity: 'SMART' },

  // --- PDF TO OFFICE ---
  { id: 'pdf-word', name: 'PDF to Word Master', desc: 'Preserves complex layout reconstruction.', icon: FileText, tag: 'DOCX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel Grid', desc: 'Smart table boundary detection.', icon: Table, tag: 'XLSX', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-ppt', name: 'PDF to PowerPoint', desc: 'Slide-accurate vector reconstruction.', icon: Presentation, tag: 'PPTX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-jpg', name: 'PDF to JPEG Grid', desc: 'Compressed proof-quality pages.', icon: ImageIcon, tag: 'JPG', cat: 'Document', complexity: 'WASM' },

  // --- MEDIA & DATA UNITS ---
  { id: 'img-webp', name: 'Image to WebP', desc: 'Lossless web node optimization.', icon: ImageIcon, tag: 'WEBP', cat: 'Image', complexity: 'WASM' },
  { id: 'bg-remove', name: 'Smart BG Removal', desc: 'Automated subject isolation.', icon: Wand2, tag: 'PNG', cat: 'Image', complexity: 'AI' },
  { id: 'vid-compress', name: 'Video Compressor', desc: 'Crush size without frame loss.', icon: Monitor, tag: 'MP4', cat: 'Video', complexity: '4K' },
  { id: 'csv-json', name: 'Data Transformer', desc: 'Schema-mapped data conversion.', icon: Code2, tag: 'JSON', cat: 'Data', complexity: 'WASM' },
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
        <Cpu className="w-16 h-16 mx-auto text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-widest">No Unit Found</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Re-calibrate search parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {filteredUnits.map((unit) => (
        <Link key={unit.id} href={`/junction/units?cat=${unit.cat}&unit=${unit.id}`}>
          <Card className="h-full bg-white/[0.02] border-white/5 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-500 group cursor-pointer overflow-hidden border-2 relative">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                  <unit.icon className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge className={cn(
                    "text-[7px] font-black h-4 px-1.5 border-none tracking-widest",
                    unit.complexity === 'WASM' ? "bg-emerald-500/10 text-emerald-500" :
                    unit.complexity === 'AI' ? "bg-primary/10 text-primary" :
                    "bg-orange-500/10 text-orange-500"
                  )}>
                    {unit.complexity}
                  </Badge>
                  <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{unit.tag}</span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-xs font-black uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{unit.name}</h3>
                <p className="text-[9px] text-muted-foreground leading-relaxed font-bold uppercase tracking-wider line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {unit.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">READY</span>
                </div>
                <span className="text-[7px] font-bold text-white/10 uppercase tracking-widest">{unit.cat}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
