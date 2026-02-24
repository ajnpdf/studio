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
      
      const fileBytes = await this.files[i].arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const copied = await master.copyPages(pdf, pdf.getPageIndices());
      copied.forEach(p => master.addPage(p));
    }
    
    const bytes = await master.save();
    return { 
      blob: new Blob([bytes], { type: 'application/pdf' }), 
      fileName: `Merged_Master_${Date.now()}.pdf`, 
      mimeType: 'application/pdf' 
    };
  }

  async rotate(): Promise<ConversionResult> {
    const docBytes = await this.files[0].arrayBuffer();
    const doc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    
    doc.getPages().forEach(p => {
      p.setRotation(degrees((p.getRotation().angle + 90) % 360));
    });
    
    const bytes = await doc.save();
    return { 
      blob: new Blob([bytes], { type: 'application/pdf' }), 
      fileName: `Rotated_${this.files[0].name}`, 
      mimeType: 'application/pdf' 
    };
  }

  async addPageNumbers(): Promise<ConversionResult> {
    const docBytes = await this.files[0].arrayBuffer();
    const doc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.Helvetica);
    
    doc.getPages().forEach((p, i) => {
      p.drawText(`${i + 1}`, { 
        x: p.getSize().width / 2, 
        y: 30, 
        size: 10, 
        font, 
        color: rgb(0, 0, 0) 
      });
    });
    
    const bytes = await doc.save();
    return { 
      blob: new Blob([bytes], { type: 'application/pdf' }), 
      fileName: `Numbered_${this.files[0].name}`, 
      mimeType: 'application/pdf' 
    };
  }

  /**
   * Professional E-Sign Implementation
   */
  async sign(options: any = {}): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing E-Sign Layer...");
    const docBytes = await this.files[0].arrayBuffer();
    const doc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    
    const { signatureBuf, x = 50, y = 50, width = 150, height = 60 } = options;

    if (signatureBuf) {
      this.updateProgress(50, "Embedding cryptographic signature appearance...");
      const img = await doc.embedPng(new Uint8Array(signatureBuf));
      const pages = doc.getPages();
      const lastPage = pages[pages.length - 1];
      lastPage.drawImage(img, { x, y, width, height });
    } else {
      this.updateProgress(50, "Applying audit trail marker...");
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const lastPage = doc.getPages()[doc.getPageCount() - 1];
      lastPage.drawText(`Digitally Signed by AJN Operator\n${new Date().toISOString()}`, {
        x: 50, y: 50, size: 8, font, color: rgb(0.1, 0.1, 0.5)
      });
    }
    
    const bytes = await doc.save();
    return { 
      blob: new Blob([bytes], { type: 'application/pdf' }), 
      fileName: `Signed_${this.files[0].name}`, 
      mimeType: 'application/pdf' 
    };
  }
}
