'use client';

/**
 * AJN Master Engineering Orchestrator
 * High-fidelity logic routing for specialized binary service units.
 * Hardened for Client-Side execution only.
 */

class AJNPDFEngine {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AJN Core] orchestrator synchronized.');
  }

  async runTool(toolId: string, inputs: any, options = {}, onProgressCallback: any) {
    await this.init();
    onProgressCallback({ stage: "Calibrating", detail: "Initializing isolated thread...", pct: 5 });

    const files = Array.isArray(inputs) ? inputs : [inputs];
    const firstFile = files[0];
    if (!firstFile) throw new Error("No asset detected.");

    let result: { blob: Blob; fileName: string; mimeType: string };

    try {
      // 1. INTELLIGENCE & VISION LAYER
      if (['translate-pdf', 'ocr-pdf', 'summarize-pdf', 'compare-pdf', 'compress-pdf', 'repair-pdf'].includes(toolId)) {
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(firstFile, (p, m) => onProgressCallback({ stage: "Intelligence", detail: m, pct: p }));
        const map: Record<string, string> = { 
          'translate-pdf': 'TRANSLATE', 
          'ocr-pdf': 'OCR', 
          'summarize-pdf': 'SUMMARIZE', 
          'compare-pdf': 'COMPARE',
          'compress-pdf': 'COMPRESS',
          'repair-pdf': 'REPAIR'
        };
        result = await converter.convertTo(map[toolId], options);
      } 
      // 2. SURGICAL MANIPULATION CORE
      else if (['merge-pdf', 'split-pdf', 'extract-pages', 'delete-pages', 'rotate-pdf', 'sign-pdf', 'organize-pdf', 'protect-pdf', 'unlock-pdf', 'redact-pdf', 'flatten-pdf', 'add-page-numbers', 'grayscale-pdf'].includes(toolId)) {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Manipulation", detail: m, pct: p }));
        result = await manipulator.runOperation(toolId, options);
      }
      // 3. EXPORT CORE (PDF to X)
      else if (['pdf-jpg', 'pdf-png', 'pdf-webp', 'pdf-word', 'pdf-pptx', 'pdf-excel', 'pdf-txt', 'pdf-pdfa'].includes(toolId)) {
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(firstFile, (p, m) => onProgressCallback({ stage: "Synthesis", detail: m, pct: p }));
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
        result = await converter.convertTo(map[toolId], options);
      }
      // 4. DEVELOPMENT CORE (X to PDF)
      else if (toolId.endsWith('-pdf')) {
        const source = toolId.split('-')[0];
        if (['jpg', 'jpeg', 'png', 'webp'].includes(source!)) {
          const { ImageConverter } = await import('@/lib/converters/image-converter');
          const converter = new ImageConverter(firstFile, (p, m) => onProgressCallback({ stage: "Imagery", detail: m, pct: p }));
          result = await converter.toMasterPDF(files, options);
        } else if (source === 'word') {
          const { WordConverter } = await import('@/lib/converters/word-converter');
          result = await new WordConverter(firstFile, (p, m) => onProgressCallback({ stage: "Word", detail: m, pct: p })).convertTo('PDF');
        } else if (source === 'ppt') {
          const { PPTConverter } = await import('@/lib/converters/ppt-converter');
          result = await new PPTConverter(firstFile, (p, m) => onProgressCallback({ stage: "PowerPoint", detail: m, pct: p })).convertTo('PDF');
        } else if (source === 'excel') {
          const { ExcelConverter } = await import('@/lib/converters/excel-converter');
          result = await new ExcelConverter(firstFile, (p, m) => onProgressCallback({ stage: "Excel", detail: m, pct: p })).convertTo('PDF');
        } else {
          const { CodeConverter } = await import('@/lib/converters/code-converter');
          result = await new CodeConverter(firstFile, (p, m) => onProgressCallback({ stage: "Data", detail: m, pct: p })).convertTo('PDF', options);
        }
      } else {
        throw new Error(`Engine routing for ${toolId} not yet calibrated.`);
      }

      onProgressCallback({ stage: "Established", detail: "Binary synchronization successful.", pct: 100 });
      return { success: true, fileName: result.fileName, byteLength: result.blob.size, blob: result.blob };
    } catch (err: any) {
      console.error("[AJN Core] Execution Error:", err);
      const msg = err?.message || "Synthesis failure during binary processing.";
      throw new Error(msg);
    }
  }
}

export const engine = new AJNPDFEngine();
