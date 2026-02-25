
"use client";

import { PDFPage, PDFElement, PDFTool } from './types';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { Type, Image as ImageIcon, Link as LinkIcon, Move, Crosshair, MousePointer2, Eraser, CheckSquare } from 'lucide-react';

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
 * AJN High-Performance Surgical Canvas
 * Enhanced for real-time Form Injection, Whiteout, and Link Anchoring.
 */
export function PDFCanvas({ page, zoom, activeTool, selectedElementId, onSelectElement, onUpdateElement, onAddElement, onRequestSignature }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

    const toolNeedsBox = ['signature', 'insert-image', 'link', 'form-field', 'whiteout'].includes(activeTool);

    if (toolNeedsBox) {
      setIsDrawingBox(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setBoxPreview({ x, y, w: 0, h: 0 });
      return;
    }

    if (activeTool === 'add-text') {
      onAddElement({
        id: `text-${Date.now()}`,
        type: 'text',
        x,
        y,
        width: 180,
        height: 40,
        content: 'Type something...',
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#000000',
        zIndex: page.elements.length,
      });
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
      
      if (w > 5 && h > 5) {
        const id = `${activeTool}-${Date.now()}`;
        if (activeTool === 'signature') onRequestSignature(x, y, w, h);
        else if (activeTool === 'insert-image') {
          setPendingImageArea({ x, y, w, h });
          fileInputRef.current?.click();
        } else if (activeTool === 'link') {
          onAddElement({ id, type: 'link', x, y, width: w, height: h, url: 'https://', zIndex: 100 });
        } else if (activeTool === 'form-field') {
          onAddElement({ id, type: 'form-field', x, y, width: w, height: h, fieldType: 'text', zIndex: 100 });
        } else if (activeTool === 'whiteout') {
          onAddElement({ id, type: 'whiteout', x, y, width: w, height: h, color: '#FFFFFF', zIndex: 100 });
        }
      }
      setBoxPreview(null);
    }
    setIsDragging(false);
  };

  const [pendingImageArea, setPendingImageArea] = useState<{x: number, y: number, w: number, h: number} | null>(null);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingImageArea) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onAddElement({
            id: `img-${Date.now()}`,
            type: 'image',
            x: pendingImageArea.x,
            y: pendingImageArea.y,
            width: pendingImageArea.w,
            height: pendingImageArea.h,
            content: ev.target.result as string,
            zIndex: page.elements.length,
          });
        }
      };
      reader.readAsDataURL(file);
    }
    setPendingImageArea(null);
  };

  return (
    <div 
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        "bg-white rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.35)] relative transition-shadow duration-500 origin-center select-none overflow-hidden",
        activeTool !== 'select' && 'cursor-crosshair'
      )}
      style={{ width: pageWidth * scale, height: pageHeight * scale }}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageFileSelect} />

      {/* RASTERIZED PDF SOURCE LAYER */}
      {page.previewUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={page.previewUrl} 
            className="w-full h-full object-contain pointer-events-none" 
            alt={`Buffer ${page.pageNumber}`} 
          />
        </div>
      )}

      {/* ACTIVE BOX PREVIEW */}
      {boxPreview && (
        <div 
          className="absolute border-2 border-primary bg-primary/10 z-[1000] pointer-events-none flex items-center justify-center"
          style={{
            left: (boxPreview.w < 0 ? boxPreview.x + boxPreview.w : boxPreview.x) * scale,
            top: (boxPreview.h < 0 ? boxPreview.y + boxPreview.h : boxPreview.y) * scale,
            width: Math.abs(boxPreview.w) * scale,
            height: Math.abs(boxPreview.h) * scale
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <Crosshair className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[8px] font-black uppercase text-primary bg-white/90 px-1 rounded">Mapping</span>
          </div>
        </div>
      )}

      {/* INTERACTIVE OBJECT MODEL LAYER */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: pageWidth, height: pageHeight }}
      >
        {page.elements.sort((a, b) => a.zIndex - b.zIndex).map(el => (
          <div
            key={el.id}
            className={cn(
              "absolute group transition-all cursor-move",
              selectedElementId === el.id ? "ring-2 ring-primary shadow-2xl z-[999] bg-primary/5" : "hover:ring-1 hover:ring-primary/40"
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
                className="w-full h-full flex items-center p-2 outline-none font-medium whitespace-pre-wrap leading-tight overflow-hidden"
                contentEditable={selectedElementId === el.id}
                onBlur={(e) => onUpdateElement({ ...el, content: e.currentTarget.innerText })}
                suppressContentEditableWarning
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

            {el.type === 'whiteout' && (
              <div className="w-full h-full shadow-inner" style={{ backgroundColor: el.color || '#FFFFFF' }} />
            )}

            {el.type === 'link' && (
              <div className="w-full h-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-blue-500 opacity-40" />
              </div>
            )}

            {el.type === 'form-field' && (
              <div className="w-full h-full border-2 border-indigo-500/40 bg-indigo-500/5 flex items-center px-2">
                <CheckSquare className="w-3 h-3 text-indigo-500 opacity-40 mr-2" />
                <span className="text-[10px] font-black uppercase text-indigo-500/40 truncate">Interactive Field</span>
              </div>
            )}

            {el.type === 'image' && el.content && (
              <img src={el.content} className="w-full h-full object-cover pointer-events-none" alt="" />
            )}

            {el.type === 'signature' && el.signatureData && (
              <img src={el.signatureData} className="w-full h-full object-contain pointer-events-none" alt="" />
            )}

            {selectedElementId === el.id && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap animate-in slide-in-from-bottom-2">
                <Move className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">{el.type} Unit</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
