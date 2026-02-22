"use client";

import { useState } from 'react';
import { 
  Repeat, 
  Box, 
  FileText, 
  FileCode, 
  ImageIcon, 
  Video, 
  Music, 
  Scan, 
  Layers, 
  Terminal, 
  Search,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Workflow,
  X,
  Activity,
  Code2,
  Lock,
  Zap,
  Sparkles,
  Database,
  BrainCircuit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type LogicStep = {
  label: string;
  desc: string;
};

type ServiceEntry = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  tags: string[];
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  stack: string;
  logicSteps: LogicStep[];
  outputMime: string;
};

type Sector = {
  id: string;
  title: string;
  description: string;
  icon: any;
  services: ServiceEntry[];
};

const sectors: Sector[] = [
  {
    id: 'core',
    title: "Core Processing",
    description: "Universal format routing and high-concurrency document transformations.",
    icon: Zap,
    services: [
      { 
        id: 'converter', 
        name: 'Universal Converter', 
        desc: 'Real-time transformation for 300+ format combinations.', 
        icon: Repeat, 
        tags: ['Core', 'WASM'],
        complexity: 'MEDIUM',
        stack: 'WebAssembly + Native JS',
        outputMime: 'application/octet-stream',
        logicSteps: [
          { label: "Signature Detection", desc: "Magic byte analysis to verify source encoding structure." },
          { label: "WASM Initialization", desc: "Provisioning isolated WebAssembly worker threads." },
          { label: "Buffer Allocation", desc: "Setting up secure memory segments for local processing." },
          { label: "Stream Execution", desc: "Executing binary transformation via neural routing." }
        ]
      },
      { 
        id: 'word-master', 
        name: 'Word Mastery', 
        desc: 'Advanced DOCX/DOC recovery and modernization.', 
        icon: FileText, 
        tags: ['Office', 'OOXML'],
        complexity: 'HIGH',
        stack: 'mammoth.js + JSZip',
        outputMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        logicSteps: [
          { label: "XML Unpacking", desc: "Extracting document.xml and rels from the OOXML container." },
          { label: "Style Mapping", desc: "Transforming legacy style identifiers to modern AJN themes." },
          { label: "Image Run Processing", desc: "Embedding high-res media components into binary streams." },
          { label: "Package Synthesis", desc: "Finalizing the ZIP-based archive structure." }
        ]
      }
    ]
  },
  {
    id: 'media',
    title: "Media & Vision",
    description: "Professional FFmpeg-powered audio and video transcode sequences.",
    icon: Video,
    services: [
      { 
        id: 'video-lab', 
        name: 'Video Lab', 
        desc: 'Hardware-accelerated browser-local transcoding.', 
        icon: Video, 
        tags: ['FFmpeg', '4K'],
        complexity: 'VERY HIGH',
        stack: 'FFmpeg.wasm (SharedArrayBuffer)',
        outputMime: 'video/mp4',
        logicSteps: [
          { label: "VASM Mount", desc: "Loading the 31MB core into the browser's virtual filesystem." },
          { label: "Codec Selection", desc: "Mapping requested settings to libx264 or libvpx parameters." },
          { label: "Frame Recoding", desc: "Executing the parallel bitstream transcode sequence." },
          { label: "Container Muxing", desc: "Wrapping the processed tracks into the target container." }
        ]
      },
      { 
        id: 'image-optimizer', 
        name: 'Image Mastery', 
        desc: 'Neural optimization and RAW camera development.', 
        icon: ImageIcon, 
        tags: ['WASM', 'RAW'],
        complexity: 'HIGH',
        stack: 'libheif + dcraw.wasm',
        outputMime: 'image/webp',
        logicSteps: [
          { label: "Demosaicing", desc: "Applying Bayer pattern reconstruction for RAW sensors." },
          { label: "Alpha Balancing", desc: "Calculating transparency masks for lossless formats." },
          { label: "Quantization", desc: "Applying neural color reduction for file size mastery." },
          { label: "Metadata Stripping", desc: "Wiping EXIF/GPS data for maximum privacy." }
        ]
      }
    ]
  },
  {
    id: 'intelligence',
    title: "Intelligence Layer",
    description: "Advanced OCR, semantic analysis, and legal document intelligence.",
    icon: BrainCircuit,
    services: [
      { 
        id: 'ocr', 
        name: 'Neural OCR', 
        desc: 'Transforming raster scans into searchable, editable text.', 
        icon: Scan, 
        tags: ['Vision', 'AI'],
        complexity: 'VERY HIGH',
        stack: 'Tesseract.js WASM',
        outputMime: 'application/pdf',
        logicSteps: [
          { label: "Adaptive Thresholding", desc: "Binarizing the image to enhance character edges." },
          { label: "Glyph Recognition", desc: "Neural network analysis of identified semantic units." },
          { label: "BBox Computation", desc: "Mapping text to precise spatial PDF coordinates." },
          { label: "Text Layer Injection", desc: "Synthesizing an invisible, searchable layer over the image." }
        ]
      },
      { 
        id: 'redactor', 
        name: 'Neural Redact', 
        desc: 'Surgical removal of text from PDF content streams.', 
        icon: Lock, 
        tags: ['Legal', 'Security'],
        complexity: 'VERY HIGH',
        stack: 'pdf-lib + Custom Content Parser',
        outputMime: 'application/pdf',
        logicSteps: [
          { label: "Stream Decomposition", desc: "Parsing the PDF binary to isolate text operators." },
          { label: "Coordinate Sync", desc: "Linking user-drawn boxes to the underlying content map." },
          { label: "Bitstream Purging", desc: "Physically removing characters from the internal stream." },
          { label: "Compliance Marker", desc: "Adding redaction metadata for audit trail integrity." }
        ]
      }
    ]
  }
];

