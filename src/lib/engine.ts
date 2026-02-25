'use client';

/**
 * AJN Master Processing Engine
 * Optimized for Top 10 major professional tools.
 */

class AJNPDFEngine {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AJN Core] System synchronized.');
  }

  async runTool(toolId: string, inputs: any, options = {}, onProgressCallback: any) {
    await this.init();
    onProgressCallback({ stage: "Preparing", detail: "Initializing professional process...", pct: 5 });

    const files = Array.isArray(inputs) ? inputs : [inputs];
    let result: { blob: Blob; fileName: string; mimeType: string };

    try {
      // 1. Specialized Optimization (Compress)
      if (toolId === 'compress-pdf') {
        if (!files[0]) throw new Error("Input buffer empty.");
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(files, (p, m) => onProgressCallback({ stage: "Optimizing", detail: m, pct: p }));
        result = await converter.convertTo('COMPRESS', options);
      } 
      // 2. Surgical Binary Units (Merge, Split, Edit, Sign, Protect)
      else if (['merge-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'protect-pdf'].includes(toolId)) {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Processing", detail: m, pct: p }));
        result = await manipulator.runOperation(toolId, options);
      }
      // 3. Export Units (PDF to Word)
      else if (toolId === 'pdf-word') {
        if (!files[0]) throw new Error("No file selected.");
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(files[0], (p, m) => onProgressCallback({ stage: "Exporting", detail: m, pct: p }));
        result = await converter.convertTo('DOCX', options);
      }
      // 4. Inbound Units (Word, PPT, Excel, JPG to PDF)
      else if (toolId === 'word-pdf') {
        if (!files[0]) throw new Error("No file selected.");
        const { WordConverter } = await import('@/lib/converters/word-converter');
        const converter = new WordConverter(files[0], (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p }));
        result = await converter.convertTo('PDF');
      }
      else if (toolId === 'ppt-pdf') {
        if (!files[0]) throw new Error("No file selected.");
        const { PPTConverter } = await import('@/lib/converters/ppt-converter');
        const converter = new PPTConverter(files[0], (p, m) => onProgressCallback({ stage: "Reconstructing", detail: m, pct: p }));
        result = await converter.convertTo('PDF');
      }
      else if (toolId === 'excel-pdf') {
        if (!files[0]) throw new Error("No file selected.");
        const { ExcelConverter } = await import('@/lib/converters/excel-converter');
        const converter = new ExcelConverter(files[0], (p, m) => onProgressCallback({ stage: "Grid Processing", detail: m, pct: p }));
        result = await converter.convertTo('PDF');
      }
      else if (toolId === 'jpg-pdf') {
        if (!files[0]) throw new Error("No images selected.");
        const { ImageConverter } = await import('@/lib/converters/image-converter');
        const converter = new ImageConverter(files[0], (p, m) => onProgressCallback({ stage: "Raster Sync", detail: m, pct: p }));
        result = await converter.toMasterPDF(files, options);
      }
      else {
        throw new Error(`Tool ${toolId} calibration pending.`);
      }

      onProgressCallback({ stage: "Complete", detail: "Process finished successfully.", pct: 100 });
      return { success: true, fileName: result.fileName, byteLength: result.blob.size, blob: result.blob };
    } catch (err: any) {
      console.error("[AJN Core] Execution failure:", err);
      throw new Error(err?.message || "Internal process failure.");
    }
  }
}

export const engine = new AJNPDFEngine();
