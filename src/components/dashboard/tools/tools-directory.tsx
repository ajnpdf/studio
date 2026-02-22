
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
  Wand2,
  X,
  Info,
  Activity,
  Code2,
  Workflow
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type LogicStep = {
  label: string;
  desc: string;
};

type ToolEntry = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  href: string;
  tags: string[];
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  stack: string;
  logicSteps: LogicStep[];
  outputMime: string;
};

type ToolCategory = {
  id: string;
  title: string;
  description: string;
  icon: any;
  tools: ToolEntry[];
};

const categories: ToolCategory[] = [
  {
    id: 'core',
    title: "Universal Core",
    description: "High-concurrency batch processing and format routing.",
    icon: Zap,
    tools: [
      { 
        id: 'converter', 
        name: 'Real-time Converter', 
        desc: 'Universal engine for 300+ formats.', 
        icon: Repeat, 
        href: '/dashboard/convert', 
        tags: ['Core', 'WASM'],
        complexity: 'MEDIUM',
        stack: 'WebAssembly + Native JS',
        outputMime: 'Multi-format',
        logicSteps: [
          { label: "MIME Detection", desc: "Magic byte analysis to identify true source encoding." },
          { label: "Neural Routing", desc: "Mapping source to specialized WASM worker thread." },
          { label: "Buffer Allocation", desc: "Provisioning isolated memory segment for processing." },
          { label: "Stream Execution", desc: "Executing binary transformation pipeline." }
        ]
      },
      { 
        id: 'batch', 
        name: 'Batch Center', 
        desc: 'Process hundreds of files in parallel.', 
        icon: Box, 
        href: '/dashboard/tools/batch', 
        tags: ['Automation'],
        complexity: 'HIGH',
        stack: 'JobQueue + Worker Threads',
        outputMime: 'application/zip',
        logicSteps: [
          { label: "Queue Ingestion", desc: "Sorting files by size for optimized concurrency." },
          { label: "Parallel Spawn", desc: "Initializing up to 3 concurrent neural instances." },
          { label: "Metadata Aggregation", desc: "Collecting output headers for manifest generation." },
          { label: "ZIP Synthesis", desc: "Final archive packaging via JSZip deflation." }
        ]
      },
    ]
  },
  {
    id: 'document',
    title: "Document Excellence",
    description: "Professional-grade editing, signing, and normalization.",
    icon: FileText,
    tools: [
      { 
        id: 'pdf', 
        name: 'PDF Master', 
        desc: 'Edit, sign, and redact documents.', 
        icon: FileText, 
        href: '/dashboard/pdf-editor', 
        tags: ['Editor', 'E-Sign'],
        complexity: 'HIGH',
        stack: 'pdf-lib + PDF.js',
        outputMime: 'application/pdf',
        logicSteps: [
          { label: "Layer Decoupling", desc: "Separating content streams from interactive form widgets." },
          { label: "Vector Mapping", desc: "Coordinate transformation from screen to PDF points." },
          { label: "AcroForm Injection", desc: "Injecting cryptographic signature appearances." },
          { label: "Stream Compression", desc: "Optimizing PDF objects for archival storage." }
        ]
      },
      { 
        id: 'ocr', 
        name: 'Neural OCR', 
        desc: 'Scanned image to searchable PDF.', 
        icon: Scan, 
        href: '/dashboard/tools/ai', 
        tags: ['Vision', 'AI'],
        complexity: 'VERY HIGH',
        stack: 'Tesseract.js WASM',
        outputMime: 'application/pdf',
        logicSteps: [
          { label: "Image Pre-processing", desc: "Grayscale conversion and adaptive thresholding." },
          { label: "Glyph Recognition", desc: "Neural network analysis of character patterns." },
          { label: "BBox Calculation", desc: "Mapping identified text to spatial coordinates." },
          { label: "Invisible Layer Sync", desc: "Synthesizing selectable text over original raster." }
        ]
      },
    ]
  },
  {
    id: 'media',
    title: "High-Fidelity Media",
    description: "Hardware-accelerated processing for creative assets.",
    icon: Video,
    tools: [
      { 
        id: 'video', 
        name: 'Video Lab', 
        desc: 'Professional FFmpeg transcoding.', 
        icon: Video, 
        href: '/dashboard/tools/video', 
        tags: ['FFmpeg', '4K'],
        complexity: 'VERY HIGH',
        stack: 'FFmpeg.wasm (SharedArrayBuffer)',
        outputMime: 'video/mp4',
        logicSteps: [
          { label: "WASM Mount", desc: "Loading 31MB core into browser Cache API." },
          { label: "FS Write", desc: "Writing source binary to virtual MEMFS." },
          { label: "Command Parsing", desc: "Translating UI settings to FFmpeg CLI arguments." },
          { label: "Bitstream Encoding", desc: "Hardware-accelerated frame transcode sequence." }
        ]
      },
      { 
        id: 'audio', 
        name: 'Audio Studio', 
        desc: 'Bitrate surgery and waveform trim.', 
        icon: Music, 
        href: '/dashboard/tools/audio', 
        tags: ['WAV', 'MP3'],
        complexity: 'MEDIUM',
        stack: 'Web Audio API + FFmpeg',
        outputMime: 'audio/mpeg',
        logicSteps: [
          { label: "Waveform Analysis", desc: "Rendering peak data for visual precision." },
          { label: "Sample Re-mapping", desc: "Resampling audio buffer to target frequency." },
          { label: "LAME Encoding", desc: "Executing MP3 psychoacoustic compression." },
          { label: "ID3 Preservation", desc: "Copying metadata tags to new binary header." }
        ]
      },
    ]
  },
  {
    id: 'technical',
    title: "Technical & Data",
    description: "Specialized engineering and code transformations.",
    icon: Terminal,
    tools: [
      { 
        id: 'cad', 
        name: 'Technical CAD', 
        desc: 'DXF/STL blueprint processing.', 
        icon: Layers, 
        href: '/dashboard/convert?cat=3D/CAD', 
        tags: ['Engineering'],
        complexity: 'HIGH',
        stack: 'Three.js + DxfParser',
        outputMime: 'model/obj',
        logicSteps: [
          { label: "Entity Extraction", desc: "Parsing DXF segments into mathematical paths." },
          { label: "Normal Computation", desc: "Calculating face orientation for 3D surfaces." },
          { label: "Triangulation", desc: "Subdividing complex quads into mesh triangles." },
          { label: "SVG Serialization", desc: "Exporting blueprints to vector XML structure." }
        ]
      },
      { 
        id: 'code', 
        name: 'Code Interop', 
        desc: 'JSON/XML/YAML schema mapping.', 
        icon: Terminal, 
        href: '/dashboard/convert?cat=Code', 
        tags: ['DevOps'],
        complexity: 'LOW',
        stack: 'DOMParser + js-yaml',
        outputMime: 'application/json',
        logicSteps: [
          { label: "Tokenization", desc: "Breaking input text into hierarchical semantic units." },
          { label: "Object Hydration", desc: "Building internal JS representation of data tree." },
          { label: "Tag Sanitization", desc: "Ensuring XML tags comply with w3c standards." },
          { label: "Pretty Print", desc: "Applying configured indentation and folding." }
        ]
      },
    ]
  }
];

