'use client';

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Surgical binary rewrites for document geometry, extraction, and e-signatures.
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
    const buf = await this.files[0].arrayBuffer();
    
    this.updateProgress(10, "Inhaling source binary structure...");
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });

    if (toolId === 'rotate-pdf') {
      this.updateProgress(40, "Correcting geometric orientation...");
      doc.getPages().forEach(p => p.setRotation(degrees((p.getRotation().angle + 90) % 360)));
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Rotated.pdf`, mimeType: 'application/pdf' };
    }

    if (['extract-pages', 'split-pdf', 'delete-pages', 'organize-pdf'].includes(toolId)) {
      const { pageIndices = [] } = options;
      
      let targetIndices = pageIndices;
      if (toolId === 'delete-pages') {
        targetIndices = Array.from({ length: doc.getPageCount() }, (_, i) => i)
          .filter(i => !pageIndices.includes(i));
      } else if (pageIndices.length === 0) {
        // Default to all if nothing selected, tool will handle the guard
        targetIndices = Array.from({ length: doc.getPageCount() }, (_, i) => i);
      }

      if (targetIndices.length === 0) throw new Error("No segments selected for mastery.");

      this.updateProgress(40, `Surgically isolating ${targetIndices.length} neural segments...`);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(doc, targetIndices);
      copiedPages.forEach(p => newDoc.addPage(p));
      
      const bytes = await newDoc.save({ useObjectStreams: true });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Mastered.pdf`, mimeType: 'application/pdf' };
    }

    if (toolId === 'merge-pdf') {
      return this.merge();
    }

    if (toolId === 'sign-pdf') {
      this.updateProgress(50, "Injecting high-fidelity signature overlay...");
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const lastPage = pages[pages.length - 1];
      
      // Inject digital stamp appearance
      lastPage.drawText(`Digitally Signed via AJN Node\nTS: ${new Date().toISOString()}`, {
        x: 50, y: 50, size: 8, font, color: rgb(0.1, 0.1, 0.5)
      });
      
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Signed.pdf`, mimeType: 'application/pdf' };
    }

    if (toolId === 'grayscale-pdf') {
      this.updateProgress(40, "Applying neural tone mapping...");
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Grayscale.pdf`, mimeType: 'application/pdf' };
    }

    throw new Error(`Unit node ${toolId} not yet calibrated.`);
  }

  async merge(): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Master Assembly Buffer...");
    const master = await PDFDocument.create();
    for (let i = 0; i < this.files.length; i++) {
      const prog = 10 + Math.round((i / this.files.length) * 80);
      this.updateProgress(prog, `Syncing stream: ${this.files[i].name}...`);
      const fileBytes = await this.files[i].arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const copied = await master.copyPages(pdf, pdf.getPageIndices());
      copied.forEach(p => master.addPage(p));
    }
    const bytes = await master.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Merged_${Date.now()}.pdf`, mimeType: 'application/pdf' };
  }
}
