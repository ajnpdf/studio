
"use client";

import { useState } from 'react';
import { 
  Repeat, 
  Box, 
  FileText, 
  FileCode, 
  Database, 
  Presentation, 
  ImageIcon, 
  Video, 
  Music, 
  BrainCircuit, 
  Scan, 
  Layers, 
  Terminal, 
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Wand2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ToolEntry = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  href: string;
  tags: string[];
  status?: string;
  isNew?: boolean;
};

type ToolCategory = {
  title: string;
  description: string;
  icon: any;
  tools: ToolEntry[];
};

const categories: ToolCategory[] = [
  {
    title: "Universal Core",
    description: "High-concurrency batch processing and format routing.",
    icon: Zap,
    tools: [
      { id: 'converter', name: 'Real-time Converter', desc: 'Universal engine for 300+ formats.', icon: Repeat, href: '/dashboard/convert', tags: ['Core', 'WASM'] },
      { id: 'batch', name: 'Batch Center', desc: 'Process hundreds of files in parallel.', icon: Box, href: '/dashboard/tools/batch', tags: ['Automation'] },
    ]
  },
  {
    title: "Document Excellence",
    description: "Professional-grade editing, signing, and normalization.",
    icon: FileText,
    tools: [
      { id: 'pdf', name: 'PDF Master', desc: 'Edit, sign, and redact documents.', icon: FileText, href: '/dashboard/pdf-editor', tags: ['Editor', 'E-Sign'] },
      { id: 'word', name: 'Word Modernizer', desc: 'DOC/DOCX recovery and conversion.', icon: FileCode, href: '/dashboard/convert?cat=Document', tags: ['Word'] },
      { id: 'excel', name: 'Spreadsheet Engine', desc: 'Precision XLSX/CSV data logic.', icon: Database, href: '/dashboard/convert?cat=Document', tags: ['Data'] },
      { id: 'ppt', name: 'Presentation Suite', desc: 'Slide-to-Canvas high-res rendering.', icon: Presentation, href: '/dashboard/convert?cat=Document', tags: ['Slides'] },
    ]
  },
  {
    title: "High-Fidelity Media",
    description: "Hardware-accelerated processing for creative assets.",
    icon: Video,
    tools: [
      { id: 'image', name: 'Image Master', desc: 'Optimization, RAW, and AI upscaling.', icon: ImageIcon, href: '/dashboard/image-editor', tags: ['RAW', 'AI'] },
      { id: 'video', name: 'Video Lab', desc: 'Professional FFmpeg transcoding.', icon: Video, href: '/dashboard/tools/video', tags: ['FFmpeg', '4K'] },
      { id: 'audio', name: 'Audio Studio', desc: 'Bitrate surgery and waveform trim.', icon: Music, href: '/dashboard/tools/audio', tags: ['WAV', 'MP3'] },
    ]
  },
  {
    title: "Intelligence Layer",
    description: "Neural models for content understanding and extraction.",
    icon: BrainCircuit,
    tools: [
      { id: 'ai-intel', name: 'AI File Intel', desc: 'Semantic search and categorization.', icon: BrainCircuit, href: '/dashboard/tools/ai', tags: ['Gemini', 'LLM'] },
      { id: 'ocr', name: 'Neural OCR', desc: 'Scanned image to searchable PDF.', icon: Scan, href: '/dashboard/tools/ai', tags: ['Vision'] },
      { id: 'transcribe', name: 'Speech Transcriber', desc: 'Audio to timestamped text logs.', icon: Wand2, href: '/dashboard/tools/ai', tags: ['Whisper'] },
    ]
  },
  {
    title: "Technical & Data",
    description: "Specialized engineering and code transformations.",
    icon: Terminal,
    tools: [
      { id: 'cad', name: 'Technical CAD', desc: 'DXF/STL/OBJ blueprint processing.', icon: Layers, href: '/dashboard/convert?cat=3D/CAD', tags: ['Engineering'] },
      { id: 'code', name: 'Code Interop', desc: 'JSON/XML/YAML/SQL schema mapping.', icon: Terminal, href: '/dashboard/convert?cat=Code', tags: ['DevOps'] },
    ]
  }
];

export function ToolsDirectory() {
  const [search, setSearch] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <header className="h-20 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Cpu className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Service Directory</h1>
              <p className="text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase mt-1">AJN Neural Junction Hub</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 mx-4 hidden lg:block" />

          <div className="relative max-w-xl w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input 
              placeholder="Search 300+ services (e.g. 'HEIC', 'OCR', 'SQL')..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-11 bg-white/5 border-white/10 text-xs font-bold focus:ring-primary/50 rounded-2xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Node Verified</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto p-10 space-y-16 pb-32">
          {filteredCategories.length === 0 ? (
            <div className="py-32 text-center space-y-6 opacity-40">
              <Search className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-sm font-black uppercase tracking-widest">No matching tools found in our junction.</p>
            </div>
          ) : (
            filteredCategories.map((cat, idx) => (
              <section key={idx} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                      <cat.icon className="w-6 h-6 text-white/60" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tighter">{cat.title}</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cat.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="h-6 px-3 border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em]">
                    {cat.tools.length} SERVICES
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cat.tools.map((tool) => (
                    <Link key={tool.id} href={tool.href}>
                      <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/40 transition-all group h-full cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <CardContent className="p-8 flex flex-col h-full space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                              <tool.icon className="w-7 h-7 text-white/80 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end max-w-[100px]">
                              {tool.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-[7px] font-black uppercase tracking-tighter text-muted-foreground border border-white/5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2 flex-1">
                            <h4 className="font-black text-sm uppercase tracking-tighter group-hover:text-primary transition-colors">{tool.name}</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-wider line-clamp-2">
                              {tool.desc}
                            </p>
                          </div>

                          <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">NODE STABLE</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      <footer className="h-16 border-t border-white/5 bg-background/60 backdrop-blur-xl flex items-center justify-center px-8 shrink-0 z-20">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          All tools are processed 100% locally in your session sandbox
        </p>
      </footer>
    </div>
  );
}
