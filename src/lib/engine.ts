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
      // 1. INTELLIGENCE & SPECIALIZED LAYER
      if (['translate-pdf', 'ocr-pdf', 'summarize-pdf', 'compare-pdf'].includes(toolId)) {
        const { SpecializedConverter } = await import('@/lib/converters/specialized-converter');
        const converter = new SpecializedConverter(firstFile, (p, m) => onProgressCallback({ stage: "Intelligence", detail: m, pct: p }));
        const map: Record<string, string> = { 
          'translate-pdf': 'TRANSLATE', 
          'ocr-pdf': 'OCR', 
          'summarize-pdf': 'SUMMARIZE', 
          'compare-pdf': 'COMPARE' 
        };
        result = await converter.convertTo(map[toolId], options);
      } 
      // 2. MERGE CORE
      else if (toolId === 'merge-pdf') {
        const { MergeConverter } = await import('@/lib/converters/merge-converter');
        const converter = new MergeConverter(files, (p, m) => onProgressCallback({ stage: "Merge", detail: m, pct: p }));
        result = await converter.merge();
      }
      // 3. SPLIT & EXTRACTION CORE
      else if (toolId === 'split-pdf' || toolId === 'extract-pages' || toolId === 'delete-pages') {
        const { SplitConverter } = await import('@/lib/converters/split-converter');
        const converter = new SplitConverter(firstFile, (p, m) => onProgressCallback({ stage: "Split", detail: m, pct: p }));
        
        if (toolId === 'delete-pages') {
          const buf = await firstFile.arrayBuffer();
          const { PDFDocument } = await import('pdf-lib');
          const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
          const allIndices = Array.from({ length: pdf.getPageCount() }, (_, i) => i);
          const keepIndices = allIndices.filter(i => !options.pageIndices?.includes(i));
          result = await converter.split({ ...options, pageIndices: keepIndices });
        } else {
          result = await converter.split(options);
        }
      }
      // 4. EXPORT CORE (PDF to X)
      else if (['pdf-jpg', 'pdf-png', 'pdf-webp', 'pdf-word', 'pdf-pptx', 'pdf-excel', 'pdf-txt'].includes(toolId)) {
        const { PDFConverter } = await import('@/lib/converters/pdf-converter');
        const converter = new PDFConverter(firstFile, (p, m) => onProgressCallback({ stage: "Synthesis", detail: m, pct: p }));
        const map: Record<string, string> = { 
          'pdf-jpg': 'JPG', 
          'pdf-png': 'PNG', 
          'pdf-webp': 'WEBP', 
          'pdf-word': 'DOCX', 
          'pdf-pptx': 'PPTX', 
          'pdf-excel': 'XLSX', 
          'pdf-txt': 'TXT' 
        };
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
          result = await new CodeConverter(firstFile, (p, m) => onProgressCallback({ stage: "Data", detail: m, pct: p })).convertTo('PDF', options);
        }
      }
      // 6. MANIPULATION & SECURITY
      else {
        const { PDFManipulator } = await import('@/lib/converters/pdf-manipulator');
        const manipulator = new PDFManipulator(files, (p, m) => onProgressCallback({ stage: "Manipulation", detail: m, pct: p }));
        
        if (toolId === 'rotate-pdf') result = await manipulator.rotate();
        else if (toolId === 'add-page-numbers') result = await manipulator.addPageNumbers();
        else if (toolId === 'sign-pdf') result = await manipulator.sign(options);
        else result = await manipulator.merge();
      }

      onProgressCallback({ stage: "Established", detail: "Binary synchronization successful.", pct: 100 });
      return { success: true, fileName: result.fileName, byteLength: result.blob.size, blob: result.blob };
    } catch (err: any) {
      console.error("[AJN Core] Execution Error:", err);
      // Fallback for undefined error objects
      const msg = err?.message || "Synthesis failure during binary processing.";
      throw new Error(msg);
    }
  }
}

export const engine = new AJNPDFEngine();
