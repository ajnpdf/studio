
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
  ShieldAlert
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
  // PDF CORE UNITS (20+)
  { id: 'pdf-word', name: 'PDF to Word Master', desc: 'Preserves complex layout reconstruction.', icon: FileText, tag: 'DOCX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel Grid', desc: 'Smart table boundary detection.', icon: Table, tag: 'XLSX', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-ppt', name: 'PDF to PowerPoint', desc: 'Slide-accurate vector reconstruction.', icon: Presentation, tag: 'PPTX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-epub', name: 'PDF to EPUB Reader', desc: 'Fluid layout ebook synthesis.', icon: BookOpen, tag: 'EPUB', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-json', name: 'PDF to Data JSON', desc: 'Semantic text-to-object mapping.', icon: FileJson, tag: 'JSON', cat: 'Data', complexity: 'AI' },
  { id: 'pdf-xml', name: 'PDF to Structural XML', desc: 'Tag-based content hierarchy.', icon: FileCode, tag: 'XML', cat: 'Data', complexity: 'SMART' },
  { id: 'pdf-html', name: 'PDF to HTML Node', desc: 'Responsive web-ready rendering.', icon: Code2, tag: 'HTML', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-pdfa', name: 'PDF to Archival A-1b', desc: 'ISO-standard long-term preservation.', icon: ShieldCheck, tag: 'PDF/A', cat: 'Document', complexity: 'SMART' },
  { id: 'pdf-md', name: 'PDF to Markdown', desc: 'Clean MD formatting for developers.', icon: Type, tag: 'MD', cat: 'Document', complexity: 'AI' },
  { id: 'pdf-rtf', name: 'PDF to RTF Layer', desc: 'Cross-platform legacy interop.', icon: FileText, tag: 'RTF', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-txt', name: 'PDF to Pure Text', desc: 'High-speed OCR character extraction.', icon: Type, tag: 'TXT', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-svg', name: 'PDF to Vector SVG', desc: 'Extract vector paths for design.', icon: Layers, tag: 'SVG', cat: 'Image', complexity: 'SMART' },
  { id: 'pdf-tiff', name: 'PDF to Multi-TIFF', desc: 'Print-optimized raster output.', icon: ImageIcon, tag: 'TIFF', cat: 'Image', complexity: 'WASM' },
  { id: 'pdf-png', name: 'PDF to PNG Frames', desc: 'High-res alpha-preserved images.', icon: ImageIcon, tag: 'PNG', cat: 'Image', complexity: 'WASM' },
  { id: 'pdf-jpg', name: 'PDF to JPEG Grid', desc: 'Compressed proof-quality pages.', icon: ImageIcon, tag: 'JPG', cat: 'Image', complexity: 'WASM' },
  { id: 'pdf-merge', name: 'PDF Unit Merger', desc: 'Combine multiple document streams.', icon: Layers, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-split', name: 'PDF Page Splitter', desc: 'Deconstruct document into segments.', icon: Scissors, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-redact', name: 'Smart Redactor', desc: 'Neural PII detection and masking.', icon: ShieldAlert, tag: 'SECURE', cat: 'Document', complexity: 'AI' },
  { id: 'ocr-layer', name: 'Smart OCR Engine', desc: 'Image to searchable text layer.', icon: Scan, tag: 'PDF', cat: 'Document', complexity: 'AI' },
  { id: 'word-pdf', name: 'Word to PDF Pro', desc: 'High-fidelity OOXML transformation.', icon: FileText, tag: 'PDF', cat: 'Document', complexity: 'WASM' },

  // IMAGE & MEDIA UNITS
  { id: 'img-webp', name: 'Image to WebP Node', desc: 'Lossless web node optimization.', icon: ImageIcon, tag: 'WEBP', cat: 'Image', complexity: 'WASM' },
  { id: 'bg-remove', name: 'Smart BG Removal', desc: 'Automated subject isolation.', icon: Wand2, tag: 'PNG', cat: 'Image', complexity: 'AI' },
  { id: 'img-upscale', name: 'Smart Upscaler', desc: 'Super-resolution pixel mapping.', icon: Zap, tag: '4K', cat: 'Image', complexity: 'AI' },
  { id: 'heic-jpg', name: 'HEIC Developer', desc: 'Mobile-to-web format bridge.', icon: ImageIcon, tag: 'JPG', cat: 'Image', complexity: 'WASM' },
  { id: 'raw-dev', name: 'RAW Developer', desc: 'Professional camera development.', icon: ImageIcon, tag: 'JPG', cat: 'Image', complexity: '4K' },
  { id: 'vid-gif', name: 'Video to Smart GIF', desc: 'Frame-accurate temporal mapping.', icon: Video, tag: 'GIF', cat: 'Video', complexity: 'WASM' },
  { id: 'vid-compress', name: 'Video Compressor', desc: 'Crush size without frame loss.', icon: Monitor, tag: 'MP4', cat: 'Video', complexity: '4K' },
  { id: 'vid-audio', name: 'Audio Extractor', desc: 'Extract high-bitrate master tracks.', icon: Music, tag: 'MP3', cat: 'Video', complexity: 'WASM' },
  { id: 'aud-trim', name: 'Audio Surgery', desc: 'Precise waveform manipulation.', icon: Scissors, tag: 'WAV', cat: 'Audio', complexity: 'WASM' },
  { id: 'aud-norm', name: 'Loudness Engine', desc: 'LUFS broadcast normalization.', icon: Zap, tag: 'MP3', cat: 'Audio', complexity: 'SMART' },
  { id: 'csv-json', name: 'Data Transformer', desc: 'Schema-mapped data conversion.', icon: Code2, tag: 'JSON', cat: 'Data', complexity: 'WASM' },
  { id: 'zip-7z', name: 'Archive Hub', desc: 'High-ratio LZMA2 compression.', icon: Box, tag: '7Z', cat: 'Archive', complexity: 'WASM' },
  { id: 'cad-vector', name: 'CAD to SVG Unit', desc: 'DXF to vector path conversion.', icon: Layers, tag: 'SVG', cat: 'Image', complexity: 'SMART' },
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
        <Link key={unit.id} href={`/junction/units?cat=${unit.cat}`}>
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
