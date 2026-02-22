
"use client";

import { useState, useEffect } from 'react';
import { PDFToolbar } from './pdf-toolbar';
import { PDFThumbnailStrip } from './pdf-thumbnail-strip';
import { PDFCanvas } from './pdf-canvas';
import { PDFPropertiesPanel } from './pdf-properties-panel';
import { PDFDocument, PDFPage, PDFTool, PDFElement } from './types';

const MOCK_DOC: PDFDocument = {
  id: 'doc-1',
  name: 'Project_Proposal_Final.pdf',
  totalPages: 5,
  pages: Array.from({ length: 5 }, (_, i) => ({
    id: `page-${i + 1}`,
    pageNumber: i + 1,
    rotation: 0,
    elements: [],
  })),
};

export function PDFEditor({ initialFileId }: { initialFileId: string | null }) {
  const [doc, setDoc] = useState<PDFDocument>(MOCK_DOC);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<PDFTool>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'single' | 'continuous' | 'two-page'>('single');

  const activePage = doc.pages[activePageIdx];
  const selectedElement = activePage.elements.find(el => el.id === selectedElementId) || null;

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
          ? { ...p, elements: [...p.elements, element] }
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

  const handleDeletePage = () => {
    if (doc.pages.length <= 1) return;
    setDoc(prev => ({
      ...prev,
      pages: prev.pages.filter((_, idx) => idx !== activePageIdx),
      totalPages: prev.totalPages - 1
    }));
    setActivePageIdx(Math.max(0, activePageIdx - 1));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* TOP TOOLBAR */}
      <PDFToolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        zoom={zoom}
        setZoom={setZoom}
        onRotate={handleRotatePage}
        onDeletePage={handleDeletePage}
        docName={doc.name}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT THUMBNAILS */}
        <PDFThumbnailStrip 
          pages={doc.pages} 
          activeIdx={activePageIdx} 
          onSelect={setActivePageIdx}
        />

        {/* MAIN CANVAS */}
        <div className="flex-1 bg-[#1a1f2e] overflow-auto flex justify-center p-8 scrollbar-hide relative">
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
        />
      </div>
    </div>
  );
}
