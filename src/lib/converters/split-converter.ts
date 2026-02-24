'use client';

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Split Engine
 * Surgical binary extraction for document decomposition.
 */
export class SplitConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async split(options: any = {}): Promise<ConversionResult> {
    const { mode = 'fixed', value = 1, filename } = options;
    const baseName = this.file.name.split('.')[0];

    this.updateProgress(10, "Inhaling source binary structure...");
    const buf = await this.file.arrayBuffer();
    const sourceDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
    const totalPages = sourceDoc.getPageCount();

    this.updateProgress(20, `Decomposing ${totalPages} pages into neural segments...`);

    const zip = new JSZip();
    let documentsCreated = 0;

    if (mode === 'fixed') {
      // Split every X pages
      const interval = Math.max(1, parseInt(value));
      for (let i = 0; i < totalPages; i += interval) {
        const prog = 20 + Math.round((i / totalPages) * 70);
        this.updateProgress(prog, `Synthesizing segment ${documentsCreated + 1}...`);

        const newDoc = await PDFDocument.create();
        const indices = [];
        for (let j = i; j < Math.min(i + interval, totalPages); j++) {
          indices.push(j);
        }

        const copiedPages = await newDoc.copyPages(sourceDoc, indices);
        copiedPages.forEach(p => newDoc.addPage(p));

        const bytes = await newDoc.save();
        zip.file(`${baseName}_Part_${documentsCreated + 1}.pdf`, bytes);
        documentsCreated++;
      }
    } else {
      // Manual Range Extraction (Simplified for prototype)
      this.updateProgress(50, "Executing range-specific extraction...");
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
      copiedPages.forEach(p => newDoc.addPage(p));
      const bytes = await newDoc.save();
      return {
        blob: new Blob([bytes], { type: 'application/pdf' }),
        fileName: `${baseName}_Extracted.pdf`,
        mimeType: 'application/pdf'
      };
    }

    this.updateProgress(95, "Finalizing archive package...");
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });

    return {
      blob: zipBlob,
      fileName: `${baseName}_Split_Archive.zip`,
      mimeType: 'application/zip'
    };
  }
}
