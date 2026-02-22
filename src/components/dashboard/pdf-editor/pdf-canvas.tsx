
"use client";

import { PDFPage, PDFElement, PDFTool } from './types';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface Props {
  page: PDFPage;
  zoom: number;
  activeTool: PDFTool;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (el: PDFElement) => void;
  onAddElement: (el: PDFElement) => void;
}

export function PDFCanvas({ page, zoom, activeTool, selectedElementId, onSelectElement, onUpdateElement, onAddElement }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      if (e.target === canvasRef.current) {
        onSelectElement(null);
      }
      return;
    }

    // Handle adding new elements based on tool
    if (['add-text', 'edit-text'].includes(activeTool)) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);

      const newEl: PDFElement = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        x,
        y,
        width: 200,
        height: 40,
        content: 'Type something...',
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#ffffff',
        opacity: 1,
      };
      onAddElement(newEl);
    }
  };

  const scale = zoom / 100;
  const pageWidth = 595; // Standard A4 width at 72dpi
  const pageHeight = 842;

  return (
    <div 
      ref={canvasRef}
      className="bg-white rounded-sm shadow-2xl relative transition-transform origin-top"
      style={{ 
        width: pageWidth * scale, 
        height: pageHeight * scale,
        transform: `rotate(${page.rotation}deg)`
      }}
      onClick={handleCanvasClick}
    >
      {/* Background Content Layer (Mock PDF) */}
      <div className="absolute inset-0 p-12 flex flex-col gap-6 pointer-events-none select-none overflow-hidden">
        <div className="w-48 h-12 bg-gray-100 rounded-lg" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-50 rounded" />
          <div className="h-4 w-full bg-gray-50 rounded" />
          <div className="h-4 w-4/5 bg-gray-50 rounded" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-8">
          <div className="h-32 bg-gray-50 rounded-xl" />
          <div className="h-32 bg-gray-50 rounded-xl" />
        </div>
      </div>

      {/* Interactive Elements Layer */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {page.elements.map(el => (
          <div
            key={el.id}
            className={cn(
              "absolute cursor-move group transition-shadow",
              selectedElementId === el.id ? "ring-2 ring-primary ring-offset-2 ring-offset-white shadow-xl" : "hover:ring-1 hover:ring-primary/40"
            )}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              opacity: el.opacity,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(el.id);
            }}
          >
            {el.type === 'text' && (
              <div 
                className="w-full h-full flex items-center p-2 outline-none font-medium"
                style={{ 
                  fontSize: el.fontSize, 
                  fontFamily: el.fontFamily, 
                  color: el.color,
                  fontWeight: el.bold ? 'bold' : 'normal',
                  fontStyle: el.italic ? 'italic' : 'normal'
                }}
              >
                {el.content}
              </div>
            )}

            {/* Selection Handles */}
            {selectedElementId === el.id && (
              <>
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nw-resize" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-ne-resize" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-sw-resize" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-se-resize" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
