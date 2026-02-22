"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Download, Trash2, ArrowRight, FileIcon, Clock, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function HistoryDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      const data = JSON.parse(localStorage.getItem('ajn_history') || '[]');
      setHistory(data);
    }
  }, [open]);

  const clearHistory = () => {
    localStorage.removeItem('ajn_history');
    setHistory([]);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card/95 backdrop-blur-3xl border-white/5 p-0 flex flex-col">
        <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-black uppercase tracking-tighter">Session History</SheetTitle>
              <SheetDescription className="text-[10px] font-bold uppercase tracking-widest">LocalStorage Persistence</SheetDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearHistory} className="h-10 w-10 text-muted-foreground hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {history.length === 0 ? (
              <div className="py-20 text-center space-y-4 opacity-40 grayscale">
                <Clock className="w-12 h-12 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest">No past interacting found</p>
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[8px] font-black uppercase px-1.5 h-4 border-white/10">{entry.fromFmt}</Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-[8px] font-black uppercase px-1.5 h-4 border-primary text-primary">{entry.toFmt}</Badge>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="overflow-hidden pr-4">
                      <p className="text-xs font-bold truncate text-white/90">{entry.fileName}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase">{entry.size}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <footer className="p-6 border-t border-white/5 bg-background/40">
          <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2">
            EXPORT LOG (CSV)
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
