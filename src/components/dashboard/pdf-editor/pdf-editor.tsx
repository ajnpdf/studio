"use client";

import { useState, useEffect } from 'react';
import { PDFToolbar } from './pdf-toolbar';
import { PDFThumbnailStrip } from './pdf-thumbnail-strip';
import { PDFCanvas } from './pdf-canvas';
import { PDFPropertiesPanel } from './pdf-properties-panel';
import { PDFDocument, PDFPage, PDFTool, PDFElement, PDFVersion } from './types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
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
    isScanned: i === 0, // Mock first page as scanned
  })),
  versions: MOCK_VERSIONS,
};

export function PDFEditor({ initialFileId }: { initialFileId: string | null }) {
  const [doc, setDoc] = useState<PDFDocument>(MOCK_DOC);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<PDFTool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const { toast } = useToast();

  const activePage = doc.pages[activePageIdx];
  const selectedElement = activePage.elements.find(el => el.id === selectedElementId) || null;

  // Handle OCR trigger
  const handleEnableOCR = async () => {
    setIsOCRProcessing(true);
    // Simulate Neural OCR detection
    await new Promise(r => setTimeout(r, 2500));
    setDoc(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => 
        idx === activePageIdx ? { ...p, ocrEnabled: true, isScanned: false } : p
      )
    }));
    setIsOCRProcessing(false);
    toast({
      title: "OCR Layer Active",
      description: "Document text is now editable.",
    });
  };

  const handleUpdateElement = (updatedElement: PDFElement) => {
    setDoc(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => 
        idx === activePageIdx 
          ? { ...p, elements: p.elements.map(el => el.id === updatedElement.id ? updatedElement : el) }
          : p
      )
    }));
  };

  const handleAddElement = (element: PDFElement) => {
    setDoc(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => 
        idx === activePageIdx 
          ? { ...p, elements: [...p.elements, { ...element, zIndex: p.elements.length }] }
          : p
      )
    }));
    setSelectedElementId(element.id);
  };

  const handleRotatePage = (direction: 'cw' | 'ccw') => {
    setDoc(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => 
        idx === activePageIdx 
          ? { ...p, rotation: (p.rotation + (direction === 'cw' ? 90 : -90)) % 360 }
          : p
      )
    }));
  };

  const handlePageReorder = (from: number, to: number) => {
    const newPages = [...doc.pages];
    const [moved] = newPages.splice(from, 1);
    newPages.splice(to, 0, moved);
    setDoc({ ...doc, pages: newPages.map((p, i) => ({ ...p, pageNumber: i + 1 })) });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* TOP TOOLBAR */}
      <PDFToolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        zoom={zoom}
        setZoom={setZoom}
        onRotate={handleRotatePage}
        docName={doc.name}
        versions={doc.versions}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* OCR SUGGESTION BANNER */}
        {activePage.isScanned && !activePage.ocrEnabled && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-primary/90 backdrop-blur-xl border border-primary/20 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest">Scanned Content Detected</p>
                <p className="text-[10px] opacity-80">Enable Neural OCR to start editing text layers.</p>
              </div>
              <Button 
                size="sm" 
                onClick={handleEnableOCR} 
                disabled={isOCRProcessing}
                className="bg-white text-black hover:bg-white/90 font-black text-[9px] uppercase h-8 px-4"
              >
                {isOCRProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enable OCR"}
              </Button>
            </div>
          </div>
        )}

        {/* LEFT THUMBNAILS */}
        <PDFThumbnailStrip 
          pages={doc.pages} 
          activeIdx={activePageIdx} 
          onSelect={setActivePageIdx}
          onReorder={handlePageReorder}
        />

        {/* MAIN CANVAS */}
        <div className="flex-1 bg-[#0a0e1f] overflow-auto flex justify-center p-12 scrollbar-hide relative group/canvas">
          <PDFCanvas 
            page={activePage} 
            zoom={zoom}
            activeTool={activeTool}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
          />
        </div>

        {/* RIGHT PROPERTIES */}
        <PDFPropertiesPanel 
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={() => {
            if (!selectedElementId) return;
            setDoc(prev => ({
              ...prev,
              pages: prev.pages.map((p, idx) => 
                idx === activePageIdx 
                  ? { ...p, elements: p.elements.filter(el => el.id !== selectedElementId) }
                  : p
              )
            }));
            setSelectedElementId(null);
          }}
        />
      </div>
    </div>
  );
}
