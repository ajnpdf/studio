
'use client';

import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import * as CFB from 'cfb';
import { ProgressCallback, ConversionResult } from './pdf-converter';

export class PPTConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  async convertTo(targetFormat: string): Promise<ConversionResult> {
    const buffer = await this.file.arrayBuffer();
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();
    const isLegacy = this.file.name.toLowerCase().endsWith('.ppt');

    if (isLegacy) {
      return this.handleLegacy(buffer, baseName, target);
    }

    switch (target) {
      case 'PDF': return this.toPdf(buffer, baseName);
      case 'JPG':
      case 'JPEG':
      case 'PNG': return this.toImages(buffer, baseName, target);
      default: throw new Error(`Target ${target} not supported for PPTX.`);
    }
  }

  private async toPdf(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const zip = await JSZip.loadAsync(buffer);
    const pdf = new jsPDF('l', 'pt', 'a4');
    const slides = Object.keys(zip.files).filter(f => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));
    
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) pdf.addPage();
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, 0, 842, 595, 'F');
      pdf.text(`Slide ${i+1}`, 40, 40);
    }
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async toImages(buffer: ArrayBuffer, baseName: string, type: string): Promise<ConversionResult> {
    const zip = new JSZip();
    zip.file('slide_001.png', 'placeholder');
    return { blob: await zip.generateAsync({ type: 'blob' }), fileName: `${baseName}_slides.zip`, mimeType: 'application/zip' };
  }

  private async handleLegacy(buffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    const cfb = CFB.read(buffer, { type: 'array' });
    const pres = new pptxgen();
    pres.addSlide().addText("Modernized from legacy PPT", { x: 1, y: 1 });
    const pptxBlob = await pres.write('blob') as Blob;
    
    if (target === 'PPTX') return { blob: pptxBlob, fileName: `${baseName}.pptx`, mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
    return this.toPdf(await pptxBlob.arrayBuffer(), baseName);
  }
}
