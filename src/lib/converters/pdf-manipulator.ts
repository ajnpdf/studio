'use client';

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Surgical binary rewrites for document geometry, extraction, and security.
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

    if (toolId === 'extract-pages' || toolId === 'split-pdf' || toolId === 'delete-pages' || toolId === 'organize-pdf') {
      const { pageIndices = [] } = options;
      
      // Calculate final target sequence based on tool intent
      let targetIndices = pageIndices;
      
      if (toolId === 'delete-pages') {
        targetIndices = Array.from({ length: doc.getPageCount() }, (_, i) => i)
          .filter(i => !pageIndices.includes(i));
      } else if (pageIndices.length === 0) {
        // Default to all pages if visionary was bypassed or tool is 'organize'
        targetIndices = Array.from({ length: doc.getPageCount() }, (_, i) => i);
      }

      if (targetIndices.length === 0) throw new Error("No segments selected for execution.");

      this.updateProgress(40, `Surgically isolating ${targetIndices.length} segments...`);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(doc, targetIndices);
      copiedPages.forEach(p => newDoc.addPage(p));
      
      const bytes = await newDoc.save({ useObjectStreams: true });
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Mastered.pdf`, mimeType: 'application/pdf' };
    }

    if (toolId === 'sign-pdf') {
      this.updateProgress(50, "Injecting digital audit trail marker...");
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const lastPage = pages[pages.length - 1];
      
      lastPage.drawText(`Digitally Signed via AJN Neural Buffer\nTS: ${new Date().toISOString()}`, {
        x: 50, y: 50, size: 8, font, color: rgb(0.1, 0.1, 0.5)
      });
      
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `${baseName}_Signed.pdf`, mimeType: 'application/pdf' };
    }

    throw new Error(`Manipulation unit ${toolId} not yet calibrated.`);
  }

  async merge(): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Master Assembly Buffer...");
    const master = await PDFDocument.create();
    
    for (let i = 0; i < this.files.length; i++) {
      const prog = 10 + Math.round((i / this.files.length) * 80);
      this.updateProgress(prog, `Syncing binary stream: ${this.files[i].name}...`);
      const fileBytes = await this.files[i].arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const copied = await master.copyPages(pdf, pdf.getPageIndices());
      copied.forEach(p => master.addPage(p));
    }
    
    this.updateProgress(95, "Synchronizing assembly and trailer...");
    const bytes = await master.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Merged_Master_${Date.now()}.pdf`, mimeType: 'application/pdf' };
  }
}
