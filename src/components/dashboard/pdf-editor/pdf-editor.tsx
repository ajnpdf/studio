
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PDFToolbar } from './pdf-toolbar';
import { PDFThumbnailStrip } from './pdf-thumbnail-strip';
import { PDFCanvas } from './pdf-canvas';
import { PDFPropertiesPanel } from './pdf-properties-panel';
import { SignatureDialog } from './signature-dialog';
import { PDFDocument, PDFPage, PDFTool, PDFElement, PDFVersion } from './types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Save, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_VERSIONS: PDFVersion[] = [
  { id: 'v1', versionNumber: 1, timestamp: '2025-01-15 10:00', editorName: 'System', summary: 'Original Upload' }
];

const MOCK_DOC: PDFDocument = {
  id: 'doc-1',
  name: 'Project_Proposal_Final.pdf',
  totalPages: 5,
  pages: Array.from({ length: 5 }, (_, i) => ({
    id: `page-${i + 1}`,
    pageNumber: i + 1,
    rotation: 0,
    elements: [],
    isScanned: i === 0,
  })),
  versions: MOCK_VERSIONS,
};

export function PDFEditor({ initialFileId }: { initialFileId: string | null }) {
  const [doc, setDoc] = useState<PDFDocument>(MOCK_DOC);
  const [history, setHistory] = useState<PDFDocument[]>([MOCK_DOC]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<PDFTool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [sigOpen, setSigOpen] = useState(false);
  const [pendingSigPos, setPendingSigPos] = useState<{x: number, y: number} | null>(null);

  const { toast } = useToast();

  const activePage = doc.pages[activePageIdx];
  const selectedElement = activePage.elements.find(el => el.id === selectedElementId) || null;

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

  const handleUpdateElement = (updatedElement: PDFElement) => {
    const newDoc = {
      ...doc,
      pages: doc.pages.map((p, idx) => 
        idx === activePageIdx 
          ? { ...p, elements: p.elements.map(el => el.id === updatedElement.id ? updatedElement : el) }
          : p
      )
    };
    pushToHistory(newDoc);
  };

  const handleAddElement = (element: PDFElement) => {
    const newDoc = {
      ...doc,
      pages: doc.pages.map((p, idx) => 
        idx === activePageIdx 
          ? { ...p, elements: [...p.elements, { ...element, zIndex: p.elements.length }] }
          : p
      )
    };
    pushToHistory(newDoc);
    setSelectedElementId(element.id);
  };

  const handleRequestSignature = (x: number, y: number) => {
    setPendingSigPos({ x, y });
    setSigOpen(true);
  };

  const handleAdoptSignature = (data: string, type: 'draw' | 'type' | 'upload') => {
    if (!pendingSigPos) return;
    
    const newSig: PDFElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'signature',
      x: pendingSigPos.x,
      y: pendingSigPos.y,
      width: 200,
      height: 80,
      signatureData: data,
      signatureType: type,
      opacity: 1,
      zIndex: activePage.elements.length,
    };

    handleAddElement(newSig);
    setPendingSigPos(null);
    setActiveTool('select');
  };

  const handleSave = async () => {
    setIsProcessing(true);
    toast({ title: "Saving Changes", description: "Serializing modified content streams..." });
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    toast({ title: "Process Successful", description: "Document has been synchronized." });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0a0e1f] font-sans">
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

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <PDFThumbnailStrip 
          pages={doc.pages} 
          activeIdx={activePageIdx} 
          onSelect={setActivePageIdx}
          onReorder={() => {}}
        />

        <div className="flex-1 bg-[#0a0e1f] overflow-auto flex justify-center p-12 scrollbar-hide relative">
          <PDFCanvas 
            page={activePage} 
            zoom={zoom}
            activeTool={activeTool}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
            onRequestSignature={handleRequestSignature}
          />
        </div>

        <PDFPropertiesPanel 
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={() => {
            if (!selectedElementId) return;
            const newDoc = {
              ...doc,
              pages: doc.pages.map((p, idx) => 
                idx === activePageIdx 
                  ? { ...p, elements: p.elements.filter(el => el.id !== selectedElementId) }
                  : p
              )
            };
            pushToHistory(newDoc);
            setSelectedElementId(null);
          }}
        />
      </div>

      <SignatureDialog 
        open={sigOpen} 
        onOpenChange={setSigOpen} 
        onSave={handleAdoptSignature} 
      />

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="text-sm font-black uppercase tracking-widest text-white">Executing Binary Rewrite...</p>
          </div>
        </div>
      )}
    </div>
  );
}
