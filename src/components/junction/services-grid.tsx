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
  Cpu
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

/**
 * AJN Service Units - Professional PDF Focus
 * Curated list of high-fidelity PDF transformation units.
 */
export const ALL_UNITS: ServiceUnit[] = [
  // --- CONVERT TO PDF ---
  { id: 'jpg-pdf', name: 'JPG to PDF', desc: 'Convert raster images to PDF with intelligent margin calibration.', icon: ImageIcon, tag: 'Image', cat: 'Document', complexity: 'WASM' },
  { id: 'word-pdf', name: 'Word to PDF', desc: 'Convert DOC and DOCX files into professional A4 PDF documents.', icon: FileText, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'pptx-pdf', name: 'PowerPoint to PDF', desc: 'Transform slide decks into highly-compatible read-only PDF format.', icon: Presentation, tag: 'OOXML', cat: 'Document', complexity: 'WASM' },
  { id: 'excel-pdf', name: 'Excel to PDF', desc: 'Map spreadsheet grids into clean, printable PDF layouts.', icon: Table, tag: 'OOXML', cat: 'Document', complexity: 'SMART' },
  { id: 'html-pdf', name: 'HTML to PDF', desc: 'Render web pages and HTML files directly into vector PDF buffers.', icon: Code2, tag: 'Web', cat: 'Document', complexity: 'SMART' },

  // --- CONVERT FROM PDF ---
  { id: 'pdf-jpg', name: 'PDF to JPG', desc: 'Export PDF pages as high-resolution raster images.', icon: ImageIcon, tag: 'JPG', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-word', name: 'PDF to Word', desc: 'Deconstruct PDF layers into editable DOCX document structures.', icon: FileText, tag: 'DOCX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-pptx', name: 'PDF to PowerPoint', desc: 'Rebuild PDF pages as high-fidelity presentation slides.', icon: Presentation, tag: 'PPTX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel', desc: 'Detect and extract table data from PDF files into XLSX grids.', icon: Table, tag: 'XLSX', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-pdfa', name: 'PDF to PDF/A', desc: 'Standardize documents for ISO-compliant long-term archiving.', icon: ShieldCheck, tag: 'ISO', cat: 'Document', complexity: 'SMART' },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
