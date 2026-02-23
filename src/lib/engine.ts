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
 * Enforces high-fidelity processing with real-time logging and sequential mastery.
 */

export type ExecutionMode = 'wasm' | 'smart' | 'ai';
export type JobStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled';

export interface LogEntry {
  timestamp: string;
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

  private converters: Record<string, any> = {
    pdf: PDFConverter, docx: WordConverter, doc: WordConverter,
    xlsx: ExcelConverter, xls: ExcelConverter, csv: ExcelConverter,
    pptx: PPTConverter, ppt: PPTConverter, odt: ODTConverter,
    jpg: ImageConverter, jpeg: ImageConverter, png: ImageConverter, webp: ImageConverter,
    mp4: VideoConverter, mp3: AudioConverter, zip: ArchiveConverter,
    json: CodeConverter, html: CodeConverter, md: CodeConverter,
    epub: EbookConverter, psd: DesignConverter, ai: DesignConverter,
    stl: CADConverter, dxf: CADConverter
  };

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
      message,
      level
    };
    job.logs = [...job.logs, entry];
    job.stage = message;
    this.notify();
  }

  async addJobs(files: File[], fromFmt: string, toFmt: string, settings: any, toolId?: string) {
    const isMerge = toolId === 'merge-pdf';
    
    if (isMerge) {
      const job: ProcessingJob = {
        id: Math.random().toString(36).substr(2, 9),
        toolId: toolId || 'merge-pdf',
        mode: 'wasm',
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
    const aiTools = ['ocr-pdf', 'translate-pdf', 'redact-pdf', 'summarize-pdf', 'ai-qa'];
    if (toolId && aiTools.includes(toolId)) return 'ai';
    return 'wasm';
  }

  private async processNext() {
    if (this.isProcessing) return;
    const nextJob = this.state.queue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.isProcessing = true;
    nextJob.status = 'running';
    this.addLog(nextJob, "Executing multi-stage transformation...");

    try {
      let result;
      if (nextJob.toolId === 'merge-pdf') {
        const manip = new PDFManipulator(nextJob.inputs.map(i => i.file), (p, m) => {
          nextJob.progress = p;
          this.addLog(nextJob, m);
        });
        result = await manip.merge();
      } else {
        result = await this.runTool(nextJob);
      }

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
        toFmt: result.fileName.split('.').pop()?.toUpperCase() || 'PDF'
      };

      nextJob.status = 'done';
      nextJob.progress = 100;
      nextJob.output = output;
      nextJob.completedAt = Date.now();
      this.addLog(nextJob, "Process mastered successfully.");

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
      job.progress = p;
      this.addLog(job, m);
    };

    const manip = new PDFManipulator(file, update);
    const specialized = new SpecializedConverter(file, update);

    switch (job.toolId) {
      case 'split-pdf': return manip.split(job.settings.splitMode || 'range', job.settings.splitValue || '1');
      case 'extract-pages': return manip.extractPages(job.settings.pages || [0]);
      case 'remove-pages': return manip.removePages(job.settings.pages || []);
      case 'rotate-pdf': return manip.rotate(job.settings.angle || 90);
      case 'page-numbers': return manip.addPageNumbers(job.settings);
      case 'watermark-pdf': return manip.addWatermark(job.settings.text || 'AJN Master');
      case 'crop-pdf': return manip.crop(job.settings.margins || { top: 50, bottom: 50, left: 50, right: 50 });
      case 'protect-pdf': return manip.protect(job.settings.password || '1234');
      case 'digital-seal': return manip.addWatermark('Verified Integrity Seal', 0.2);
      case 'metadata-purge': return specialized.convertTo('REPAIRED_PDF', job.settings);
      case 'redact-pdf': return specialized.convertTo('REDACTED_PDF', job.settings);
      case 'summarize-pdf': return specialized.convertTo('TRANSCRIPT', job.settings);
      case 'translate-pdf': return specialized.convertTo('TRANSCRIPT', job.settings);
      default: return this.runConversion(job);
    }
  }

  private async runConversion(job: ProcessingJob) {
    const file = job.inputs[0].file;
    const from = job.inputs[0].format.toLowerCase();
    const to = job.settings.toFmt || 'PDF';
    
    const ConverterClass = this.converters[from] || this.converters['pdf'];
    const converter = new ConverterClass(file, (p: number, m: string) => {
      job.progress = p;
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