'use client';

import { PDFConverter } from './converters/pdf-converter';
import { WordConverter } from './converters/word-converter';
import { ExcelConverter } from './converters/excel-converter';
import { PPTConverter } from './converters/ppt-converter';
import { ODTConverter } from './converters/odt-converter';
import { ImageConverter } from './converters/image-converter';
import { VideoConverter } from './converters/video-converter';
import { AudioConverter } from './converters/audio-converter';
import { ArchiveConverter } from './converters/archive-converter';
import { CodeConverter } from './converters/code-converter';
import { EbookConverter } from './converters/ebook-converter';
import { DesignConverter } from './converters/design-converter';
import { CADConverter } from './converters/cad-converter';
import { SpecializedConverter } from './converters/specialized-converter';
import { PDFManipulator } from './converters/pdf-manipulator';

/**
 * AJN MASTER ARCHITECTURE — CORE ENGINE
 * Stateful workflow orchestrator managing 45+ tools.
 */

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
  originalName: string;
  size: number;
  format: string;
  sha256: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  uploadedAt: number;
  file: File;
}

export interface OutputBuffer {
  id: string;
  jobId: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  objectUrl: string;
  checksum: string;
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
  startedAt: number;
  completedAt?: number;
}

export interface GlobalAppState {
  files: FileNode[];
  queue: ProcessingJob[];
  outputs: OutputBuffer[];
  network: 'online' | 'offline' | 'degraded';
  stats: {
    totalMastered: number;
  };
}

class SystemEngine {
  private state: GlobalAppState = {
    files: [],
    queue: [],
    outputs: [],
    network: 'online',
    stats: { totalMastered: 0 }
  };

