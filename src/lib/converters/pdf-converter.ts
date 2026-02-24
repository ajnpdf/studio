'use client';

import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import pptxgen from 'pptxgenjs';
import * as XLSX from 'xlsx';

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
 * Hardened for Vertical Stitching (Single JPG Output).
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

    this.updateProgress(10, `Calibrating system for ${pdf.numPages} pages...`);

    switch (target) {
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'WEBP':
        return this.toImages(pdf, baseName, target, settings);
      case 'DOCX':
      case 'WORD':
        return this.toWord(pdf, baseName);
      case 'PPTX':
      case 'POWERPOINT':
        return this.toPowerPoint(pdf, baseName);
      case 'XLSX':
      case 'EXCEL':
        return this.toExcel(pdf, baseName);
      case 'TXT':
        return this.toText(pdf, baseName);
      default:
        throw new Error(`Format ${target} not supported.`);
    }
  }

  /**
   * PDF TO IMAGERY (Vertical Stitching Implementation)
   * Strictly returns one high-fidelity image instead of a ZIP.
   */
  private async toImages(pdf: any, baseName: string, format: string, settings: any): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Vertical Stitching Engine...");
    const scale = (settings.quality || 300) / 72;
    const mimeType = format === 'PNG' ? 'image/png' : format === 'WEBP' ? 'image/webp' : 'image/jpeg';
    const ext = format.toLowerCase();

    const pageCanvases: HTMLCanvasElement[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      const progBase = 10 + Math.round((i / pdf.numPages) * 70);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      this.updateProgress(progBase, `Rasterizing Page ${i}...`);

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      pageCanvases.push(canvas);
      totalHeight += canvas.height;
      maxWidth = Math.max(maxWidth, canvas.width);
    }

    this.updateProgress(85, "Executing Master Buffer Stitching...");
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

    this.updateProgress(95, "Synchronizing binary image stream...");
    const quality = (settings.quality || 85) / 100;
    const blob = await new Promise<Blob>((resolve) => {
      masterCanvas.toBlob((b) => resolve(b!), mimeType, quality);
    });

    return { blob, fileName: `${baseName}.${ext}`, mimeType };
  }

  private async toPowerPoint(pdf: any, baseName: string): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Presentation Reconstruction...");
    const pres = new pptxgen();
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const slide = pres.addSlide();
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
      slide.addImage({ data: canvas.toDataURL('image/jpeg', 0.9), x: 0, y: 0, w: '100%', h: '100%' });
      this.updateProgress(10 + Math.round((i / pdf.numPages) * 80), `Reconstructing Slide ${i}...`);
    }
    const blob = await pres.write({ outputType: 'blob' });
    return { blob: blob as Blob, fileName: `${baseName}.pptx`, mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
  }

  private async toWord(pdf: any, baseName: string): Promise<ConversionResult> {
    const zip = new JSZip();
    let docXml = `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>`;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = (content.items as any[]).map((it: any) => it.str).join(' ');
      docXml += `<w:p><w:r><w:t>${text}</w:t></w:r></w:p>`;
    }
    docXml += `</w:body></w:document>`;
    zip.file("word/document.xml", docXml);
    const blob = await zip.generateAsync({ type: "blob" });
    return { blob, fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }

  private async toExcel(pdf: any, baseName: string): Promise<ConversionResult> {
    const wb = XLSX.utils.book_new();
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const rows = [(content.items as any[]).map((it: any) => it.str)];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
    }
    const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return { blob: new Blob([wbOut]), fileName: `${baseName}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
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
}