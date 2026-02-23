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
import { ScannerConverter } from './converters/scanner-converter';

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
  startedAt: Date;
  completedAt?: Date;
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
      const jobKey = `${hash}_${toolId || 'convert'}_${toFmt}_${Date.now()}`;

      const fileNode: FileNode = {
        id: Math.random().toString(36).substring(7),
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
        startedAt: new Date()
      };

      this.state.files.unshift(fileNode);
      this.state.queue = [...this.state.queue, job];
    }

    this.notify();
    this.processNext();
  }

  private determineMode(toolId?: string): ExecutionMode {
    const aiTools = ['ocr-pdf', 'translate-pdf', 'summarize-pdf', 'pdf-excel', 'pdf-pptx'];
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
    const files = job.inputs.map(i => i.file);
    const update = (p: number, m: string) => {
      job.progress = Math.min(p, 99);
      this.addLog(job, m);
    };

    const manip = new PDFManipulator(files, update);
    const specialized = new SpecializedConverter(files[0], update);
    const pdfConv = new PDFConverter(files[0], update);

    switch (job.toolId) {
      case 'rotate-pdf': return manip.rotate(job.settings.rotationMap || {});
      case 'add-page-numbers': return manip.addPageNumbers(job.settings);
      case 'pdf-pdfa': return manip.toPDFA(job.settings.conformance);
      case 'merge-pdf': return manip.merge();
      case 'split-pdf': return manip.split(job.settings);
      case 'ocr-pdf': return specialized.convertTo('OCR', job.settings);
      case 'compress-pdf': return manip.compress(job.settings);
      case 'repair-pdf': return manip.repair(job.settings);
      default: return pdfConv.convertTo(job.settings.toFmt || 'PDF', job.settings);
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
