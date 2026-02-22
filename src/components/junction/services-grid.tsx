
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
  Monitor
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
  { id: 'pdf-word', name: 'PDF to Word Master', desc: 'Preserves complex layout reconstruction.', icon: FileText, tag: 'DOCX', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-excel', name: 'PDF to Excel Grid', desc: 'Smart table boundary detection.', icon: Table, tag: 'XLSX', cat: 'Document', complexity: 'SMART' },
  { id: 'word-pdf', name: 'Word to PDF Pro', desc: 'High-fidelity OOXML transformation.', icon: FileText, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
  { id: 'pdf-merge', name: 'PDF Unit Merger', desc: 'Combine multiple document streams.', icon: Layers, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
  { id: 'img-webp', name: 'Image to WebP Node', desc: 'Lossless web node optimization.', icon: ImageIcon, tag: 'WEBP', cat: 'Image', complexity: 'WASM' },
  { id: 'bg-remove', name: 'Smart BG Removal', desc: 'Automated subject isolation.', icon: Wand2, tag: 'PNG', cat: 'Image', complexity: 'AI' },
  { id: 'img-upscale', name: 'Smart Upscaler', desc: 'Super-resolution pixel mapping.', icon: Zap, tag: '4K', cat: 'Image', complexity: 'AI' },
  { id: 'heic-jpg', name: 'HEIC Developer', desc: 'Mobile-to-web format bridge.', icon: ImageIcon, tag: 'JPG', cat: 'Image', complexity: 'WASM' },
  { id: 'vid-gif', name: 'Video to Smart GIF', desc: 'Frame-accurate temporal mapping.', icon: Video, tag: 'GIF', cat: 'Video', complexity: 'WASM' },
  { id: 'vid-compress', name: 'Video Compressor', desc: 'Crush size without frame loss.', icon: Monitor, tag: 'MP4', cat: 'Video', complexity: '4K' },
  { id: 'vid-audio', name: 'Audio Extractor', desc: 'Extract high-bitrate master tracks.', icon: Music, tag: 'MP3', cat: 'Video', complexity: 'WASM' },
  { id: 'aud-trim', name: 'Audio Surgery', desc: 'Precise waveform manipulation.', icon: Scissors, tag: 'WAV', cat: 'Audio', complexity: 'WASM' },
  { id: 'aud-norm', name: 'Loudness Engine', desc: 'LUFS broadcast normalization.', icon: Zap, tag: 'MP3', cat: 'Audio', complexity: 'SMART' },
  { id: 'ocr-layer', name: 'Smart OCR Engine', desc: 'Image to searchable text layer.', icon: Scan, tag: 'PDF', cat: 'Document', complexity: 'AI' },
  { id: 'csv-json', name: 'Data Transformer', desc: 'Schema-mapped data conversion.', icon: Code2, tag: 'JSON', cat: 'Data', complexity: 'WASM' },
  { id: 'zip-7z', name: 'Archive Hub', desc: 'High-ratio LZMA2 compression.', icon: Box, tag: '7Z', cat: 'Archive', complexity: 'WASM' },
  { id: 'raw-dev', name: 'RAW Developer', desc: 'Professional camera development.', icon: ImageIcon, tag: 'JPG', cat: 'Image', complexity: '4K' },
  { id: 'html-pdf', name: 'HTML to PDF Node', desc: 'Web-to-document rendering.', icon: Code2, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
  { id: 'cad-vector', name: 'CAD to SVG Unit', desc: 'DXF to vector path conversion.', icon: Layers, tag: 'SVG', cat: 'Image', complexity: 'SMART' },
  { id: 'md-pdf', name: 'Markdown Master', desc: 'Clean PDF rendering from MD.', icon: Type, tag: 'PDF', cat: 'Document', complexity: 'WASM' },
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
