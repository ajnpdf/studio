'use client';

/**
 * AJN Master Processing Engine
 * Professional routing for file services.
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
    onProgressCallback({ stage: "Preparing", detail: "Initializing process...", pct: 5 });

    const files = Array.isArray(inputs) ? inputs : [inputs];
    const firstFile = files[0];
    if (!firstFile) throw new Error("No file selected.");

    let result: { blob: Blob; fileName: string; mimeType: string };

    try {
      // 1. ADVANCED SERVICES
      if (['translate-pdf', 'ocr-pdf', 'summarize-pdf', 'compare-pdf', 'compress-pdf', 'repair-pdf'].includes(toolId)) {
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(firstFile, (p, m) => onProgressCallback({ stage: "Analyzing", detail: m, pct: p }));
        
        const map: Record<string, string> = { 
          'translate-pdf': 'TRANSLATE', 
          'ocr-pdf': 'OCR', 
          'summarize-pdf': 'SUMMARIZE', 
          'compare-pdf': 'COMPARE',
          'compress-pdf': 'COMPRESS',
          'repair-pdf': 'REPAIR'
        };
        result = await converter.convertTo(map[toolId] || 'OCR', options);
      } 
      // 2. DOCUMENT TOOLS
      else if (['merge-pdf', 'split-pdf', 'extract-pages', 'delete-pages', 'rotate-pdf', 'sign-pdf', 'organize-pdf', 'protect-pdf', 'unlock-pdf', 'redact-pdf', 'flatten-pdf', 'add-page-numbers', 'grayscale-pdf'].includes(toolId)) {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Processing", detail: m, pct: p }));
        result = await manipulator.runOperation(toolId, options);
      }
      // 3. EXPORT TOOLS
      else if (['pdf-jpg', 'pdf-png', 'pdf-webp', 'pdf-word', 'pdf-pptx', 'pdf-excel', 'pdf-txt', 'pdf-pdfa'].includes(toolId)) {
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(firstFile, (p, m) => onProgressCallback({ stage: "Exporting", detail: m, pct: p }));
        
        const map: Record<string, string> = { 
          'pdf-jpg': 'JPG', 
          'pdf-png': 'PNG', 
          'pdf-webp': 'WEBP', 
          'pdf-word': 'DOCX', 
          'pdf-pptx': 'PPTX', 
          'pdf-excel': 'XLSX', 
          'pdf-txt': 'TXT',
          'pdf-pdfa': 'PDFA'
        };
        result = await converter.convertTo(map[toolId] || 'JPG', options);
      }
      // 4. CONVERSION TOOLS
      else if (toolId.endsWith('-pdf')) {
        const source = toolId.split('-')[0];
        if (['jpg', 'jpeg', 'png', 'webp'].includes(source!)) {
          const { ImageConverter } = await import('@/lib/converters/image-converter');
          const converter = new ImageConverter(firstFile, (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p }));
          result = await converter.toMasterPDF(files, options);
        } else if (source === 'word') {
          const { WordConverter } = await import('@/lib/converters/word-converter');
          result = await new WordConverter(firstFile, (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p })).convertTo('PDF');
        } else if (source === 'ppt') {
          const { PPTConverter } = await import('@/lib/converters/ppt-converter');
          result = await new PPTConverter(firstFile, (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p })).convertTo('PDF');
        } else if (source === 'excel') {
          const { ExcelConverter } = await import('@/lib/converters/excel-converter');
          result = await new ExcelConverter(firstFile, (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p })).convertTo('PDF');
        } else {
          const { CodeConverter } = await import('@/lib/converters/code-converter');
          result = await new CodeConverter(firstFile, (p, m) => onProgressCallback({ stage: "Converting", detail: m, pct: p })).convertTo('PDF', options);
        }
      } else {
        throw new Error(`Tool ${toolId} is not available.`);
      }

      onProgressCallback({ stage: "Ready", detail: "File processed successfully.", pct: 100 });
      return { success: true, fileName: result.fileName, byteLength: result.blob.size, blob: result.blob };
    } catch (err: any) {
      console.error("[AJN Core] Processing error:", err);
      const msg = err?.message || "Failed to process the file.";
      throw new Error(msg);
    }
  }
}

export const engine = new AJNPDFEngine();
