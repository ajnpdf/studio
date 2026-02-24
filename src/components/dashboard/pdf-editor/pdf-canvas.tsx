"use client";

import { PDFPage, PDFElement, PDFTool } from './types';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { PenTool, Type, Image as ImageIcon, CheckCircle2, Link as LinkIcon, Trash2, Move, MousePointer2, Crosshair } from 'lucide-react';

interface Props {
  page: PDFPage;
  zoom: number;
  activeTool: PDFTool;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (el: PDFElement) => void;
  onAddElement: (el: PDFElement) => void;
  onRequestSignature: (x: number, y: number, width: number, height: number) => void;
}

/**
 * AJN High-Fidelity PDF Canvas
 * Professional interaction engine for document manipulation.
 */
export function PDFCanvas({ page, zoom, activeTool, selectedElementId, onSelectElement, onUpdateElement, onAddElement, onRequestSignature }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawingBox, setIsDrawingBox] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [boxPreview, setBoxPreview] = useState<{x: number, y: number, w: number, h: number} | null>(null);

  const scale = zoom / 100;
  const pageWidth = 595; 
  const pageHeight = 842;

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (activeTool === 'signature') {
      setIsDrawingBox(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setBoxPreview({ x, y, w: 0, h: 0 });
      return;
    }

    if (activeTool !== 'select') {
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
          content: 'New Text Layer',
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#000000',
        });
      } else if (activeTool === 'shape') {
        onAddElement({
          ...(baseEl as PDFElement),
          type: 'shape',
          width: 100,
          height: 100,
          color: '#3b82f6',
          opacity: 0.5,
        });
      }
      return;
    }

    if (e.target === canvasRef.current) {
      onSelectElement(null);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: PDFElement) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    onSelectElement(el.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: el.x, y: el.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isDrawingBox && boxPreview) {
      const w = (e.clientX - dragStart.x) / scale;
      const h = (e.clientY - dragStart.y) / scale;
      setBoxPreview({ ...boxPreview, w, h });
      return;
    }

    if (!isDragging || !selectedElementId) return;
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    const el = page.elements.find(e => e.id === selectedElementId);
    if (el) {
      onUpdateElement({
        ...el,
        x: elementStart.x + dx,
        y: elementStart.y + dy
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawingBox && boxPreview) {
      setIsDrawingBox(false);
      const x = boxPreview.w < 0 ? boxPreview.x + boxPreview.w : boxPreview.x;
      const y = boxPreview.h < 0 ? boxPreview.y + boxPreview.h : boxPreview.y;
      const w = Math.abs(boxPreview.w);
      const h = Math.abs(boxPreview.h);
      
      if (w > 10 && h > 10) {
        onRequestSignature(x, y, w, h);
      }
      setBoxPreview(null);
    }
    setIsDragging(false);
  };

  return (
    <div 
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        "bg-white rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.5)] relative transition-all duration-300 origin-center mb-24",
        activeTool === 'signature' ? 'cursor-crosshair' : 'cursor-default'
      )}
      style={{ 
        width: pageWidth * scale, 
        height: pageHeight * scale,
        transform: `rotate(${page.rotation}deg)`
      }}
    >
      {/* PDF STATIC CONTENT EMULATION */}
      <div className="absolute inset-0 p-16 flex flex-col gap-8 pointer-events-none select-none overflow-hidden opacity-20">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-8">
          <div className="w-32 h-8 bg-slate-200 rounded" />
          <div className="w-24 h-4 bg-slate-100 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
        </div>
      </div>

      {/* DRAW BOX PREVIEW */}
      {boxPreview && (
        <div 
          className="absolute border-2 border-primary bg-primary/5 z-[1000] flex items-center justify-center pointer-events-none"
          style={{
            left: boxPreview.w < 0 ? boxPreview.x + boxPreview.w : boxPreview.x,
            top: boxPreview.h < 0 ? boxPreview.y + boxPreview.h : boxPreview.y,
            width: Math.abs(boxPreview.w),
            height: Math.abs(boxPreview.h)
          }}
        >
          <Crosshair className="w-4 h-4 text-primary animate-pulse" />
        </div>
      )}

      {/* EDITABLE OBJECT MODEL LAYER */}
      <div 
        className="absolute inset-0 pointer-events-auto overflow-hidden"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: pageWidth, height: pageHeight }}
      >
        {page.elements.sort((a, b) => a.zIndex - b.zIndex).map(el => (
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
            onMouseDown={(e) => handleElementMouseDown(e, el)}
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
                }}
              >
                {el.content}
              </div>
            )}

            {el.type === 'shape' && (
              <div className="w-full h-full" style={{ backgroundColor: el.color }} />
            )}

            {el.type === 'signature' && el.signatureData && (
              <img 
                src={el.signatureData} 
                className="w-full h-full object-contain pointer-events-none" 
                alt="Signature"
              />
            )}

            {el.type === 'signature' && !el.signatureData && (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-primary/40 bg-primary/5">
                <span className="text-[10px] font-black uppercase text-primary/40">Defining Area...</span>
              </div>
            )}

            {selectedElementId === el.id && (
              <>
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border-2 border-primary rounded-full cursor-nw-resize" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border-2 border-primary rounded-full cursor-ne-resize" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-2 border-primary rounded-full cursor-sw-resize" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border-2 border-primary rounded-full cursor-se-resize" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap">
                  <Move className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{el.type} Layer</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
