"use client";

import { PDFPage, PDFElement, PDFTool } from './types';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { PenTool, Type, Image as ImageIcon, CheckCircle2, Link as LinkIcon, Trash2 } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      if (e.target === canvasRef.current) {
        onSelectElement(null);
      }
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scale = zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const baseEl: Partial<PDFElement> = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      width: 150,
      height: 40,
      opacity: 1,
      zIndex: page.elements.length,
    };

    if (activeTool === 'add-text') {
      onAddElement({
        ...(baseEl as PDFElement),
        type: 'text',
        content: 'New Text Box',
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#000000',
      });
    } else if (activeTool === 'signature') {
      onAddElement({
        ...(baseEl as PDFElement),
        type: 'signature',
        signatureType: 'type',
        content: 'John Doe',
        width: 200,
        height: 80,
        fontFamily: 'Caveat', // Mock signature font
        color: '#000080', // Navy blue signature
      });
    } else if (activeTool === 'form-field') {
      onAddElement({
        ...(baseEl as PDFElement),
        type: 'form-field',
        fieldType: 'text',
        width: 180,
        height: 30,
        content: 'Form Field',
      });
    }
  };

  const scale = zoom / 100;
  const pageWidth = 595; 
  const pageHeight = 842;

  return (
    <div 
      ref={canvasRef}
      className="bg-white rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.3)] relative transition-all duration-300 origin-center mb-24"
      style={{ 
        width: pageWidth * scale, 
        height: pageHeight * scale,
        transform: `rotate(${page.rotation}deg)`
      }}
      onClick={handleCanvasClick}
    >
      {/* MOCK PDF BACKGROUND CONTENT */}
      <div className="absolute inset-0 p-16 flex flex-col gap-8 pointer-events-none select-none overflow-hidden opacity-100">
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-8">
          <div className="w-32 h-8 bg-gray-100 rounded" />
          <div className="w-24 h-4 bg-gray-50 rounded" />
        </div>
        
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-50 rounded" />
          <div className="h-4 w-full bg-gray-50 rounded" />
          <div className="h-4 w-5/6 bg-gray-50 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-12 py-8">
          <div className="h-40 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-200" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-50 rounded" />
            <div className="h-4 w-full bg-gray-50 rounded" />
            <div className="h-4 w-3/4 bg-gray-50 rounded" />
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-12 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="w-40 h-1 bg-gray-100 rounded" />
            <div className="w-40 h-1 bg-gray-100 rounded" />
          </div>
          <div className="flex justify-between">
            <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">Authorized Signature</p>
            <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">Date of Issuance</p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE OVERLAY LAYERS */}
      <div 
        className="absolute inset-0 pointer-events-auto overflow-hidden"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: pageWidth, height: pageHeight }}
      >
        {page.elements.map(el => (
          <div
            key={el.id}
            className={cn(
              "absolute cursor-move group transition-all select-none",
              selectedElementId === el.id ? "ring-2 ring-primary ring-offset-2 ring-offset-white shadow-2xl z-[999]" : "hover:ring-1 hover:ring-primary/40"
            )}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              opacity: el.opacity,
              zIndex: el.zIndex,
              transform: `rotate(${el.rotation || 0}deg)`
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(el.id);
            }}
          >
            {el.type === 'text' && (
              <div 
                className="w-full h-full flex items-center p-2 outline-none font-medium whitespace-pre-wrap leading-tight"
                style={{ 
                  fontSize: el.fontSize, 
                  fontFamily: el.fontFamily, 
                  color: el.color,
                  fontWeight: el.bold ? 'bold' : 'normal',
                  fontStyle: el.italic ? 'italic' : 'normal',
                  textDecoration: el.underline ? 'underline' : 'none',
                }}
              >
                {el.content}
              </div>
            )}

            {el.type === 'signature' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 border border-dashed border-primary/20 bg-primary/5">
                <span style={{ 
                  fontFamily: "'Brush Script MT', cursive", 
                  fontSize: el.fontSize || 32, 
                  color: el.color || '#000080' 
                }}>
                  {el.content}
                </span>
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-3 h-3 text-primary opacity-40" />
                </div>
              </div>
            )}

            {el.type === 'form-field' && (
              <div className="w-full h-full bg-blue-50/50 border border-blue-200 flex items-center px-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{el.content}</span>
              </div>
            )}

            {/* SELECTION HANDLES */}
            {selectedElementId === el.id && (
              <>
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  {el.type}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
