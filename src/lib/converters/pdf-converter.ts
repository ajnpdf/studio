'use client';

import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { ProgressCallback, ConversionResult } from './pdf-converter';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ConversionResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export type ProgressCallback = (percent: number, message: string) => void;

/**
 * AJN Neural PDF Conversion Engine
 * Domain 4: Convert From PDF (JPG & Word Mastery)
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
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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
        return this.toWord(pdf, baseName, settings);
      case 'TXT':
        return this.toText(pdf, baseName);
      default:
        throw new Error(`Format ${target} not supported in the mastered pipeline.`);
    }
  }

  /**
   * 15. PDF TO JPG (Master Specification Implementation)
   */
  private async toImages(pdf: any, baseName: string, format: string, settings: any): Promise<ConversionResult> {
    const zip = new JSZip();
    const targetDpi = settings.quality || 300;
    const quality = (settings.quality || 85) / 100;
    const mimeType = format === 'PNG' ? 'image/png' : format === 'WEBP' ? 'image/webp' : 'image/jpeg';
    const ext = format.toLowerCase();

    this.updateProgress(15, `Targeting ${targetDpi} DPI for high-fidelity rasterization...`);

    for (let i = 1; i <= pdf.numPages; i++) {
      const progBase = 15 + Math.round((i / pdf.numPages) * 80);
      this.updateProgress(progBase, `Rasterizing Page ${i}: Calculating canvas pixel dimensions...`);
      
      const page = await pdf.getPage(i);
      
      // Step 3: pixels = page_points * (target_DPI / 72)
      const scale = targetDpi / 72;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      this.updateProgress(progBase + 2, `Rendering Page ${i} to ${canvas.width}x${canvas.height} buffer...`);
      await page.render({ canvasContext: context, viewport }).promise;

      const imgData = canvas.toDataURL(mimeType, quality).split(',')[1];
      zip.file(`${baseName}_page_${String(i).padStart(3, '0')}.${ext}`, imgData, { base64: true });
    }

    this.updateProgress(95, "Packaging mastered image archive...");
    const blob = await zip.generateAsync({ type: 'blob' });
    
    return {
      blob,
      fileName: `${baseName}_Imagery_Export.zip`,
      mimeType: 'application/zip'
    };
  }

  /**
   * 16. PDF TO WORD (Master Specification Implementation)
   */
  private async toWord(pdf: any, baseName: string, settings: any): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing structural deconstruction...");
    const zip = new JSZip();
    
    let docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>`;

    for (let i = 1; i <= pdf.numPages; i++) {
      const progBase = 10 + Math.round((i / pdf.numPages) * 80);
      this.updateProgress(progBase, `Analyzing Page ${i}: Extracting text operators (BT...ET)...`);
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Step 3: Cluster text spans by Y-position into lines (tolerance ±2pt)
      const lines: any[] = [];
      textContent.items.forEach((item: any) => {
        const y = Math.round(item.transform[5] / 2) * 2; // 2pt tolerance
        let line = lines.find(l => Math.abs(l.y - y) <= 2);
        if (!line) {
          line = { y, items: [] };
          lines.push(line);
        }
        line.items.push(item);
      });

      // Step 4 & 5: Sort and Merge
      lines.sort((a, b) => b.y - a.y); // Top to bottom
      
      lines.forEach(line => {
        line.items.sort((a: any, b: any) => a.transform[4] - b.transform[4]); // Left to right
        
        this.updateProgress(progBase + 5, `Page ${i}: Reconstructing paragraph hierarchies...`);
        
        docXml += `<w:p>`;
        line.items.forEach((item: any) => {
          docXml += `
            <w:r>
              <w:rPr>
                <w:sz w:val="${Math.round(item.transform[0] * 2)}"/>
              </w:rPr>
              <w:t xml:space="preserve">${this.xmlEscape(item.str)} </w:t>
            </w:r>`;
        });
        docXml += `</w:p>`;
      });

      if (i < pdf.numPages) {
        docXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
      }
    }

    docXml += `
        <w:sectPr>
          <w:pgSz w:w="11906" w:h="16838"/>
          <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
        </w:sectPr>
      </w:body>
    </w:document>`;

    this.updateProgress(90, "Assembling OOXML binary container...");
    
    // Minimal DOCX Structure
    zip.file("word/document.xml", docXml);
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);

    const blob = await zip.generateAsync({ type: "blob" });
    this.updateProgress(100, "Mastery cycle complete.");

    return {
      blob,
      fileName: `${baseName}.docx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
  }

  private async toText(pdf: any, baseName: string): Promise<ConversionResult> {
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(' ') + '\n';
    }
    return { blob: new Blob([text]), fileName: `${baseName}.txt`, mimeType: 'text/plain' };
  }

  private xmlEscape(str: string): string {
    return str.replace(/[<>&"']/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[m] || m));
  }
}
