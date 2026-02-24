'use client';

import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ConversionResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export type ProgressCallback = (percent: number, message: string) => void;

/**
 * AJN Neural PDF Conversion Engine
 * Hardened for Vertical Stitching (Single Image Output).
 */
export class PDFConverter {
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
    const arrayBuffer = await this.file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();

    this.updateProgress(10, `Calibrating for ${pdf.numPages} segments...`);

    switch (target) {
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'WEBP':
        return this.toImages(pdf, baseName, target, settings);
      case 'DOCX':
        return this.toWord(pdf, baseName);
      case 'PPTX':
        return this.toPowerPoint(pdf, baseName);
      case 'XLSX':
        return this.toExcel(pdf, baseName);
      case 'TXT':
        return this.toText(pdf, baseName);
      case 'PDFA':
        return this.toPdfA(pdf, baseName);
      default:
        throw new Error(`Format ${target} not supported.`);
    }
  }

  private async toImages(pdf: any, baseName: string, format: string, settings: any): Promise<ConversionResult> {
    this.updateProgress(15, "Initializing Vertical Stitching Engine...");
    const scale = (settings.quality || 300) / 72;
    const mimeType = format === 'PNG' ? 'image/png' : format === 'WEBP' ? 'image/webp' : 'image/jpeg';
    const ext = format.toLowerCase();

    const pageCanvases: HTMLCanvasElement[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      const progBase = 15 + Math.round((i / pdf.numPages) * 70);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      this.updateProgress(progBase, `Rasterizing segment ${i}...`);

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      pageCanvases.push(canvas);
      totalHeight += canvas.height;
      maxWidth = Math.max(maxWidth, canvas.width);
    }

    this.updateProgress(85, "Stitching Master Buffer...");
    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = maxWidth;
    masterCanvas.height = totalHeight;
    const masterCtx = masterCanvas.getContext('2d')!;
    masterCtx.fillStyle = '#FFFFFF';
    masterCtx.fillRect(0, 0, maxWidth, totalHeight);

    let currentY = 0;
    for (const canvas of pageCanvases) {
      masterCtx.drawImage(canvas, (maxWidth - canvas.width) / 2, currentY);
      currentY += canvas.height;
    }

    const quality = (settings.quality || 85) / 100;
    const blob = await new Promise<Blob>((resolve) => {
      masterCanvas.toBlob((b) => resolve(b!), mimeType, quality);
    });

    return { blob, fileName: `${baseName}.${ext}`, mimeType };
  }

  private async toPowerPoint(pdf: any, baseName: string): Promise<ConversionResult> {
    const { PPTConverter } = await import('./ppt-converter');
    return new PPTConverter(this.file, this.onProgress).convertTo('PDF');
  }

  private async toWord(pdf: any, baseName: string): Promise<ConversionResult> {
    const { WordConverter } = await import('./word-converter');
    return new WordConverter(this.file, this.onProgress).convertTo('PDF');
  }

  private async toExcel(pdf: any, baseName: string): Promise<ConversionResult> {
    const { ExcelConverter } = await import('./excel-converter');
    return new ExcelConverter(this.file, this.onProgress).convertTo('PDF');
  }

  private async toText(pdf: any, baseName: string): Promise<ConversionResult> {
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += (content.items as any[]).map((it: any) => it.str).join(' ') + '\n';
    }
    return { blob: new Blob([text]), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private async toPdfA(pdf: any, baseName: string): Promise<ConversionResult> {
    const { PDFDocument } = await import('pdf-lib');
    const bytes = await this.file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    doc.setTitle(`${baseName} (Archived)`);
    const out = await doc.save();
    return { blob: new Blob([out], { type: 'application/pdf' }), fileName: `${baseName}_PDFA.pdf`, mimeType: 'application/pdf' };
  }
}
