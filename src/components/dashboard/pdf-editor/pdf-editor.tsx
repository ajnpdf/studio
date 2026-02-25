"use client";

import { useState, useCallback, useEffect } from 'react';
import { PDFToolbar } from './pdf-toolbar';
import { PDFCanvas } from './pdf-canvas';
import { PDFPropertiesPanel } from './pdf-properties-panel';
import { SignatureDialog } from './signature-dialog';
import { PDFDocument, PDFPage, PDFTool, PDFElement, PDFVersion } from './types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { engine } from '@/lib/engine';

interface Props {
  initialFileId: string | null;
  file?: File | null;
}

const MOCK_VERSIONS: PDFVersion[] = [
  { id: 'v1', versionNumber: 1, timestamp: '2026-01-15 10:00', editorName: 'System', summary: 'Original Upload' }
];

/**
 * AJN Advanced Surgical PDF Studio
 * Professional Real-Time Orchestrator modeled after Sejda UI.
 */
export function PDFEditor({ initialFileId, file }: Props) {
  const [doc, setDoc] = useState<PDFDocument>({
    id: 'doc-initial',
    name: file?.name || 'Surgical_Document.pdf',
    totalPages: 1,
    pages: [{
      id: 'page-1',
      pageNumber: 1,
      rotation: 0,
      elements: [],
      isScanned: false,
    }],
    versions: MOCK_VERSIONS,
  });

  const [history, setHistory] = useState<PDFDocument[]>([doc]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [activeTool, setActiveTool] = useState<PDFTool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [sigOpen, setSigOpen] = useState(false);
  const [pendingSigPos, setPendingSigPos] = useState<{x: number, y: number, w: number, h: number} | null>(null);

  const { toast } = useToast();

  const pushToHistory = useCallback((newDoc: PDFDocument) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDoc);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setDoc(newDoc);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(prev);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(next);
    }
  };

  const handleUpdateElement = (updatedElement: PDFElement, pageIdx: number) => {
    const newDoc = {
      ...doc,
      pages: doc.pages.map((p, idx) => 
        idx === pageIdx 
          ? { ...p, elements: p.elements.map(el => el.id === updatedElement.id ? updatedElement : el) }
          : p
      )
    };
    pushToHistory(newDoc);
  };

  const handleAddElement = (element: PDFElement, pageIdx: number) => {
    const newDoc = {
      ...doc,
      pages: doc.pages.map((p, idx) => 
        idx === pageIdx 
          ? { ...p, elements: [...p.elements, { ...element, zIndex: p.elements.length }] }
          : p
      )
    };
    pushToHistory(newDoc);
    setSelectedElementId(element.id);
  };

  const handleRequestSignature = (x: number, y: number, w: number, h: number) => {
    setPendingSigPos({ x, y, w, h });
    setSigOpen(true);
  };

  const handleAdoptSignature = (data: string, type: 'draw' | 'type' | 'upload') => {
    if (!pendingSigPos) return;
    
    const newSig: PDFElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'signature',
      x: pendingSigPos.x,
      y: pendingSigPos.y,
      width: pendingSigPos.w,
      height: pendingSigPos.h,
      signatureData: data,
      signatureType: type,
      opacity: 1,
      zIndex: 100,
    };

    handleAddElement(newSig, 0);
    setPendingSigPos(null);
    setActiveTool('select');
  };

  const handleSave = async () => {
    setIsProcessing(true);
    toast({ title: "Applying Changes", description: "Executing surgical binary rewrite..." });
    
    try {
      const inputFiles = file ? [file] : [];
      const res = await engine.runTool('sign-pdf', inputFiles, { document: doc }, (p: any) => console.log(p.detail));
      if (res.success && res.blob) {
        const url = URL.createObjectURL(res.blob);
        const a = document.createElement('a');
        a.href = url; a.download = `Surgical_${doc.name}`; a.click();
        toast({ title: "Process Successful", description: "Changes committed to local buffer." });
      }
    } catch (err) {
      toast({ title: "Process Failed", description: "Internal buffer sync error.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-100 font-sans w-full">
      <PDFToolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        zoom={zoom}
        setZoom={setZoom}
        onRotate={() => {}}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        docName={doc.name}
        versions={doc.versions}
        onSave={handleSave}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto scrollbar-hide p-8 flex flex-col items-center gap-12 bg-slate-200/50">
          {doc.pages.map((page, idx) => (
            <div key={page.id} className="relative shadow-2xl">
              <PDFCanvas 
                page={page} 
                zoom={zoom}
                activeTool={activeTool}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={(el) => handleUpdateElement(el, idx)}
                onAddElement={(el) => handleAddElement(el, idx)}
                onRequestSignature={handleRequestSignature}
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-black/5">
                Segment {idx + 1}
              </div>
            </div>
          ))}
        </main>

        <div className="absolute right-0 top-0 bottom-0 pointer-events-none">
           <div className="pointer-events-auto h-full">
              <PDFPropertiesPanel 
                element={doc.pages.flatMap(p => p.elements).find(el => el.id === selectedElementId) || null}
                onUpdate={(el) => {
                  const pIdx = doc.pages.findIndex(p => p.elements.some(e => e.id === el.id));
                  if (pIdx !== -1) handleUpdateElement(el, pIdx);
                }}
                onDelete={() => {
                  if (!selectedElementId) return;
                  const newDoc = {
                    ...doc,
                    pages: doc.pages.map(p => ({
                      ...p,
                      elements: p.elements.filter(e => e.id !== selectedElementId)
                    }))
                  };
                  pushToHistory(newDoc);
                  setSelectedElementId(null);
                }}
              />
           </div>
        </div>
      </div>

      <SignatureDialog open={sigOpen} onOpenChange={setSigOpen} onSave={handleAdoptSignature} />

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <p className="text-sm font-black uppercase tracking-[0.4em] text-white">Surgical Transformation Active...</p>
          </div>
        </div>
      )}

      <footer className="h-10 bg-white border-t border-black/5 flex items-center justify-center shrink-0 z-[60]">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
          AJN Core • 2026 • Made in INDIAN<span className="animate-heart-beat ml-1">❤️</span>
        </p>
      </footer>
    </div>
  );
}
