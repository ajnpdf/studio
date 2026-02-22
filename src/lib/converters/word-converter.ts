'use client';

import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import * as CFB from 'cfb';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Word Converter Service
 * Handles DOCX and Legacy DOC transformations
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
      case 'HTML':
        return this.docxToHtml(arrayBuffer, baseName);
      case 'RTF':
        return this.docxToRtf(arrayBuffer, baseName);
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
    
    // Legacy DOC extraction is limited in browser
    // We focus on text extraction as the primary reliable path
    const text = this.extractTextFromCfb(cfb);

    switch (target) {
      case 'TXT':
        return {
          blob: new Blob([text], { type: 'text/plain; charset=utf-8' }),
          fileName: `${baseName}.txt`,
          mimeType: 'text/plain'
        };
      case 'DOCX':
        return this.docToDocx(text, baseName);
      case 'PDF':
        return this.textToPdf(text, baseName);
      case 'HTML':
        return this.textToHtml(text, baseName);
      default:
        throw new Error(`Target format ${target} not supported for Legacy DOC in-browser.`);
    }
  }

  private extractTextFromCfb(cfb: CFB.CFB$Container): string {
    // Try to find the WordDocument stream
    const wordStream = cfb.FileIndex.find(f => f.name === 'WordDocument');
    if (!wordStream || !wordStream.content) {
      throw new Error("Could not locate WordDocument stream in legacy file.");
    }
    
    // In legacy DOC, text is usually in the latter part of the stream
    // This is a simplified extraction for browser environment
    const content = wordStream.content as Uint8Array;
    let text = "";
    // Skip FIB (usually first 512 bytes)
    for (let i = 512; i < content.length; i++) {
      const charCode = content[i];
      // Basic ASCII/UTF filter
      if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
        text += String.fromCharCode(charCode);
      }
    }
    return text.replace(/\r\n/g, '\n').trim();
  }

  private async docxToPdf(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    this.updateProgress(30, "Extracting document layers...");
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    
    this.updateProgress(50, "Rendering to virtual neural canvas...");
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.color = 'black';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = `<style>
      body { font-family: 'Inter', sans-serif; line-height: 1.6; }
      h1, h2, h3 { margin-top: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
      table { border-collapse: collapse; width: 100%; margin: 1em 0; }
      td, th { border: 1px solid #ddd; padding: 8px; }
      img { max-width: 100%; height: auto; }
    </style>${html}`;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    this.updateProgress(90, "Finalizing PDF structure...");
    return {
      blob: pdf.output('blob'),
      fileName: `${baseName}.pdf`,
      mimeType: 'application/pdf'
    };
  }

  private async docxToTxt(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    return {
      blob: new Blob([text], { type: 'text/plain; charset=utf-8' }),
      fileName: `${baseName}.txt`,
      mimeType: 'text/plain'
    };
  }

  private async docxToHtml(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body { max-width: 800px; margin: 40px auto; font-family: sans-serif; line-height: 1.6; padding: 0 20px; }
      table { border-collapse: collapse; width: 100%; }
      td, th { border: 1px solid #ccc; padding: 8px; }
    </style></head><body>${html}</body></html>`;
    
    return {
      blob: new Blob([fullHtml], { type: 'text/html' }),
      fileName: `${baseName}.html`,
      mimeType: 'text/html'
    };
  }

  private async docxToRtf(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}}\\f0\\fs24 ${text.replace(/\n/g, '\\par\n')}}`;
    return {
      blob: new Blob([rtf], { type: 'application/rtf' }),
      fileName: `${baseName}.rtf`,
      mimeType: 'application/rtf'
    };
  }

  private async docxToEpub(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    const zip = new JSZip();
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    zip.file('META-INF/container.xml', `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${baseName}</dc:title><dc:language>en</dc:language></metadata><manifest><item id="chap1" href="chapter1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="chap1"/></spine></package>`);
    zip.file('OEBPS/chapter1.xhtml', `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${baseName}</title></head><body>${html}</body></html>`);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.epub`, mimeType: 'application/epub+zip' };
  }

  private async docxToOdt(arrayBuffer: ArrayBuffer, baseName: string): Promise<ConversionResult> {
    // Best-effort ODT creation via XML transformation stub
    const zip = new JSZip();
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
    zip.file('content.xml', `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"><office:body><office:text><text:p>Converted from DOCX</text:p></office:text></office:body></office:document-content>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.odt`, mimeType: 'application/vnd.oasis.opendocument.text' };
  }

  private async docToDocx(text: string, baseName: string): Promise<ConversionResult> {
    this.updateProgress(50, "Synthesizing modern OOXML structure...");
    const zip = new JSZip();
    // Simplified DOCX structure
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }

  private async textToPdf(text: string, baseName: string): Promise<ConversionResult> {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 15, 15);
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async textToHtml(text: string, baseName: string): Promise<ConversionResult> {
    const html = `<!DOCTYPE html><html><body><pre>${text}</pre></body></html>`;
    return { blob: new Blob([html], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }
}
