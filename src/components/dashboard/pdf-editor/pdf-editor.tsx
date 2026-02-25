"use client";

import { useState, useCallback, useEffect } from 'react';
import { PDFToolbar } from './pdf-toolbar';
import { PDFCanvas } from './pdf-canvas';
import { PDFPropertiesPanel } from './pdf-properties-panel';
import { PDFThumbnailStrip } from './pdf-thumbnail-strip';
import { SignatureDialog } from './signature-dialog';
import { PDFDocument, PDFPage, PDFTool, PDFElement, PDFVersion } from './types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Eye } from 'lucide-react';
import { engine } from '@/lib/engine';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface Props {
  initialFileId: string | null;
  file?: File | null;
}

const MOCK_VERSIONS: PDFVersion[] = [{ id: 'v1', versionNumber: 1, timestamp: '2026-01-15 10:00', editorName: 'System', summary: 'Original Ingestion' }];

export function PDFEditor({ file }: Props) {
  const [doc, setDoc] = useState<PDFDocument>({ id: 'doc-initial', name: file?.name || 'Asset.pdf', totalPages: 0, pages: [], versions: MOCK_VERSIONS });
  const [history, setHistory] = useState<PDFDocument[]>([doc]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<PDFTool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [sigOpen, setSigOpen] = useState(false);
  const [pendingSigPos, setPendingSigPos] = useState<{x: number, y: number, w: number, h: number} | null>(null);
  const [previewPage, setPreviewPage] = useState<PDFPage | null>(null);

  const { toast } = useToast();

  const parsePDFFile = async (pdfFile: File): Promise<PDFPage[]> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const parsedPages: PDFPage[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height; canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      parsedPages.push({ 
        id: `page-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`, 
        pageNumber: i, 
        rotation: 0, 
        elements: [], 
        previewUrl: canvas.toDataURL('image/jpeg', 0.85) 
      });
    }
    return parsedPages;
  };

  const handleInitialize = useCallback(async (initialFile: File) => {
    setIsParsing(true);
    try {
      const newPages = await parsePDFFile(initialFile);
      const initialDoc: PDFDocument = { id: `doc-${Date.now()}`, name: initialFile.name, totalPages: newPages.length, pages: newPages, versions: MOCK_VERSIONS };
      setDoc(initialDoc); setHistory([initialDoc]); setHistoryIndex(0);
    } catch (err) {
      toast({ title: "Ingestion Error", description: "Kernel synchronization failed.", variant: "destructive" });
    } finally { setIsParsing(false); }
  }, [toast]);

  useEffect(() => { if (file) handleInitialize(file); }, [file, handleInitialize]);

  const pushToHistory = useCallback((newDoc: PDFDocument) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDoc); if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory); setHistoryIndex(newHistory.length - 1); setDoc(newDoc);
  }, [history, historyIndex]);

  const handleUpdateElement = (updatedElement: PDFElement, pageIdx: number) => {
    const newDoc = { ...doc, pages: doc.pages.map((p, idx) => idx === pageIdx ? { ...p, elements: p.elements.map(el => el.id === updatedElement.id ? updatedElement : el) } : p) };
    setDoc(newDoc);
    pushToHistory(newDoc);
  };

  const handleAddElement = (element: PDFElement, pageIdx: number) => {
    const newDoc = { ...doc, pages: doc.pages.map((p, idx) => idx === pageIdx ? { ...p, elements: [...p.elements, { ...element, zIndex: p.elements.length }] } : p) };
    pushToHistory(newDoc); setSelectedElementId(element.id);
  };

  const handleRotatePage = (pageIdx: number) => {
    const newDoc = {
      ...doc,
      pages: doc.pages.map((p, idx) => 
        idx === pageIdx ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    };
    pushToHistory(newDoc);
  };

  const undo = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setDoc(history[historyIndex - 1]); } };
  const redo = () => { if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setDoc(history[historyIndex + 1]); } };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.getAttribute('contenteditable') === 'true') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          const newDoc = { ...doc, pages: doc.pages.map(p => ({ ...p, elements: p.elements.filter(el => el.id !== selectedElementId) })) };
          pushToHistory(newDoc); setSelectedElementId(null);
        }
      }
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [doc, selectedElementId, historyIndex, history, pushToHistory]);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const inputFiles = file ? [file] : [];
      const res = await engine.runTool('edit-pdf', inputFiles, { document: doc }, (p: any) => console.log(p.detail));
      if (res.success && res.blob) {
        const url = URL.createObjectURL(res.blob);
        const a = document.createElement('a'); a.href = url; a.download = `Edited_${doc.name}`; a.click();
        toast({ title: "Surgical Sync Complete", description: "Binary reconstructed successfully." });
      }
    } catch (err) { toast({ title: "Sync Failed", variant: "destructive" }); }
    finally { setIsProcessing(false); }
  };

  if (isParsing) return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 bg-slate-100 h-full w-full">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Decomposing Binary Segments</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-100 font-sans w-full">
      <PDFToolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        zoom={zoom} 
        setZoom={setZoom} 
        onRotate={() => handleRotatePage(activePageIdx)} 
        onUndo={undo} 
        onRedo={redo} 
        canUndo={historyIndex > 0} 
        canRedo={historyIndex < history.length - 1} 
        onSave={handleSave} 
      />
      <div className="flex-1 flex overflow-hidden relative">
        <PDFThumbnailStrip 
          pages={doc.pages} 
          activeIdx={activePageIdx} 
          onSelect={setActivePageIdx} 
          onRotate={handleRotatePage}
          onAdd={async (files) => {
            setIsParsing(true);
            try {
              let combined = [...doc.pages];
              for (const f of files) { const parsed = await parsePDFFile(f); combined = [...combined, ...parsed]; }
              pushToHistory({ ...doc, pages: combined, totalPages: combined.length });
            } catch (e) { toast({ title: "Assembly Error", variant: "destructive" }); }
            finally { setIsParsing(false); }
          }} 
          onReorder={() => {}} 
        />
        <main className="flex-1 overflow-y-auto scrollbar-hide p-12 flex flex-col items-center gap-16 bg-slate-200/50 relative">
          {doc.pages.map((page, idx) => (
            <div 
              key={page.id} 
              className={cn(
                "relative shadow-[0_30px_100px_rgba(0,0,0,0.2)] transition-all duration-500", 
                activePageIdx === idx ? "ring-8 ring-primary/10 scale-[1.01]" : "opacity-90"
              )} 
              onMouseEnter={() => setActivePageIdx(idx)}
              onClick={() => setActivePageIdx(idx)}
            >
              <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" onClick={() => setPreviewPage(page)} className="h-8 w-8 bg-white/80 backdrop-blur shadow-sm rounded-full">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              <PDFCanvas 
                page={page} 
                zoom={zoom} 
                activeTool={activeTool} 
                selectedElementId={selectedElementId} 
                onSelectElement={setSelectedElementId} 
                onUpdateElement={(el) => handleUpdateElement(el, idx)} 
                onAddElement={(el) => handleAddElement(el, idx)} 
                onRequestSignature={(x, y, w, h) => { setPendingSigPos({ x, y, w, h }); setSigOpen(true); }} 
              />
            </div>
          ))}
        </main>
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-40">
          <PDFPropertiesPanel 
            element={doc.pages.flatMap(p => p.elements).find(el => el.id === selectedElementId) || null} 
            onUpdate={(el) => { 
              const pIdx = doc.pages.findIndex(p => p.elements.some(e => e.id === el.id)); 
              if (pIdx !== -1) handleUpdateElement(el, pIdx); 
            }} 
            onDelete={() => { 
              if (!selectedElementId) return; 
              pushToHistory({ 
                ...doc, 
                pages: doc.pages.map(p => ({ ...p, elements: p.elements.filter(e => e.id !== selectedElementId) })) 
              }); 
              setSelectedElementId(null); 
            }} 
          />
        </div>
      </div>

      <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] bg-white border-none p-0 overflow-hidden font-sans rounded-[3rem] shadow-2xl">
          <DialogHeader className="p-8 border-b border-black/5 flex items-center justify-between shrink-0">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Segment Audit</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setPreviewPage(null)} className="h-10 w-10 text-slate-400 hover:text-slate-900">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="flex-1 bg-slate-50 p-12 overflow-y-auto flex items-center justify-center">
            {previewPage && (
              <div className="relative shadow-2xl bg-white border border-black/5 origin-center transition-transform duration-500" style={{ transform: `rotate(${previewPage.rotation}deg)` }}>
                <img src={previewPage.previewUrl} className="max-w-full max-h-full object-contain" alt="" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SignatureDialog 
        open={sigOpen} 
        onOpenChange={setSigOpen} 
        onSave={(data, type) => { 
          if (!pendingSigPos) return; 
          handleAddElement({ 
            id: `sig-${Date.now()}`, 
            type: 'signature', 
            x: pendingSigPos.x, 
            y: pendingSigPos.y, 
            width: pendingSigPos.w, 
            height: pendingSigPos.h, 
            signatureData: data, 
            signatureType: type, 
            zIndex: 100 
          }, activePageIdx); 
          setPendingSigPos(null); 
          setActiveTool('select'); 
        }} 
      />
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center">
          <div className="text-center space-y-8 animate-in zoom-in-95">
            <Loader2 className="w-24 h-24 text-primary animate-spin mx-auto opacity-20" />
            <p className="text-lg font-black uppercase tracking-[0.5em] text-white">Finalizing Local Sync</p>
          </div>
        </div>
      )}
    </div>
  );
}