  private isProcessing: boolean = false;
  private listeners: Set<(state: GlobalAppState) => void> = new Set();
  private processedHashes: Set<string> = new Set();

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
      ms: Date.now() - job.startedAt,
      message,
      level
    };
    job.logs = [...job.logs, entry];
    job.stage = message;
    this.notify();
  }

  async addJobs(files: File[], fromFmt: string, toFmt: string, settings: any, toolId?: string) {
    const isMerge = toolId === 'merge-pdf' || toolId === 'merge';
    
    if (isMerge) {
      const job: ProcessingJob = {
        id: Math.random().toString(36).substr(2, 9),
        toolId: toolId || 'merge-pdf',
        mode: 'WASM',
        status: 'queued',
        progress: 0,
        stage: 'Calibrating Assembly System...',
        logs: [],
        inputs: [],
        output: null,
        settings,
        startedAt: Date.now()
      };

      for (const file of files) {
        const hash = await this.generateHash(file);
        job.inputs.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          originalName: file.name,
          size: file.size,
          format: file.name.split('.').pop()?.toUpperCase() || 'UNK',
          sha256: hash,
          status: 'idle',
          uploadedAt: Date.now(),
          file
        });
      }

      this.state.queue = [...this.state.queue, job];
      this.addLog(job, "Assembly sequence verified.");
      this.processNext();
      return;
    }

    for (const file of files) {
      const hash = await this.generateHash(file);
      const jobKey = `${hash}_${toolId || 'convert'}_${toFmt}`;

      if (this.processedHashes.has(jobKey)) continue;

      const fileNode: FileNode = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        originalName: file.name,
        size: file.size,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNK',
        sha256: hash,
        status: 'idle',
        uploadedAt: Date.now(),
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
        startedAt: Date.now()
      };

      this.processedHashes.add(jobKey);
      this.state.files.unshift(fileNode);
      this.state.queue = [...this.state.queue, job];
      this.addLog(job, `System initialized for ${file.name}`);
    }

    this.notify();
    this.processNext();
  }

  private determineMode(toolId?: string): ExecutionMode {
    const aiTools = ['ocr-pdf', 'translate-pdf', 'redact-pdf', 'summarize-pdf', 'ai-qa', 'sign-pdf', 'sign'];
    if (toolId && aiTools.includes(toolId)) return 'AI';
    return 'WASM';
  }

  private async processNext() {
    if (this.isProcessing) return;
    const nextJob = this.state.queue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.isProcessing = true;
    nextJob.status = 'running';
    this.addLog(nextJob, `Loading ${nextJob.mode} engine module...`);

    try {
      let result;
      const startTime = Date.now();

      if (nextJob.toolId === 'merge-pdf' || nextJob.toolId === 'merge') {
        const manip = new PDFManipulator(nextJob.inputs.map(i => i.file), (p, m) => {
          nextJob.progress = Math.min(p, 99);
          this.addLog(nextJob, m);
        });
        result = await manip.merge();
      } else {
        result = await this.runTool(nextJob);
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const originalSize = nextJob.inputs.reduce((sum, f) => sum + f.size, 0);
      const reduction = Math.max(0, Math.round(((originalSize - result.blob.size) / originalSize) * 100));

      const objectUrl = URL.createObjectURL(result.blob);
      const output: OutputBuffer = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: nextJob.id,
        blob: result.blob,
        fileName: result.fileName.startsWith('Mastered_') ? result.fileName : `Mastered_${result.fileName}`,
        mimeType: result.mimeType,
        size: result.blob.size,
        sizeFormatted: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
        objectUrl,
        checksum: nextJob.id,
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
      nextJob.output = output;
      nextJob.completedAt = Date.now();
      this.addLog(nextJob, "Mastery cycle complete.");

      this.state.outputs.unshift(output);
      this.state.stats.totalMastered++;
    } catch (err: any) {
      nextJob.status = 'failed';
      this.addLog(nextJob, err.message || 'System Fault', 'error');
    } finally {
      this.isProcessing = false;
      this.state.queue = this.state.queue.filter(j => j.id !== nextJob.id);
      this.notify();
      this.processNext();
    }
  }

  private async runTool(job: ProcessingJob) {
    const file = job.inputs[0].file;
    const update = (p: number, m: string) => {
      job.progress = Math.min(p, 99);
      this.addLog(job, m);
    };

    const manip = new PDFManipulator(file, update);
    const specialized = new SpecializedConverter(file, update);
    const pdfConv = new PDFConverter(file, update);
    const imgConv = new ImageConverter(file, update);

    switch (job.toolId) {
      case 'split-pdf':
      case 'split': return manip.split();
      case 'extract-pages':
      case 'extract': return manip.extractPages(job.settings.pages || [0]);
      case 'remove-pages':
      case 'remove': return manip.removePages(job.settings.pages || []);
      case 'rotate-pdf':
      case 'rotate': return manip.rotate(job.settings.angle || 90);
      case 'page-numbers':
      case 'pagenums': return manip.addPageNumbers();
      case 'watermark-pdf':
      case 'watermark': return manip.addWatermark(job.settings.text || 'AJN Master');
      case 'protect-pdf':
      case 'protect': return manip.protect(job.settings.password || '1234');
      case 'unlock-pdf':
      case 'unlock': return manip.unlock(job.settings.password || '');
      case 'pdf-jpg':
      case 'pdf2jpg': return pdfConv.convertTo('JPG', job.settings);
      case 'jpg-pdf':
      case 'jpg2pdf': return imgConv.convertTo('PDF', job.settings);
      case 'ocr-pdf':
      case 'ocr': return specialized.convertTo('OCR', job.settings);
      case 'redact-pdf':
      case 'redact': return specialized.convertTo('REDACTED_PDF', job.settings);
      default: return this.runConversion(job);
    }
  }

  private async runConversion(job: ProcessingJob) {
    const file = job.inputs[0].file;
    const from = job.inputs[0].format.toLowerCase();
    const to = job.settings.toFmt || 'PDF';
    
    // Dynamic routing to appropriate class
    let ConverterClass;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(from)) ConverterClass = ImageConverter;
    else if (from === 'pdf') ConverterClass = PDFConverter;
    else if (['docx', 'doc'].includes(from)) ConverterClass = WordConverter;
    else if (['xlsx', 'xls', 'csv'].includes(from)) ConverterClass = ExcelConverter;
    else if (['pptx', 'ppt'].includes(from)) ConverterClass = PPTConverter;
    else ConverterClass = PDFConverter;

    const converter = new ConverterClass(file, (p: number, m: string) => {
      job.progress = Math.min(p, 99);
      this.addLog(job, m);
    });
    return await converter.convertTo(to, job.settings);
  }

  cancelJob(id: string) {
    const job = this.state.queue.find(j => j.id === id);
    if (job) { job.status = 'cancelled'; this.notify(); }
  }

  clearQueue() {
    this.state.outputs.forEach(o => URL.revokeObjectURL(o.objectUrl));
    this.state.outputs = [];
    this.state.files = [];
    this.processedHashes.clear();
    this.notify();
  }
}

export const engine = new SystemEngine();
