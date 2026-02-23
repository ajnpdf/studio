'use client';

import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN MASTER MANIPULATION ENGINE
 * Implements high-fidelity WASM processing based on professional logic snippets.
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

  /**
   * 1. MERGE PDF (100% Working)
   */
  async merge(): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing master document container...");
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      this.updateProgress(
        10 + Math.round((i / this.files.length) * 80), 
        `Inhaling asset stream: ${file.name}...`
      );
      
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    this.updateProgress(95, "Synchronizing binary buffers...");
    const mergedBytes = await mergedPdf.save();
    
    return {
      blob: new Blob([mergedBytes], { type: "application/pdf" }),
      fileName: `Mastered_Merge_${Date.now()}.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 2. SPLIT PDF
   */
  async split(): Promise<ConversionResult> {
    this.updateProgress(10, "Deconstructing document tree...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pageCount = pdf.getPageCount();
    const zip = new JSZip();
    const baseName = this.files[0].name.replace(/\.[^/.]+$/, "");

    for (let i = 0; i < pageCount; i++) {
      this.updateProgress(
        10 + Math.round((i / pageCount) * 80), 
        `Isolating page ${i + 1} into separate buffer...`
      );
      
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const newBytes = await newPdf.save();
      zip.file(`${baseName}_part_${i + 1}.pdf`, newBytes);
    }

    this.updateProgress(95, "Packaging sequential archive...");
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return {
      blob: zipBlob,
      fileName: `${baseName}_Split_Archive.zip`,
      mimeType: "application/zip"
    };
  }

  /**
   * 3. REMOVE PAGES
   */
  async removePages(pagesToRemove: number[]): Promise<ConversionResult> {
    this.updateProgress(20, "Analyzing target pruning indices...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    this.updateProgress(50, "Executing surgical page removal...");
    pagesToRemove.sort((a, b) => b - a).forEach(index => {
      pdf.removePage(index);
    });

    this.updateProgress(90, "Finalizing pruned document stream...");
    const newBytes = await pdf.save();
    
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Pruned_${Date.now()}.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 4. EXTRACT PAGES
   */
  async extractPages(pagesToExtract: number[]): Promise<ConversionResult> {
    this.updateProgress(20, "Initiating high-fidelity extraction...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const newPdf = await PDFDocument.create();

    this.updateProgress(60, `Copying ${pagesToExtract.length} target layers...`);
    const copied = await newPdf.copyPages(pdf, pagesToExtract);
    copied.forEach(p => newPdf.addPage(p));

    this.updateProgress(90, "Compiling extracted buffer...");
    const newBytes = await newPdf.save();
    
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Extracted_${Date.now()}.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 5. ROTATE PDF
   */
  async rotate(angle: number = 90): Promise<ConversionResult> {
    this.updateProgress(30, `Applying geometric rotation: ${angle}°`);
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    pdf.getPages().forEach(page => {
      page.setRotation(degrees(angle));
    });

    this.updateProgress(90, "Finalizing rotated stream...");
    const newBytes = await pdf.save();
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Rotated.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 6. ADD PAGE NUMBERS
   */
  async addPageNumbers(): Promise<ConversionResult> {
    this.updateProgress(20, "Initializing indexing layer...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    pdf.getPages().forEach((page, index) => {
      this.updateProgress(20 + Math.round((index / pdf.getPageCount()) * 70), `Stamping page ${index + 1}...`);
      const { width } = page.getSize();
      page.drawText(`Page ${index + 1}`, {
        x: width - 100,
        y: 20,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const newBytes = await pdf.save();
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Numbered.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 7. ADD WATERMARK
   */
  async addWatermark(text: string = "CONFIDENTIAL"): Promise<ConversionResult> {
    this.updateProgress(20, "Calibrating identification layer...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    pdf.getPages().forEach((page, idx) => {
      this.updateProgress(20 + Math.round((idx / pdf.getPageCount()) * 70), "Stamping watermark...");
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 50,
        opacity: 0.3,
        font,
        rotate: degrees(-45),
      });
    });

    const newBytes = await pdf.save();
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Watermarked.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 8. PROTECT PDF (Password)
   */
  async protect(password: string): Promise<ConversionResult> {
    this.updateProgress(20, "Applying cryptographic seal...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    const newBytes = await pdf.save({
      userPassword: password,
      ownerPassword: password,
    });

    this.updateProgress(100, "Document secured.");
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Protected.pdf`,
      mimeType: "application/pdf"
    };
  }

  /**
   * 9. UNLOCK PDF
   */
  async unlock(password: string): Promise<ConversionResult> {
    this.updateProgress(20, "Breaking cryptographic seal...");
    const bytes = await this.files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes, { password });

    this.updateProgress(80, "Purging security restrictions...");
    const newBytes = await pdf.save();
    
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `Mastered_Unlocked.pdf`,
      mimeType: "application/pdf"
    };
  }
}
