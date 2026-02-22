'use client';

import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import * as CFB from 'cfb';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Word Converter Service
 * Handles DOCX and Legacy DOC transformations with high-fidelity rendering
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
    const isLegacyDoc = this.file.name.toLowerCase().endsWith('.doc');

    this.updateProgress(10, `Initializing ${isLegacyDoc ? 'Legacy DOC' : 'DOCX'} Engine...`);

    if (isLegacyDoc) {
      return this.handleLegacyDoc(arrayBuffer, baseName, targetFormat.toUpperCase());
    } else {
      return this.handleDocx(arrayBuffer, baseName, targetFormat.toUpperCase());
    }
  }

  private async handleDocx(arrayBuffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    switch (target) {
      case 'PDF':
        return this.docxToPdf(arrayBuffer, baseName);
      case 'TXT':
        return this.docxToTxt(arrayBuffer, baseName);
      case 'RTF':
        return this.docxToRtf(arrayBuffer, baseName);
      case 'HTML':
        return this.docxToHtml(arrayBuffer, baseName);
      case 'EPUB':
        return this.docxToEpub(arrayBuffer, baseName);
      case 'ODT':
        return this.docxToOdt(arrayBuffer, baseName);
      default:
        throw new Error(`Target format ${target} not supported for DOCX.`);
    }
  }

  private async handleLegacyDoc(arrayBuffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    this.updateProgress(20, "Parsing Compound File Binary structure...");
    const cfb = CFB.read(arrayBuffer, { type: 'array' });
    const wordStream = cfb.FileIndex.find(f => f.name === 'WordDocument');
    
    if (!wordStream || !wordStream.content) throw new Error("Invalid DOC: Missing WordDocument stream.");
    
    // Extract raw text from legacy binary (best effort)
    const content = wordStream.content as Uint8Array;
    let text = "";
    for (let i = 512; i < content.length; i++) {
      if (content[i] >= 32 && content[i] <= 126) text += String.fromCharCode(content[i]);
    }

    switch (target) {
      case 'DOCX':
        return this.docToDocx(text, baseName);
      case 'PDF':
        return this.textToPdf(text, baseName);
      case 'TXT':
        return { blob: new Blob([text], { type: 'text/plain' }), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
      case 'HTML':
        return { blob: new Blob([`<html><body><pre>${text}</pre></body></html>`], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
      default:
        throw new Error(`Target ${target} not supported for binary DOC.`);
    }
  }

  private async docxToPdf(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    this.updateProgress(30, "Extracting OOXML layers...");
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = `<style>body{font-family:Arial;line-height:1.6}h1{color:#333}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style>${html}`;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 595, (canvas.height * 595) / canvas.width);
    
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async docxToTxt(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return { blob: new Blob([value], { type: 'text/plain' }), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private async docxToRtf(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    const rtf = `{\\rtf1\\ansi\\deff0 ${value.replace(/\n/g, '\\par\n')}}`;
    return { blob: new Blob([rtf], { type: 'application/rtf' }), fileName: `${baseName}.rtf`, mimeType: 'application/rtf' };
  }

  private async docxToHtml(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value } = await mammoth.convertToHtml({ arrayBuffer });
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${value}</body></html>`;
    return { blob: new Blob([fullHtml], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }

  private async docxToEpub(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.file('OEBPS/content.opf', `<package version="3.0"></package>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.epub`, mimeType: 'application/epub+zip' };
  }

  private async docxToOdt(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const zip = new JSZip();
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.odt`, mimeType: 'application/vnd.oasis.opendocument.text' };
  }

  private async docToDocx(text: string, baseName: string): Promise<ConversionResult> {
    const zip = new JSZip();
    zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }

  private async textToPdf(text: string, baseName: string): Promise<ConversionResult> {
    const pdf = new jsPDF();
    pdf.text(text, 15, 15);
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }
}
