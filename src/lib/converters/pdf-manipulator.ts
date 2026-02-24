'use client';

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Surgical binary rewrites for document geometry and security.
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

  async merge(): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Master Buffer...");
    const master = await PDFDocument.create();
    for (let i = 0; i < this.files.length; i++) {
      const prog = 10 + Math.round((i / this.files.length) * 80);
      this.updateProgress(prog, `Merging binary stream: ${this.files[i].name}...`);
      const pdf = await PDFDocument.load(await this.files[i].arrayBuffer(), { ignoreEncryption: true });
      const copied = await master.copyPages(pdf, pdf.getPageIndices());
      copied.forEach(p => master.addPage(p));
    }
    const bytes = await master.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Merged_${Date.now()}.pdf`, mimeType: 'application/pdf' };
  }

  async removePages(options: any): Promise<ConversionResult> {
    const indicesToRemove = options.pageIndices || [];
    this.updateProgress(10, "Parsing document structure...");
    const doc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    const count = doc.getPageCount();
    const keep = [];
    for (let i = 0; i < count; i++) if (!indicesToRemove.includes(i)) keep.push(i);
    
    if (keep.length === 0) throw new Error("Synthesis aborted: No pages remaining.");

    const out = await PDFDocument.create();
    const copied = await out.copyPages(doc, keep);
    copied.forEach(p => out.addPage(p));
    
    this.updateProgress(90, "Executing surgical binary rewrite...");
    const bytes = await out.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Pruned_${this.files[0].name}`, mimeType: 'application/pdf' };
  }

  async rotate(): Promise<ConversionResult> {
    const doc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    doc.getPages().forEach(p => p.setRotation(degrees((p.getRotation().angle + 90) % 360)));
    const bytes = await doc.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Rotated.pdf`, mimeType: 'application/pdf' };
  }

  async addPageNumbers(): Promise<ConversionResult> {
    const doc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.Helvetica);
    doc.getPages().forEach((p, i) => p.drawText(`${i + 1}`, { x: p.getSize().width / 2, y: 30, size: 10, font, color: rgb(0, 0, 0) }));
    const bytes = await doc.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Numbered.pdf`, mimeType: 'application/pdf' };
  }

  async sign(signatureBuf?: ArrayBuffer): Promise<ConversionResult> {
    const doc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    if (signatureBuf) {
      const img = await doc.embedPng(new Uint8Array(signatureBuf));
      const lastPage = doc.getPages()[doc.getPageCount() - 1];
      lastPage.drawImage(img, { x: 50, y: 50, width: 150, height: 60 });
    }
    const bytes = await doc.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), fileName: `Signed.pdf`, mimeType: 'application/pdf' };
  }
}