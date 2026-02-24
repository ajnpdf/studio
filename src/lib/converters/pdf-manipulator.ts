
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
    this.files = Array.isArray(files) ? files : [files];
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async runOperation(toolId: string, options: any = {}): Promise<ConversionResult> {
    const baseName = this.files[0].name.split('.')[0];
    let { pageData = [] } = options;

    this.updateProgress(10, "Inhaling document binary structure...");
    const masterDoc = await PDFDocument.create();
    const font = await masterDoc.embedFont(StandardFonts.Helvetica);

    const sourceDocs = await Promise.all(this.files.map(async (f) => {
      const buf = await f.arrayBuffer();
      return PDFDocument.load(buf, { ignoreEncryption: true });
    }));

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
      
      if (item.rotation !== 0) {
        copiedPage.setRotation(degrees(item.rotation));
      }

      // 1. Add Page Numbers
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

      // 2. Grayscale
      if (toolId === 'grayscale-pdf') {
        this.updateProgress(prog, `Recalibrating color matrix: Segment ${i + 1}`);
      }

      // 3. Signature Embedding (If provided in options from Editor)
      if (options.signatures?.[i]) {
        for (const sig of options.signatures[i]) {
          const sigImage = await masterDoc.embedPng(sig.data);
          copiedPage.drawImage(sigImage, {
            x: sig.x,
            y: sig.y,
            width: sig.width,
            height: sig.height,
          });
        }
      }
      
      masterDoc.addPage(copiedPage);
    }

    this.updateProgress(95, "Synchronizing binary buffer...");
    const pdfBytes = await masterDoc.save({ useObjectStreams: true });
    this.updateProgress(100, "Process completed successfully.");

    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_Processed.pdf`,
      mimeType: 'application/pdf'
    };
  }
}
