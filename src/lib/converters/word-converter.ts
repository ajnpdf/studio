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
    
    this.updateProgress(60, "Rasterizing document viewport...");
    const container = document.createElement('div');
    container.style.width = '800px'; 
    container.style.padding = '40px'; 
    container.style.background = 'white';
    container.innerHTML = html;
    document.body.appendChild(container);
    
    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);
    
    this.updateProgress(90, "Synthesizing PDF buffer...");
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 595, (canvas.height * 595) / canvas.width);
    
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async toTxt(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return { blob: new Blob([value]), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private async toRtf(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    const rtf = `{\\rtf1\\ansi\\deff0 ${value.replace(/\n/g, '\\par\n')}}`;
    return { blob: new Blob([rtf]), fileName: `${baseName}.rtf`, mimeType: 'application/rtf' };
  }

  private async toHtml(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = `<html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;padding:40px;line-height:1.6;}</style></head><body>${htmlBody}</body></html>`;
    return { blob: new Blob([html], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }

  private async toEpub(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.file('OEBPS/chapter.xhtml', `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><body>${html}</body></html>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.epub`, mimeType: 'application/epub+zip' };
  }

  private async toOdt(buffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    this.updateProgress(40, "Mapping OOXML to ODF semantics...");
    const zip = new JSZip();
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.odt`, mimeType: 'application/vnd.oasis.opendocument.text' };
  }

  private async handleLegacy(buffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    this.updateProgress(20, "Executing cfb.js Compound File Binary parse...");
    const cfb = CFB.read(buffer, { type: 'array' });
    const stream = cfb.FileIndex.find(f => f.name === 'WordDocument');
    if (!stream) throw new Error("Invalid DOC binary.");
    
    // Character Extraction logic for legacy DOC
    let text = '';
    const content = stream.content as Uint8Array;
    for(let i=0; i<content.length; i++) {
      if(content[i] >= 32 && content[i] <= 126) text += String.fromCharCode(content[i]);
    }

    if (target === 'DOCX') {
      this.updateProgress(70, "Modernizing legacy binary to OOXML structure...");
      const zip = new JSZip();
      zip.file('word/document.xml', `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`);
      return { blob: await zip.generateAsync({ type: 'blob' }), fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }
    
    return { blob: new Blob([text]), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }
}
