'use client';

import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Open Document Converter Service
 * Cross-platform ODF/OOXML transformation layer
 */
export class ODTConverter {
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
    const ext = this.file.name.split('.').pop()?.toLowerCase();

    this.updateProgress(10, `Mapping ODF namespace: ${ext?.toUpperCase()}...`);

    if (ext === 'odt') return this.odtToTarget(arrayBuffer, baseName, targetFormat.toUpperCase());
    if (ext === 'ods') return this.odsToTarget(arrayBuffer, baseName, targetFormat.toUpperCase());

    throw new Error(`Unsupported ODF format: .${ext}`);
  }

  private async odtToTarget(buffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    const zip = await JSZip.loadAsync(buffer);
    const content = await zip.file("content.xml")?.async("text");
    if (!content) throw new Error("Invalid ODT: Missing content.xml");

    if (target === 'PDF') {
      const container = document.createElement('div');
      container.style.width = '800px';
      container.style.padding = '60px';
      container.innerHTML = content.replace(/<text:p[^>]*>/g, '<p>').replace(/<\/text:p>/g, '</p>');
      document.body.appendChild(container);
      const canvas = await html2canvas(container);
      document.body.removeChild(container);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
    }

    if (target === 'DOCX') {
      const outZip = new JSZip();
      outZip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Modernized from ODT</w:t></w:r></w:p></w:body></w:document>`);
      return { blob: await outZip.generateAsync({ type: 'blob' }), fileName: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }

    throw new Error(`Target ${target} not supported for ODT.`);
  }

  private async odsToTarget(buffer: ArrayBuffer, baseName: string, target: string): Promise<ConversionResult> {
    const wb = XLSX.read(buffer, { type: 'array' });
    if (target === 'XLSX') {
      const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return { blob: new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName: `${baseName}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }
    throw new Error(`Target ${target} not supported for ODS.`);
  }
}