export function ToolsDirectory() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [inspectingTool, setInspectingTool] = useState<ToolEntry | null>(null);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(t => 
      (activeTab === 'all' || cat.id === activeTab) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) || 
       t.desc.toLowerCase().includes(search.toLowerCase()) ||
       t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="h-24 border-b border-white/5 bg-background/40 backdrop-blur-xl flex flex-col justify-center px-8 shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Cpu className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Network Directory</h1>
                <p className="text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase mt-1">AJN Neural Hub</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-white/10 hidden lg:block" />

            <div className="relative max-w-md w-full group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input 
                placeholder="Search services..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-11 bg-white/5 border-white/10 text-xs font-bold focus:ring-primary/50 rounded-2xl w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden lg:block">
              <TabsList className="bg-white/5 border border-white/10 h-11 p-1 rounded-2xl">
                <TabsTrigger value="all" className="text-[9px] font-black uppercase px-4 h-9 rounded-xl">All Units</TabsTrigger>
                {categories.map(c => (
                  <TabsTrigger key={c.id} value={c.id} className="text-[9px] font-black uppercase px-4 h-9 rounded-xl">{c.title}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">WASM Layer Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto p-10 space-y-16 pb-32">
          {filteredCategories.length === 0 ? (
            <div className="py-32 text-center space-y-6 opacity-40">
              <Search className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-sm font-black uppercase tracking-widest">No matching neural units in current sector.</p>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.tools.map((tool) => (
                    <Card 
                      key={tool.id} 
                      onClick={() => setInspectingTool(tool)}
                      className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/40 transition-all group h-full cursor-pointer relative overflow-hidden flex flex-col border-2"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Workflow className="w-4 h-4 text-primary" />
                      </div>
                      
                      <CardContent className="p-8 flex flex-col h-full space-y-6">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                          <tool.icon className="w-7 h-7 text-white/80 group-hover:text-primary transition-colors" />
                        </div>

                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-sm uppercase tracking-tighter group-hover:text-primary transition-colors">{tool.name}</h4>
                            <Badge variant="outline" className={cn(
                              "text-[7px] font-black h-4 px-1.5 border-none",
                              tool.complexity === 'LOW' ? 'bg-emerald-500/10 text-emerald-500' :
                              tool.complexity === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-orange-500/10 text-orange-500'
                            )}>
                              {tool.complexity}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-wider line-clamp-2">
                            {tool.desc}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">WASM STABLE</span>
                          </div>
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Inspect Logic</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {/* LOGIC INSPECTOR OVERLAY */}
      {inspectingTool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl relative overflow-hidden rounded-[3rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
            
            <button 
              onClick={() => setInspectingTool(null)}
              className="absolute top-8 right-8 h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-50"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <CardContent className="p-12 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                  <inspectingTool.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-[0.2em] mb-2 px-3">
                    Neural Intelligence Layer
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">{inspectingTool.name}</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{inspectingTool.stack}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                  <Activity className="w-4 h-4 text-primary" /> Logic Workflow Blueprint
                </h3>
                
                <div className="space-y-4">
                  {inspectingTool.logicSteps.map((step, i) => (
                    <div key={i} className="flex gap-6 group relative">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] z-10 transition-colors group-hover:bg-primary group-hover:text-white">
                          {i + 1}
                        </div>
                        {i < inspectingTool.logicSteps.length - 1 && (
                          <div className="w-px flex-1 bg-white/10 my-2" />
                        )}
                      </div>
                      <div className="pb-6 space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tight text-white/90">{step.label}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-2">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Complexity</p>
                  <p className="text-xl font-black text-white">{inspectingTool.complexity}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-2">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Output Mode</p>
                  <p className="text-xs font-black text-primary truncate">{inspectingTool.outputMime}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => window.location.href = inspectingTool.href}
                  className="flex-1 h-14 bg-brand-gradient hover:opacity-90 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl"
                >
                  Execute Module <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 px-8 border-white/10 bg-white/5 font-black text-xs uppercase tracking-widest rounded-2xl"
                >
                  API Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="h-16 border-t border-white/5 bg-background/60 backdrop-blur-xl flex items-center justify-center px-8 shrink-0 z-20">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          All units process data 100% locally in secure browser sandboxes
        </p>
      </footer>
    </div>
  );
}
