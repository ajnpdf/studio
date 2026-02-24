
"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Type, Upload, Eraser, CheckCircle2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: string, type: 'draw' | 'type' | 'upload') => void;
}

export function SignatureDialog({ open, onOpenChange, onSave }: Props) {
  const [activeTab, setActiveTab] = useState('draw');
  const [typeText, setTypeText] = useState('');
  const [typeFont, setTypeFont] = useState('Dancing Script');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (open && activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
        }
      }
    }
  }, [open, activeTab]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const data = canvasRef.current?.toDataURL();
      if (data) onSave(data, 'draw');
    } else if (activeTab === 'type') {
      if (!typeText) return;
      // Convert typed text to image for easy canvas placement
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `italic 40px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(typeText, 20, 60);
        onSave(canvas.toDataURL(), 'type');
      }
    }
    onOpenChange(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onSave(ev.target.result as string, 'upload');
          onOpenChange(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-black/5 p-0 overflow-hidden font-sans">
        <DialogHeader className="p-6 border-b border-black/5">
          <DialogTitle className="text-xl font-black uppercase tracking-tighter">Manage Signature</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-black/5 p-1 rounded-none border-b border-black/5">
            <TabsTrigger value="draw" className="text-[10px] font-black uppercase gap-2"><PenTool className="w-3 h-3" /> Draw</TabsTrigger>
            <TabsTrigger value="type" className="text-[10px] font-black uppercase gap-2"><Type className="w-3 h-3" /> Type</TabsTrigger>
            <TabsTrigger value="upload" className="text-[10px] font-black uppercase gap-2"><Upload className="w-3 h-3" /> Upload</TabsTrigger>
          </TabsList>

          <div className="p-8">
            <TabsContent value="draw" className="m-0 space-y-4">
              <div className="bg-slate-50 border-2 border-dashed border-black/5 rounded-2xl relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[200px] cursor-crosshair touch-none"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCanvas}
                  className="absolute bottom-4 right-4 h-8 text-[9px] font-black uppercase gap-2 bg-white border-black/5"
                >
                  <Eraser className="w-3 h-3" /> Clear
                </Button>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase text-center tracking-widest">Draw signature above using pointer or touch</p>
            </TabsContent>

            <TabsContent value="type" className="m-0 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Signature Text</Label>
                <Input 
                  placeholder="John Doe" 
                  value={typeText} 
                  onChange={(e) => setTypeText(e.target.value)}
                  className="h-14 text-xl font-bold border-black/10 bg-black/5"
                />
              </div>
              <div className="p-8 bg-slate-50 rounded-2xl border border-black/5 flex items-center justify-center min-h-[100px]">
                {typeText ? (
                  <span className="text-4xl italic font-serif text-slate-900">{typeText}</span>
                ) : (
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Preview Area</span>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="m-0">
              <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-black/5 rounded-[2.5rem] space-y-4 group hover:border-primary/40 transition-all cursor-pointer relative">
                <input type="file" onChange={handleFileUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-black/5 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-tighter">Choose file</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PNG or JPG recommended</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-6 border-t border-black/5 bg-slate-50/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-black uppercase">Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-white font-black text-[10px] uppercase px-8 h-10 rounded-xl shadow-lg">
            Adopt Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
