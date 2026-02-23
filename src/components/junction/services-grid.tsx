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
  Table, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Presentation,
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
  Camera,
  Trash2,
  ExternalLink,
  PenTool,
  ShieldAlert
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
  cat: 'Document' | 'Image' | 'Video' | 'Audio' | 'Data' | 'Archive';
  complexity: 'WASM' | 'SMART' | '4K' | 'AI';
};

export const ALL_UNITS: ServiceUnit[] = [
  // --- CORE PDF MANIPULATION ---
  { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: Merge, tag: 'CORE', cat: 'Document', complexity: 'WASM' },
  { id: 'split-pdf', name: 'Split PDF', desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: Scissors, tag: 'CORE', cat: 'Document', complexity: 'WASM' },
  { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.', icon: Zap, tag: 'SMART', cat: 'Document', complexity: 'SMART' },
  { id: 'organize-pdf', name: 'Organize PDF', desc: 'Sort pages of your PDF file however you like. Delete or add PDF pages.', icon: Layout, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'remove-pages', name: 'Remove Pages', desc: 'Delete unwanted pages from your document instantly.', icon: Trash2, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'extract-pages', name: 'Extract Pages', desc: 'Pick specific pages and save them as a separate PDF.', icon: ExternalLink, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  
  // --- CONVERT TO PDF ---
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: FileText, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'pptx-pdf', name: 'PowerPoint to PDF', desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', icon: Presentation, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', icon: Table, tag: 'OOXML', cat: 'Document', complexity: 'SMART' },
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: ImageIcon, tag: 'IMAGE', cat: 'Document', complexity: 'WASM' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Convert webpages in HTML to PDF with a single click.', icon: Code2, tag: 'WEB', cat: 'Document', complexity: 'SMART' },

  // --- CONVERT FROM PDF ---
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', icon: FileText, tag: 'DOCX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Pull data straight from PDFs into Excel spreadsheets.', icon: Table, tag: 'XLSX', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-pptx', name: 'PDF to PowerPoint', desc: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', icon: Presentation, tag: 'PPTX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: ImageIcon, tag: 'JPG', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'ISO-standardized version for long-term archiving.', icon: ShieldCheck, tag: 'ISO', cat: 'Document', complexity: 'SMART' },

  // --- EDIT & ANNOTATE ---
  { id: 'edit-pdf', name: 'Edit PDF', desc: 'Add text, images, shapes or freehand annotations to a PDF document.', icon: Wand2, tag: 'MASTER', cat: 'Document', complexity: 'WASM' },
  { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them. Even multiple PDFs at once.', icon: RotateCw, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },
  { id: 'page-numbers', name: 'Page Numbers', desc: 'Add page numbers into PDFs with ease.', icon: Hash, tag: 'TOOL', cat: 'Document', complexity: 'SMART' },
  { id: 'watermark-pdf', name: 'Add Watermark', desc: 'Stamp an image or text over your PDF in seconds.', icon: Printer, tag: 'BRAND', cat: 'Document', complexity: 'SMART' },
  { id: 'crop-pdf', name: 'Crop PDF', desc: 'Crop margins of PDF documents or select specific areas for one or all pages.', icon: Crop, tag: 'TOOL', cat: 'Document', complexity: 'WASM' },

  // --- SECURITY & TRUST ---
  { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove PDF password security and permissions freedom.', icon: Unlock, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  { id: 'protect-pdf', name: 'Protect PDF', desc: 'Protect PDF files with a password and AES-256 encryption.', icon: Lock, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  { id: 'sign-pdf', name: 'Sign PDF', desc: 'Sign yourself or request electronic signatures from others.', icon: PenTool, tag: 'SECURE', cat: 'Document', complexity: 'WASM' },
  
  // --- INTELLIGENCE & REPAIR ---
  { id: 'repair-pdf', name: 'Repair PDF', desc: 'Repair a damaged PDF and recover data from corrupt PDF files.', icon: Hammer, tag: 'TOOL', cat: 'Document', complexity: 'SMART' },
  { id: 'ocr-pdf', name: 'OCR PDF', desc: 'Easily convert scanned PDF into searchable and selectable documents.', icon: Scan, tag: 'AI', cat: 'Document', complexity: 'AI' },
  { id: 'compare-pdf', name: 'Compare PDF', desc: 'Side-by-side document comparison to spot changes.', icon: FileSearch, tag: 'PRO', cat: 'Document', complexity: 'AI' },
  { id: 'redact-pdf', name: 'Redact PDF', desc: 'Permanently remove sensitive information from a PDF.', icon: ShieldAlert, tag: 'SECURE', cat: 'Document', complexity: 'AI' },
  { id: 'translate-pdf', name: 'Translate PDF', desc: 'Easily translate PDF files powered by AI while keeping layout intact.', icon: Languages, tag: 'AI', cat: 'Document', complexity: 'AI' },
  { id: 'scan-pdf', name: 'Scan to PDF', desc: 'Capture document scans from your mobile device directly to your browser.', icon: Camera, tag: 'MOBILE', cat: 'Document', complexity: 'SMART' },
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
        <Link key={unit.id} href={`/tools/${unit.id}`}>
          <Card className="h-full bg-white/40 border-black/5 hover:border-primary/40 hover:bg-white/60 transition-all duration-500 group cursor-pointer overflow-hidden border-2 relative backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                  <unit.icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge className={cn(
                    "text-[7px] font-black h-4 px-1.5 border-none tracking-widest",
                    unit.complexity === 'WASM' ? "bg-emerald-500/10 text-emerald-600" :
                    unit.complexity === 'AI' ? "bg-primary/10 text-primary" :
                    "bg-orange-500/10 text-orange-600"
                  )}>
                    {unit.complexity}
                  </Badge>
                  <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{unit.tag}</span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-xs font-black uppercase tracking-tighter text-slate-800 group-hover:text-primary transition-colors">{unit.name}</h3>
                <p className="text-[9px] text-muted-foreground leading-relaxed font-bold uppercase tracking-wider line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {unit.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">READY</span>
                </div>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{unit.cat}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
