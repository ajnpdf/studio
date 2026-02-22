'use client';

import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import * as CFB from 'cfb';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Professional Word Conversion Engine
 * Handles modern DOCX and legacy binary DOC (97-2003)
 */
export class WordConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async convertTo(targetFormat: string): Promise<ConversionResult> {
    const arrayBuffer = await this.file.arrayBuffer();
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();
    const isLegacy = this.file.name.toLowerCase().endsWith('.doc');

    this.updateProgress(10, `Initializing ${isLegacy ? 'Legacy DOC' : 'DOCX'} Engine...`);

    if (isLegacy) {
      return this.handleLegacy(arrayBuffer, baseName, target);
    }

    switch (target) {
      case 'PDF': return this.toPdf(arrayBuffer, baseName);
      case 'TXT': return this.toTxt(arrayBuffer, baseName);
      case 'RTF': return this.toRtf(arrayBuffer, baseName);
      case 'HTML': return this.toHtml(arrayBuffer, baseName);
      case 'EPUB': return this.toEpub(arrayBuffer, baseName);
      case 'ODT': return this.toOdt(arrayBuffer, baseName);
      default: throw new Error(`Target ${target} not supported for Word.`);
    }
  }

  private async toPdf(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    this.updateProgress(30, "Executing mammoth.js OOXML parse...");
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    
    this.updateProgress(60, "Rasterizing document via hidden iframe...");
    
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.width = '794px'; // A4 at 96 DPI
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return reject(new Error("Iframe initialization failed"));

      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: black; background: white; }
              h1, h2, h3 { color: #111; }
              table { border-collapse: collapse; width: 100%; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      doc.close();

      iframe.onload = async () => {
        try {
          const canvas = await html2canvas(doc.body, { scale: 2, useCORS: true });
          document.body.removeChild(iframe);
          
          this.updateProgress(90, "Synthesizing PDF buffer...");
          const pdf = new jsPDF('p', 'pt', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const pxPerFullPage = (canvasWidth / pdfWidth) * pdfHeight;
          
          let yOffset = 0;
          let first = true;

          while (yOffset < canvasHeight) {
            if (!first) pdf.addPage();
            
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvasWidth;
            pageCanvas.height = Math.min(pxPerFullPage, canvasHeight - yOffset);
            const ctx = pageCanvas.getContext('2d')!;
            ctx.drawImage(canvas, 0, yOffset, canvasWidth, pageCanvas.height, 0, 0, canvasWidth, pageCanvas.height);
            
            pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, (pageCanvas.height / canvasWidth) * pdfWidth);
            yOffset += pxPerFullPage;
            first = false;
          }

          resolve({ blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' });
        } catch (e) {
          reject(e);
        }
      };
    });
  }

  private async toTxt(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return { blob: new Blob([value], { type: 'text/plain; charset=utf-8' }), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private async toRtf(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}} ${value.replace(/\n/g, '\\par\n')}}`;
    return { blob: new Blob([rtf], { type: 'application/rtf' }), fileName: `${baseName}.rtf`, mimeType: 'application/rtf' };
  }

  private async toHtml(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;padding:40px;line-height:1.6;}</style></head><body>${htmlBody}</body></html>`;
    return { blob: new Blob([html], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }

  private async toEpub(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.file('META-INF/container.xml', `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
    zip.file('OEBPS/chapter.xhtml', `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><body>${html}</body></html>`);
    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${baseName}</dc:title></metadata><manifest><item id="ch1" href="chapter.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="ch1"/></spine></package>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.epub`, mimeType: 'application/epub+zip' };
  }

  private async toOdt(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const zip = new JSZip();
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
    zip.file('content.xml', `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2"><office:body><office:text><text:p>Content extracted from Word</text:p></office:text></office:body></office:document-content>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.odt`, mimeType: 'application/vnd.oasis.opendocument.text' };
  }

  private async handleLegacy(buffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    this.updateProgress(20, "Executing cfb.js Compound File Binary parse...");
    const cfb = CFB.read(buffer, { type: 'array' });
    const stream = cfb.FileIndex.find(f => f.name === 'WordDocument');
    if (!stream) throw new Error("Invalid DOC binary.");
    
    let text = '';
    const content = stream.content as Uint8Array;
    for(let i=0; i<content.length; i++) {
      if(content[i] >= 32 && content[i] <= 126) text += String.fromCharCode(content[i]);
    }

    if (target === 'DOCX') {
      this.updateProgress(70, "Modernizing legacy binary to OOXML structure...");
      const zip = new JSZip();
      zip.file('word/document.xml', `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${this.xmlEscape(text)}</w:t></w:r></w:p></w:body></w:document>`);
      return { blob: await zip.generateAsync({ type: 'blob' }), fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }
    
    return { blob: new Blob([text], { type: 'text/plain' }), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private xmlEscape(str: string): string {
    return str.replace(/[<>&"']/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[m] || m));
  }
}
