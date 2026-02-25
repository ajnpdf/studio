
'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Precision binary synchronization for document surgery.
 */
export class PDFManipulator {
  private files: File[];
  private onProgress?: ProgressCallback;

  constructor(files: File | File[], onProgress?: ProgressCallback) {
    this.files = Array.isArray(files) ? files : (files ? [files] : []);
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async runOperation(toolId: string, options: any = {}): Promise<ConversionResult> {
    // Defensive name handling for empty file scenarios
    const baseName = (this.files && this.files[0]) 
      ? this.files[0].name.split('.')[0] 
      : (options.document?.name?.split('.')[0] || "Surgical_Output");
    
    let { pageData = [] } = options;

    this.updateProgress(10, "Inhaling document binary structure...");
    const masterDoc = await PDFDocument.create();
    const font = await masterDoc.embedFont(StandardFonts.Helvetica);

    const sourceDocs = await Promise.all((this.files || []).map(async (f) => {
      try {
        if (!f) return null;
        const buf = await f.arrayBuffer();
        return await PDFDocument.load(buf, { ignoreEncryption: true });
      } catch (e) {
        console.error("[Manipulator] Source doc load failed:", e);
        return null;
      }
    }));

    // If no page instructions provided, map the entire first source document by default
    if (pageData.length === 0 && sourceDocs.length > 0 && sourceDocs[0]) {
      const pageCount = sourceDocs[0].getPageCount();
      for (let pIdx = 0; pIdx < pageCount; pIdx++) {
        pageData.push({ fileIdx: 0, pageIdx: pIdx, rotation: 0 });
      }
    }

    // If we're editing an existing structure from the UI editor
    if (options.document?.pages) {
      pageData = options.document.pages.map((p: any, idx: number) => ({
        fileIdx: (this.files.length > 0) ? 0 : -1,
        pageIdx: idx,
        rotation: p.rotation || 0
      }));
    }

    this.updateProgress(30, `Executing process: ${pageData.length} segments...`);
    
    for (let i = 0; i < pageData.length; i++) {
      const item = pageData[i];
      const prog = 30 + Math.round((i / pageData.length) * 60);
      this.updateProgress(prog, `Syncing segment ${i + 1}/${pageData.length}...`);

      let copiedPage;
      if (item.fileIdx !== -1 && sourceDocs[item.fileIdx]) {
        const sourceDoc = sourceDocs[item.fileIdx]!;
        if (item.pageIdx < sourceDoc.getPageCount()) {
          [copiedPage] = await masterDoc.copyPages(sourceDoc, [item.pageIdx]);
        } else {
          copiedPage = masterDoc.addPage([595.28, 841.89]);
        }
      } else {
        copiedPage = masterDoc.addPage([595.28, 841.89]);
      }
      
      if (item.rotation !== 0) copiedPage.setRotation(degrees(item.rotation));

      // Layer Injection (Elements from Editor)
      if (options.document?.pages?.[i]) {
        const elements = options.document.pages[i].elements;
        for (const el of elements) {
          try {
            if (el.type === 'signature' && el.signatureData) {
              const sigBytes = await fetch(el.signatureData).then(res => res.arrayBuffer());
              const sigImage = await masterDoc.embedPng(sigBytes);
              copiedPage.drawImage(sigImage, { x: el.x, y: el.y, width: el.width, height: el.height });
            } else if (el.type === 'text' && el.content) {
              copiedPage.drawText(el.content, { 
                x: el.x, 
                y: copiedPage.getHeight() - el.y - (el.fontSize || 12), 
                size: el.fontSize || 12, 
                font, 
                color: rgb(0, 0, 0) 
              });
            }
          } catch (err) {
            console.warn("[Manipulator] Layer sync warning:", err);
          }
        }
      }
      
      masterDoc.addPage(copiedPage);
    }

    if (masterDoc.getPageCount() === 0) {
      masterDoc.addPage([595.28, 841.89]);
    }

    this.updateProgress(95, "Synchronizing binary buffer...");
    const pdfBytes = await masterDoc.save({ useObjectStreams: true });
    return { 
      blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
      fileName: `${baseName}.pdf`, 
      mimeType: 'application/pdf' 
    };
  }
}
