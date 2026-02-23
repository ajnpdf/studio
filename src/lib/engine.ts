'use client';

import { PDFConverter } from './converters/pdf-converter';
import { SpecializedConverter } from './converters/specialized-converter';
import { PDFManipulator } from './converters/pdf-manipulator';
import { ScannerConverter } from './converters/scanner-converter';
import { WordConverter } from './converters/word-converter';
import { ExcelConverter } from './converters/excel-converter';
import { PPTConverter } from './converters/ppt-converter';
import { ImageConverter } from './converters/image-converter';

export type ExecutionMode = 'WASM' | 'SMART' | 'AI';
export type JobStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled';

export interface LogEntry {
  timestamp: string;
  ms: number;
  message: string;
  level: 'info' | 'warn' | 'error';
}

export interface FileNode {
  id: string;
  name: string;
  size: number;
  format: string;
  sha256: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  file: File;
}

export interface OutputBuffer {
  id: string;
  jobId: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeFormatted: string;
  objectUrl: string;
  completedAt: number;
  toFmt: string;
  stats: {
    originalSize: string;
    reduction: string;
    time: string;
  };
}

export interface ProcessingJob {
  id: string;
  toolId: string;
  mode: ExecutionMode;
  status: JobStatus;
  progress: number;
  stage: string;
  logs: LogEntry[];
  inputs: FileNode[];
  output: OutputBuffer | null;
  settings: any;
  startedAt: Date;
}

export interface GlobalAppState {
  files: FileNode[];
  queue: ProcessingJob[];
  outputs: OutputBuffer[];
  network: 'online' | 'offline' | 'degraded';
  stats: { totalMastered: number; };
}

class SystemEngine {
  private state: GlobalAppState = {
    files: [], queue: [], outputs: [], network: 'online', stats: { totalMastered: 0 }
  };

  private isProcessing: boolean = false;
  private listeners: Set<(state: GlobalAppState) => void> = new Set();

  subscribe(listener: (state: GlobalAppState) => void) {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  private async generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private addLog(job: ProcessingJob, message: string, level: LogEntry['level'] = 'info') {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      ms: Date.now() - job.startedAt.getTime(),
      message,
      level
    };
    job.logs = [...job.logs, entry];
    job.stage = message;
    this.notify();
  }

  async addJobs(files: File[], fromFmt: string, toFmt: string, settings: any, toolId?: string) {
    for (const file of files) {
      const hash = await this.generateHash(file);
      const jobKey = `${hash}_${toolId || 'convert'}_${Date.now()}`;

      const fileNode: FileNode = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNK',
        sha256: hash,
        status: 'idle',
        file
      };

      const job: ProcessingJob = {
        id: jobKey,
        toolId: toolId || 'converter',
        mode: this.determineMode(toolId),
        status: 'queued',
        progress: 0,
        stage: 'Initial Calibration...',
        logs: [],
        inputs: [fileNode],
        output: null,
        settings,
        startedAt: new Date()
      };

      this.state.files.unshift(fileNode);
      this.state.queue = [...this.state.queue, job];
    }

