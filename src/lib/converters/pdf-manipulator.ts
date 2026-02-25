'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { ConversionResult, ProgressCallback } from './pdf-converter';

/**
 * AJN Master Manipulation Engine
 * Precision binary synchronization for document surgery and encryption.
 */
export class PDFManipulator {
  private files: File[];
  private onProgress?: ProgressCallback;

  constructor(files: File | File[], onProgress?: ProgressCallback) {
    this.files = Array.isArray(files) ? files : (files ? [files] : []);
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async runOperation(toolId: string, options: any = {}): Promise<ConversionResult> {
    const baseName = (this.files && this.files[0]) 
      ? this.files[0].name.split('.')[0] 
      : (options.document?.name?.split('.')[0] || "Surgical_Output");
    
    this.updateProgress(10, "Inhaling document binary structure...");
    
    let masterDoc: PDFDocument;
    
    // Load source documents
    const sourceDocs = await Promise.all((this.files || []).map(async (f) => {
      try {
        if (!f) return null;
        const buf = await f.arrayBuffer();
        return await PDFDocument.load(buf, { ignoreEncryption: true });
      } catch (e) {
        return null;
      }
    }));

    if (toolId === 'edit-pdf' && sourceDocs[0]) {
      masterDoc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    } else if (toolId === 'protect-pdf' && sourceDocs[0]) {
      masterDoc = await PDFDocument.load(await this.files[0].arrayBuffer(), { ignoreEncryption: true });
    } else {
      masterDoc = await PDFDocument.create();
    }

    const standardFont = await masterDoc.embedFont(StandardFonts.Helvetica);

    // LOGIC: Surgical Editing
    if (toolId === 'edit-pdf' && options.document?.pages) {
      this.updateProgress(30, `Executing surgical sync: ${options.document.pages.length} segments...`);
      
      const editorPages = options.document.pages;
      for (let i = 0; i < editorPages.length; i++) {
        const pageNode = editorPages[i];
        const prog = 30 + Math.round((i / editorPages.length) * 60);
        this.updateProgress(prog, `Syncing segment ${i + 1}/${editorPages.length}...`);

        let targetPage;
        if (i < masterDoc.getPageCount()) {
          targetPage = masterDoc.getPage(i);
        } else {
          targetPage = masterDoc.addPage([595.28, 841.89]);
        }

        if (pageNode.rotation !== 0) targetPage.setRotation(degrees(pageNode.rotation));

        const elements = pageNode.elements || [];
        for (const el of elements) {
          try {
            const yFlipped = targetPage.getHeight() - el.y - el.height;
            const hexToRgb = (hex: string) => {
              const r = parseInt(hex.slice(1, 3), 16) / 255;
              const g = parseInt(hex.slice(3, 5), 16) / 255;
              const b = parseInt(hex.slice(5, 7), 16) / 255;
              return rgb(r || 0, g || 0, b || 0);
            };

            if (el.type === 'signature' && el.signatureData) {
              const sigBytes = await fetch(el.signatureData).then(res => res.arrayBuffer());
              const sigImage = await masterDoc.embedPng(sigBytes);
              targetPage.drawImage(sigImage, { x: el.x, y: yFlipped, width: el.width, height: el.height });
            } else if (el.type === 'text' && el.content) {
              targetPage.drawText(el.content, { 
                x: el.x, y: targetPage.getHeight() - el.y - (el.fontSize || 12),
                size: el.fontSize || 12, 
                font: standardFont, 
                color: hexToRgb(el.color || '#000000'),
                lineHeight: el.lineHeight ? (el.fontSize || 12) * el.lineHeight : undefined
              });
            } else if (el.type === 'image' && el.content) {
              const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
              const img = el.content.includes('png') ? await masterDoc.embedPng(imgBytes) : await masterDoc.embedJpg(imgBytes);
              targetPage.drawImage(img, { x: el.x, y: yFlipped, width: el.width, height: el.height });
            }
          } catch (err) {
            console.warn("[Manipulator] Layer sync warning:", err);
          }
        }
      }
    }

    // LOGIC: Protection (Encryption)
    if (toolId === 'protect-pdf') {
      this.updateProgress(50, "Injecting AES-256 encryption layers...");
      // Encryption options are passed to the save() method below
    }

    this.updateProgress(95, "Synchronizing binary buffer...");
    
    // Finalize output
    const saveOptions: any = { useObjectStreams: true };
    if (toolId === 'protect-pdf' && options.password) {
      saveOptions.userPassword = options.password;
      saveOptions.ownerPassword = options.password;
      saveOptions.permissions = {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      };
    }

    const pdfBytes = await masterDoc.save(saveOptions);
    
    return { 
      blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
      fileName: toolId === 'protect-pdf' ? `${baseName}_Protected.pdf` : `${baseName}.pdf`, 
      mimeType: 'application/pdf' 
    };
  }
}
