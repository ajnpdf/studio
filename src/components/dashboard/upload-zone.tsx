"use client";

import { useState, useRef } from 'react';
import { Upload, Monitor, HardDrive, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function UploadZone({ onFilesAdded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <section className="space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 border-dashed p-16",
          isDragging 
            ? "border-primary bg-primary/10 scale-[0.99] shadow-2xl shadow-primary/20" 
            : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10 shadow-xl"
        )}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={cn(
            "w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500",
            isDragging ? "scale-125 rotate-6" : "group-hover:scale-110"
          )}>
            <Upload className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tighter">Drop your files here</h3>
            <p className="text-muted-foreground font-medium">or click to browse from your device</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Max 50 MB (Free)
            </div>
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              300+ FORMATS SUPPORTED <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)]"></div>
      </div>

      <Tabs defaultValue="device" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="device" className="gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-primary font-bold">
            <Monitor className="w-4 h-4" /> MY DEVICE
          </TabsTrigger>
          <TabsTrigger value="vault" className="gap-2 px-6 py-2.5 rounded-xl font-bold">
            <HardDrive className="w-4 h-4" /> NETWORK VAULT
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2 px-6 py-2.5 rounded-xl font-bold">
            <LinkIcon className="w-4 h-4" /> URL PASTE
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="mt-4 animate-in slide-in-from-top-2">
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/file.pdf" 
              className="bg-white/5 border-white/10 h-12 focus:ring-primary"
            />
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 font-bold">IMPORT URL</Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