    this.notify();
    this.processNext();
  }

  private determineMode(toolId?: string): ExecutionMode {
    const aiTools = [
      'ocr-pdf', 'translate-pdf', 'summarize-pdf', 
      'pdf-excel', 'pdf-pptx', 'compare-pdf', 
      'repair-pdf', 'categorize-file'
    ];
    if (toolId && aiTools.includes(toolId)) return 'AI';
    return 'WASM';
  }

  private async processNext() {
    if (this.isProcessing) return;
    const nextJob = this.state.queue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.isProcessing = true;
    nextJob.status = 'running';
    this.addLog(nextJob, `Loading ${nextJob.mode} engine architecture...`);

    try {
      const startTime = Date.now();
      const result = await this.runTool(nextJob);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const originalSize = nextJob.inputs.reduce((sum, f) => sum + f.size, 0);
      const reduction = Math.max(0, Math.round(((originalSize - result.blob.size) / originalSize) * 100));

      const objectUrl = URL.createObjectURL(result.blob);
      const output: OutputBuffer = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: nextJob.id,
        blob: result.blob,
        fileName: `${result.fileName}`,
        mimeType: result.mimeType,
        sizeFormatted: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
        objectUrl,
        completedAt: Date.now(),
        toFmt: result.fileName.split('.').pop()?.toUpperCase() || 'PDF',
        stats: {
          originalSize: (originalSize / (1024 * 1024)).toFixed(2) + ' MB',
          reduction: `${reduction}%`,
          time: `${duration}s`
        }
      };

      nextJob.status = 'done';
      nextJob.progress = 100;
      this.state.outputs.unshift(output);
      this.state.stats.totalMastered++;
    } catch (err: any) {
      nextJob.status = 'failed';
      this.addLog(nextJob, err.message || 'System Pipeline Fault', 'error');
    } finally {
      this.isProcessing = false;
      this.state.queue = this.state.queue.filter(j => j.id !== nextJob.id);
      this.notify();
      this.processNext();
    }
  }

  private async runTool(job: ProcessingJob) {
    const files = job.inputs.map(i => i.file);
    const update = (p: number, m: string) => {
      job.progress = Math.min(p, 99);
      this.addLog(job, m);
    };

    // Instantiate respective Master Service Units
    const manip = new PDFManipulator(files, update);
    const specialized = new SpecializedConverter(files[0], update);
    const scanner = new ScannerConverter(files, update);
    const pdfConv = new PDFConverter(files[0], update);
    const wordConv = new WordConverter(files[0], update);
    const excelConv = new ExcelConverter(files[0], update);
    const pptConv = new PPTConverter(files[0], update);
    const imgConv = new ImageConverter(files[0], update);

    switch (job.toolId) {
      // Domain 1: Organize
      case 'merge-pdf': return manip.merge();
      case 'split-pdf': return manip.split(job.settings);
      case 'organize-pdf': return manip.organize(job.settings.permutation || []);
      case 'scan-pdf': return scanner.process(job.settings);

      // Domain 2: Optimize
      case 'compress-pdf': return manip.compress(job.settings);
      case 'repair-pdf': return manip.repair(job.settings);
      case 'ocr-pdf': return specialized.convertTo('OCR', job.settings);

      // Domain 3: Convert TO PDF
      case 'word-pdf': return wordConv.convertTo('PDF', job.settings);
      case 'excel-pdf': return excelConv.convertTo('PDF', job.settings);
      case 'ppt-pdf': return pptConv.convertTo('PDF', job.settings);
      case 'jpg-pdf': return imgConv.toMasterPDF(files, job.settings);
      case 'html-pdf': return specialized.convertTo('HTML_PDF', job.settings);

      // Domain 4: Convert FROM PDF
      case 'pdf-jpg': return pdfConv.convertTo('JPG', job.settings);
      case 'pdf-word': return pdfConv.convertTo('WORD', job.settings);
      case 'pdf-pptx': return pdfConv.convertTo('PPTX', job.settings);
      case 'pdf-excel': return pdfConv.convertTo('EXCEL', job.settings);
      case 'pdf-pdfa': return manip.toPDFA(job.settings.conformance || '2b');

      // Domain 5: Edit
      case 'rotate-pdf': return manip.rotate(job.settings.rotationMap || {});
      case 'add-page-numbers': return manip.addPageNumbers(job.settings);
      
      // Domain 6: Security
      case 'unlock-pdf': return manip.unlock(job.settings.password);
      case 'protect-pdf': return manip.protect(job.settings);
      case 'sign-pdf': return manip.sign(job.settings.signatureData, job.settings.position);
      case 'redact-pdf': return manip.redact(job.settings.redactions || []);

      // Domain 7: Intelligence
      case 'translate-pdf': return specialized.convertTo('TRANSLATE', job.settings);
      case 'compare-pdf': return specialized.convertTo('COMPARE', job.settings);

      default: 
        return pdfConv.convertTo(job.settings.toFmt || 'PDF', job.settings);
    }
  }

  cancelJob(id: string) {
    const job = this.state.queue.find(j => j.id === id);
    if (job) { job.status = 'cancelled'; this.notify(); }
  }

  clearQueue() {
    this.state.outputs.forEach(o => URL.revokeObjectURL(o.objectUrl));
    this.state.outputs = [];
    this.state.files = [];
    this.notify();
  }
}

export const engine = new SystemEngine();