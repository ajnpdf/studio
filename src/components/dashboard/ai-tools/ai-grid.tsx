"use client";

import { 
  FileText, 
  Languages, 
  ScanText, 
  Tag, 
  ShieldAlert, 
  UserSquare2, 
  Sparkles, 
  Search,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AITool } from './ai-tools-container';

const tools: AITool[] = [
  { id: 'summarizer', title: 'PDF Summarizer', desc: 'Reads entire PDF content → outputs key structured points.', icon: FileText, color: 'text-blue-400' },
  { id: 'translator', title: 'Document Translator', desc: 'Translates PDF or DOCX to 50+ languages while preserving layout.', icon: Languages, color: 'text-purple-400' },
  { id: 'ocr', title: 'Smart OCR', desc: 'Converts scans into searchable, editable text with layout preservation.', icon: ScanText, color: 'text-emerald-400' },
  { id: 'categorize', title: 'Auto Categorize', desc: 'Scans content and auto-applies smart category tags (Invoice, Resume, etc).', icon: Tag, color: 'text-orange-400' },
  { id: 'contract', title: 'Contract Analyzer', desc: 'Extracts parties, dates, and payment terms from legal documents.', icon: ShieldAlert, color: 'text-red-400' },
  { id: 'resume', title: 'Resume Formatter', desc: 'Reformats messy resumes into clean, modern standard layouts.', icon: UserSquare2, color: 'text-pink-400' },
  { id: 'enhancer', title: 'Smart Image Enhancer', desc: 'Automated pass for sharpness, noise, and color correction.', icon: Sparkles, color: 'text-yellow-400' },
  { id: 'semantic', title: 'Semantic Search', desc: 'Search across all workspace files using natural language queries.', icon: Search, color: 'text-cyan-400' },
];

export function AIGrid({ onSelect }: { onSelect: (t: AITool) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <Card 
          key={tool.id}
          onClick={() => onSelect(tool)}
          className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all group cursor-pointer overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <CardContent className="p-8 space-y-6">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 transition-all duration-500 group-hover:scale-110",
              tool.color
            )}>
              <tool.icon className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase tracking-tighter">{tool.title}</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-bold">{tool.desc}</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[8px] font-black">1 CREDIT</Badge>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">v2.5 Neural Model</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
