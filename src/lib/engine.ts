'use client';

/**
 * AJN Master Processing Engine
 * Professional routing for Top 10 major PDF tools.
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
      // 1. Advanced Specialized Units (Compress, Repair, OCR, Compare)
      if (['compress-pdf', 'repair-pdf', 'ocr-pdf', 'compare-pdf'].includes(toolId)) {
        if (!files[0]) throw new Error("Input buffer empty.");
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(files, (p, m) => onProgressCallback({ stage: "Executing", detail: m, pct: p }));
        
        const map: Record<string, string> = { 
          'compress-pdf': 'COMPRESS',
          'repair-pdf': 'REPAIR',
          'ocr-pdf': 'OCR',
          'compare-pdf': 'COMPARE'
        };
        result = await converter.convertTo(map[toolId], options);
      } 
      // 2. Surgical Binary Units (Merge, Split, Edit, Sign, Protect)
      else if (['merge-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'protect-pdf'].includes(toolId)) {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Processing", detail: m, pct: p }));
        result = await manipulator.runOperation(toolId, options);
      }
      // 3. High-Fidelity Export Units (PDF to Word)
      else if (toolId === 'pdf-word') {
        if (!files[0]) throw new Error("No file selected.");
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(files[0], (p, m) => onProgressCallback({ stage: "Exporting", detail: m, pct: p }));
        result = await converter.convertTo('DOCX', options);
      }
      // 4. Inbound Logic (Word to PDF)
      else if (toolId === 'word-pdf') {
        if (!files[0]) throw new Error("No file selected.");
        const { WordConverter } = await import('@/lib/converters/word-converter');
        const converter = new WordConverter(files[0], (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p }));
        result = await converter.convertTo('PDF');
      }
      else {
        throw new Error(`Tool ${toolId} is in standard skip mode.`);
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