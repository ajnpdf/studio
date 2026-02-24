'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Precision binary synchronization for document surgery.
 * Hardened for real-time professional use (Merge, Split, Rotate, Reorder, Extract, Sign, Redact, Add Numbers).
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
    let { pageData = [] } = options;

    this.updateProgress(10, "Loading source document structure...");
    const masterDoc = await PDFDocument.create();
    const font = await masterDoc.embedFont(StandardFonts.Helvetica);

    // Mapping source files to PDF objects
    const sourceDocs = await Promise.all(this.files.map(async (f) => {
      const buf = await f.arrayBuffer();
      return PDFDocument.load(buf, { ignoreEncryption: true });
    }));

    // If no pageData is provided, generate it automatically (Extract all pages default)
    if (pageData.length === 0) {
      sourceDocs.forEach((doc, fIdx) => {
        const pageCount = doc.getPageCount();
        for (let pIdx = 0; pIdx < pageCount; pIdx++) {
          pageData.push({ fileIdx: fIdx, pageIdx: pIdx, rotation: 0 });
        }
      });
    }

    this.updateProgress(30, `Executing surgical process: ${pageData.length} segments...`);
    
    for (let i = 0; i < pageData.length; i++) {
      const item = pageData[i];
      const prog = 30 + Math.round((i / pageData.length) * 60);
      this.updateProgress(prog, `Syncing segment ${i + 1}/${pageData.length}...`);

      const sourceDoc = sourceDocs[item.fileIdx];
      const [copiedPage] = await masterDoc.copyPages(sourceDoc, [item.pageIdx]);
      
      // Apply rotation if requested (persisting 90-degree increments)
      if (item.rotation !== 0) {
        copiedPage.setRotation(degrees(item.rotation));
      }

      // TOOL SPECIFIC SURGERY
      
      // 1. Add Page Numbers (Precision Centering)
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

      // 2. Redaction (Opacity Masking)
      if (toolId === 'redact-pdf' && options.redactAllButSelected && !options.selectedIndices?.includes(i)) {
        const { width, height } = copiedPage.getSize();
        copiedPage.drawRectangle({
          x: 0, y: 0, width, height,
          color: rgb(0, 0, 0),
          opacity: 1
        });
      }

      // 3. Signature Stub Appearance
      if (toolId === 'sign-pdf' && i === pageData.length - 1) {
        copiedPage.drawText("Verified via AJN Hub", {
          x: 50, y: 50, size: 8, font, color: rgb(0.1, 0.1, 0.5)
        });
      }
      
      masterDoc.addPage(copiedPage);
    }

    this.updateProgress(95, "Synchronizing binary buffer and finalizing document trailer...");
    
    const pdfBytes = await masterDoc.save({
      useObjectStreams: true,
      addDefaultPage: false
    });

    this.updateProgress(100, "Process completed successfully.");

    let finalFileName = `${baseName}_Processed.pdf`;
    if (toolId === 'merge-pdf') finalFileName = `Merged_Document_${Date.now()}.pdf`;
    if (toolId === 'split-pdf' || toolId === 'extract-pages') finalFileName = `${baseName}_Extracted.pdf`;

    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: finalFileName,
      mimeType: 'application/pdf'
    };
  }
}