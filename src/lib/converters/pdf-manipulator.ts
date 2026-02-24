'use client';

import { PDFDocument, degrees, rgb } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Precision binary synchronization for document surgery.
 * Hardened for real-time professional use (Rotate, Reorder, Extract, Sign, Redact).
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
    const baseName = this.files[0].name.split('.')[0];
    const { pageData = [] } = options;

    this.updateProgress(10, "Inhaling source binary streams...");
    const masterDoc = await PDFDocument.create();

    // Mapping source files to PDF objects
    const sourceDocs = await Promise.all(this.files.map(async (f) => {
      const buf = await f.arrayBuffer();
      return PDFDocument.load(buf, { ignoreEncryption: true });
    }));

    if (pageData.length > 0) {
      this.updateProgress(30, `Executing surgical binary reorder: ${pageData.length} nodes...`);
      
      for (let i = 0; i < pageData.length; i++) {
        const item = pageData[i];
        const prog = 30 + Math.round((i / pageData.length) * 60);
        this.updateProgress(prog, `Syncing node ${i + 1} with rotation ${item.rotation}°...`);

        const sourceDoc = sourceDocs[item.fileIdx];
        const [copiedPage] = await masterDoc.copyPages(sourceDoc, [item.pageIdx]);
        
        if (item.rotation !== 0) {
          copiedPage.setRotation(degrees(item.rotation));
        }

        // TOOL SPECIFIC SURGERY
        if (toolId === 'redact-pdf' && !options.selectedIndices?.includes(i)) {
          // If redact tool is used, unselected pages are masked
          const { width, height } = copiedPage.getSize();
          copiedPage.drawRectangle({
            x: 0, y: 0, width, height,
            color: rgb(0, 0, 0),
            opacity: 1
          });
        }

        if (toolId === 'sign-pdf' && i === pageData.length - 1) {
          // Add signature appearance to last page
          copiedPage.drawText("Digitally Signed via AJN", {
            x: 50, y: 50, size: 10, color: rgb(0, 0, 0.5)
          });
        }
        
        masterDoc.addPage(copiedPage);
      }
    } else {
      // Default fallback: sync all
      for (let i = 0; i < sourceDocs.length; i++) {
        const doc = sourceDocs[i];
        const indices = doc.getPageIndices();
        const copied = await masterDoc.copyPages(doc, indices);
        copied.forEach(p => masterDoc.addPage(p));
      }
    }

    this.updateProgress(95, "Synchronizing binary buffer and finalizing document trailer...");
    
    const pdfBytes = await masterDoc.save({
      useObjectStreams: true,
      addDefaultPage: false
    });

    this.updateProgress(100, "Mastery execution successful.");

    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_Mastered.pdf`,
      mimeType: 'application/pdf'
    };
  }
}
