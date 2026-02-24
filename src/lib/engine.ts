'use client';

/**
 * AJN Master Engineering Orchestrator
 * High-fidelity logic routing for 30+ specialized binary service units.
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
      // 1. INTELLIGENCE LAYER (Explicit Routing)
      if (['translate-pdf', 'ocr-pdf', 'summarize-pdf', 'compare-pdf'].includes(toolId)) {
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(firstFile, (p, m) => onProgressCallback({ stage: "Intelligence", detail: m, pct: p }));
        const map: Record<string, string> = { 'translate-pdf': 'TRANSLATE', 'ocr-pdf': 'OCR', 'summarize-pdf': 'SUMMARIZE', 'compare-pdf': 'COMPARE' };
        result = await converter.convertTo(map[toolId], options);
      } 
      // 2. MERGE CORE
      else if (toolId === 'merge-pdf') {
        const { MergeConverter } = await import('@/lib/converters/merge-converter');
        const converter = new MergeConverter(files, (p, m) => onProgressCallback({ stage: "Merge", detail: m, pct: p }));
        result = await converter.merge();
      }
      // 3. SPLIT CORE
      else if (toolId === 'split-pdf') {
        const { SplitConverter } = await import('@/lib/converters/split-converter');
        const converter = new SplitConverter(firstFile, (p, m) => onProgressCallback({ stage: "Split", detail: m, pct: p }));
        result = await converter.split(options);
      }
      // 4. EXPORT CORE (PDF to X)
      else if (['pdf-jpg', 'pdf-png', 'pdf-webp', 'pdf-word', 'pdf-pptx', 'pdf-excel', 'pdf-txt'].includes(toolId)) {
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(firstFile, (p, m) => onProgressCallback({ stage: "Synthesis", detail: m, pct: p }));
        const map: Record<string, string> = { 'pdf-jpg': 'JPG', 'pdf-png': 'PNG', 'pdf-webp': 'WEBP', 'pdf-word': 'WORD', 'pdf-pptx': 'PPTX', 'pdf-excel': 'EXCEL', 'pdf-txt': 'TXT' };
        result = await converter.convertTo(map[toolId], options);
      }
      // 5. DEVELOPMENT CORE (X to PDF)
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
          result = await new CodeConverter(firstFile, (p, m) => onProgressCallback({ stage: "Data", detail: m, pct: p })).convertTo('PDF');
        }
      }
      // 6. MANIPULATION & SECURITY
      else {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Manipulation", detail: m, pct: p }));
        if (toolId === 'delete-pages') result = await manipulator.removePages(options);
        else if (toolId === 'rotate-pdf') result = await manipulator.rotate();
        else if (toolId === 'add-page-numbers') result = await manipulator.addPageNumbers();
        else if (toolId === 'sign-pdf') result = await manipulator.sign(options.signatureBuf);
        else result = await manipulator.merge();
      }

      onProgressCallback({ stage: "Established", detail: "Binary synchronization successful.", pct: 100 });
      return { success: true, fileName: result.fileName, byteLength: result.blob.size, blob: result.blob };
    } catch (err: any) {
      console.error("[AJN Core]", err);
      throw new Error(err.message || "Synthesis failure.");
    }
  }
}

export const engine = new AJNPDFEngine();
