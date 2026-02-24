'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Precision binary synchronization for document surgery.
 * Hardened for E-Sign injection, Image layering, and real-time execution.
 */
export class PDFManipulator {
  private files: File[];
  private onProgress?: ProgressCallback;

  constructor(files: File | File[], onProgress?: ProgressCallback) {
    this.files = Array.isArray(files) ? files : [files];
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async runOperation(toolId: string, options: any = {}): Promise<ConversionResult> {
    const firstFile = this.files && this.files.length > 0 ? this.files[0] : null;
    const baseName = firstFile ? firstFile.name.split('.')[0] : (options.document?.name?.split('.')[0] || "Document");
    
    let { pageData = [] } = options;

    this.updateProgress(10, "Inhaling document binary structure...");
    const masterDoc = await PDFDocument.create();
    const font = await masterDoc.embedFont(StandardFonts.Helvetica);

    // Safely load source documents if files exist
    const sourceDocs = await Promise.all((this.files || []).map(async (f) => {
      try {
        const buf = await f.arrayBuffer();
        return await PDFDocument.load(buf, { ignoreEncryption: true });
      } catch (e) {
        console.warn(`[Manipulator] Failed to load source file ${f.name}`, e);
        return null;
      }
    }));

    // If no specific page data was passed, default to all pages from all source docs
    if (pageData.length === 0 && sourceDocs.length > 0) {
      sourceDocs.forEach((doc, fIdx) => {
        if (!doc) return;
        const pageCount = doc.getPageCount();
        for (let pIdx = 0; pIdx < pageCount; pIdx++) {
          pageData.push({ fileIdx: fIdx, pageIdx: pIdx, rotation: 0 });
        }
      });
    }

    // If still no page data (e.g. editor start), use the document object model if available
    if (pageData.length === 0 && options.document?.pages) {
      options.document.pages.forEach((p: any, idx: number) => {
        pageData.push({ fileIdx: -1, pageIdx: idx, rotation: p.rotation || 0 });
      });
    }

    this.updateProgress(30, `Executing surgical process: ${pageData.length} segments...`);
    
    for (let i = 0; i < pageData.length; i++) {
      const item = pageData[i];
      const prog = 30 + Math.round((i / pageData.length) * 60);
      this.updateProgress(prog, `Syncing segment ${i + 1}/${pageData.length}...`);

      let copiedPage;
      
      // If we have a source doc, copy the page
      if (item.fileIdx !== -1 && sourceDocs[item.fileIdx]) {
        const sourceDoc = sourceDocs[item.fileIdx]!;
        [copiedPage] = await masterDoc.copyPages(sourceDoc, [item.pageIdx]);
      } else {
        // Otherwise create a blank page for the injection
        copiedPage = masterDoc.addPage([595.28, 841.89]);
      }
      
      if (item.rotation !== 0) {
        copiedPage.setRotation(degrees(item.rotation));
      }

      // Add Page Numbers Logic
      if (toolId === 'add-page-numbers') {
        const { width } = copiedPage.getSize();
        const text = `Page ${i + 1} of ${pageData.length}`;
        const textSize = 10;
        const textWidth = font.widthOfTextAtSize(text, textSize);
        
        copiedPage.drawText(text, {
          x: (width - textWidth) / 2,
          y: 25,
          size: textSize,
          font,
          color: rgb(0, 0, 0),
          opacity: 0.6
        });
      }

      // HIGH-FIDELITY LAYER INJECTION (SIGNATURES, IMAGES, TEXT)
      if (options.document?.pages?.[i]) {
        const elements = options.document.pages[i].elements;
        for (const el of elements) {
          try {
            if (el.type === 'signature' && el.signatureData) {
              const sigBytes = await fetch(el.signatureData).then(res => res.arrayBuffer());
              const sigImage = await masterDoc.embedPng(sigBytes);
              copiedPage.drawImage(sigImage, {
                x: el.x, y: el.y, width: el.width, height: el.height
              });
            } else if (el.type === 'image' && el.content) {
              const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
              const img = el.content.includes('png') ? await masterDoc.embedPng(imgBytes) : await masterDoc.embedJpg(imgBytes);
              copiedPage.drawImage(img, {
                x: el.x, y: el.y, width: el.width, height: el.height
              });
            } else if (el.type === 'text' && el.content) {
              copiedPage.drawText(el.content, {
                x: el.x, y: el.y, size: el.fontSize || 12, font, color: rgb(0, 0, 0)
              });
            }
          } catch (err) {
            console.error("[Surgical Engine] Element injection failed:", err);
          }
        }
      }
      
      // Ensure the page is attached if we copied it
      if (item.fileIdx !== -1) {
        masterDoc.addPage(copiedPage);
      }
    }

    if (masterDoc.getPageCount() === 0) {
      masterDoc.addPage();
    }

    this.updateProgress(95, "Synchronizing final binary buffer...");
    const pdfBytes = await masterDoc.save({ useObjectStreams: true });
    this.updateProgress(100, "Process completed successfully.");

    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_Processed.pdf`,
      mimeType: 'application/pdf'
    };
  }
}