export function ServicesCatalog() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [inspectingService, setInspectingService] = useState<ServiceEntry | null>(null);

  const filteredSectors = sectors.map(sector => ({
    ...sector,
    services: sector.services.filter(s => 
      (activeTab === 'all' || sector.id === activeTab) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || 
       s.desc.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(sector => sector.services.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-8 pb-32 space-y-20 relative">
      {/* Header */}
      <section className="text-center space-y-6 animate-in fade-in duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          <Activity className="w-3 h-3 animate-pulse" /> Network Infrastructure
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
          Neural Service <br />
          <span className="text-muted-foreground/20">Directory</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-sm leading-relaxed uppercase tracking-widest opacity-60">
          A deep-dive technical catalog of the AJN Junction Network. Inspect internal logic and technology stacks in real-time.
        </p>
      </section>

      {/* Directory Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl sticky top-24 z-40">
        <div className="relative flex-1 max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input 
            placeholder="Search network services..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 bg-black/20 border-white/10 rounded-2xl text-xs font-bold focus:ring-primary/50"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-black/20 border border-white/10 h-12 p-1 rounded-2xl w-full">
            <TabsTrigger value="all" className="text-[9px] font-black uppercase px-6 h-10 rounded-xl">All Sectors</TabsTrigger>
            {sectors.map(s => (
              <TabsTrigger key={s.id} value={s.id} className="text-[9px] font-black uppercase px-6 h-10 rounded-xl">{s.title}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Services Grid */}
      <div className="space-y-24">
        {filteredSectors.map((sector, sIdx) => (
          <div key={sector.id} className="space-y-10 animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${sIdx * 100}ms` }}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <sector.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">{sector.title}</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{sector.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sector.services.map((service) => (
                <Card 
                  key={service.id} 
                  onClick={() => setInspectingService(service)}
                  className="bg-[#0d1225]/40 backdrop-blur-3xl border-white/5 hover:border-primary/40 transition-all group h-full cursor-pointer relative overflow-hidden border-2 rounded-[2.5rem]"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Workflow className="w-5 h-5 text-primary" />
                  </div>
                  
                  <CardContent className="p-10 flex flex-col h-full space-y-8">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                      <service.icon className="w-8 h-8 text-white/80 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-black text-lg uppercase tracking-tighter group-hover:text-primary transition-colors">{service.name}</h4>
                        <Badge className={cn(
                          "text-[8px] font-black h-5 px-2 border-none tracking-widest",
                          service.complexity === 'LOW' ? 'bg-emerald-500/10 text-emerald-500' :
                          service.complexity === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-orange-500/10 text-orange-500'
                        )}>
                          {service.complexity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium uppercase tracking-wider">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Logic: Live</span>
                      </div>
                      <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">Inspect Blueprint →</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logic Inspector Overlay */}
      {inspectingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
          <Card className="w-full max-w-3xl bg-card border-white/10 shadow-2xl relative overflow-hidden rounded-[3rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            
            <button 
              onClick={() => setInspectingService(null)}
              className="absolute top-10 right-10 h-12 w-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-50 border border-white/10"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>

            <CardContent className="p-16 space-y-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-2xl">
                  <inspectingService.icon className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase tracking-[0.3em] mb-2 px-4 h-6">
                    Neural Logic Blueprint
                  </Badge>
                  <h2 className="text-4xl font-black tracking-tighter uppercase">{inspectingService.name}</h2>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60">{inspectingService.stack}</p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" /> Processing Sequence
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {inspectingService.logicSteps.map((step, i) => (
                    <div key={i} className="flex gap-6 group relative">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs z-10 transition-colors group-hover:bg-primary group-hover:text-white">
                          {i + 1}
                        </div>
                        {i < inspectingService.logicSteps.length - 2 && (
                          <div className="w-px flex-1 bg-white/10 my-2" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">{step.label}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Complexity</p>
                  <p className="text-xl font-black text-white">{inspectingService.complexity}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Output Mode</p>
                  <p className="text-xs font-black text-primary truncate uppercase">{inspectingService.outputMime.split('/')[1] || inspectingService.outputMime}</p>
                </div>
                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 space-y-1 flex flex-col justify-center items-center text-center">
                  <ShieldCheck className="w-5 h-5 text-primary mb-1" />
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Local Sandbox</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => window.location.href = '/dashboard/convert'}
                  className="flex-1 h-16 bg-brand-gradient hover:opacity-90 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-2xl"
                >
                  Launch Service Now <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}