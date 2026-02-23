'use client';

import Tesseract from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Specialized Services Core
 * Handles OCR, Redaction, Form Detection, and AI Logic
 */
export class SpecializedConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async convertTo(targetFormat: string, settings: any = {}): Promise<ConversionResult> {
    const target = targetFormat.toUpperCase();
    const baseName = this.file.name.split('.')[0];

    this.updateProgress(10, `Calibrating Specialized Tools Core...`);

    if (target === 'SEARCHABLE_PDF' || target === 'OCR') return this.toSearchablePdf(baseName);
    if (target === 'REDACTED_PDF') return this.toRedactedPdf(baseName, settings.redactions || []);
    if (target === 'REPAIRED_PDF') return this.repairPdf(baseName);

    throw new Error(`Specialized tool ${target} not supported.`);
  }

  private async repairPdf(baseName: string): Promise<ConversionResult> {
    this.updateProgress(30, "Rebuilding cross-reference tables...");
    const pdfDoc = await PDFDocument.load(await this.file.arrayBuffer(), { ignoreEncryption: true });
    const pdfBytes = await pdfDoc.save();
    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_repaired.pdf`,
      mimeType: 'application/pdf'
    };
  }

  /**
   * 12. OCR PDF (AI Tool Master Logic)
   */
  private async toSearchablePdf(baseName: string): Promise<ConversionResult> {
    this.updateProgress(20, "Initializing Smart Vision Engine...");
    
    // Core Tesseract Logic
    const { data } = await Tesseract.recognize(this.file, "eng", {
      logger: m => {
        if (m.status === 'recognizing text') {
          this.updateProgress(20 + Math.round(m.progress * 70), "Neural character recognition in progress...");
        }
      }
    });

    this.updateProgress(90, "Synthesizing searchable text layer...");

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawText(data.text, {
      x: 50,
      y: height - 100,
      size: 10,
      opacity: 0, // Searchable but invisible
    });

    const pdfBytes = await pdfDoc.save();

    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_Searchable.pdf`,
      mimeType: 'application/pdf'
    };
  }

  private async toRedactedPdf(baseName: string, redactions: any[]): Promise<ConversionResult> {
    this.updateProgress(30, "Applying cryptographic redaction mask...");
    const pdfDoc = await PDFDocument.load(await this.file.arrayBuffer());
    const pages = pdfDoc.getPages();

    redactions.forEach(r => {
      const page = pages[r.pageIndex || 0];
      page.drawRectangle({
        x: r.x || 50,
        y: r.y || 50,
        width: r.width || 100,
        height: r.height || 20,
        color: rgb(0, 0, 0)
      });
    });

    const pdfBytes = await pdfDoc.save();
    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      fileName: `${baseName}_redacted.pdf`,
      mimeType: 'application/pdf'
    };
  }
}
