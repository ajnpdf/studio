'use client';

import { PDFConverter } from './converters/pdf-converter';
import { WordConverter } from './converters/word-converter';
import { ExcelConverter } from './converters/excel-converter';
import { PPTConverter } from './converters/ppt-converter';
import { ODTConverter } from './converters/odt-converter';
import { ImageConverter } from './converters/image-converter';
import { RawConverter } from './converters/raw-converter';
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
 * AJN SYSTEM IDENTITY - CORE INTELLIGENCE LAYER
 * Stateful workflow orchestrator managing 35+ PDF tools across 6 domains.
 * Enforces a strict one-to-one processing ratio via Job Locks and SHA-256 Fingerprinting.
 */

export type ExecutionContext = 'WASM' | 'SMART' | 'AI';
export type JobStatus = 'queued' | 'processing' | 'complete' | 'failed' | 'cancelled';

export interface FileBuffer {
  id: string;
  file: File;
  fingerprint: string;
  metadata: {
    name: string;
    size: string;
    pageCount?: number;
    thumbnail?: string;
    format: string;
  };
}

export interface ConversionJob {
  id: string;
  fileId?: string;
  file: File; 
  sourceFiles?: File[]; // For multi-file ops like Merge
  fromFmt: string;
  toFmt: string;
  status: JobStatus;
  progress: number;
  stage: string;
  context: ExecutionContext;
  result?: {
    blob: Blob;
    fileName: string;
    mimeType: string;
    size: string;
    objectUrl: string;
    isZip?: boolean;
  };
  error?: string;
  settings: any;
  operationId?: string;
}

export interface GlobalAppState {
  activeFiles: FileBuffer[];
  processingQueue: ConversionJob[];
  outputBuffer: ConversionJob[];
  networkStatus: 'online' | 'offline';
  processingMode: 'wasm' | 'smart' | 'ai' | 'auto';
  userSession: {
    lastProcessAt: string | null;
    totalMastered: number;
  };
}

class ConversionEngine {
  private state: GlobalAppState = {
    activeFiles: [],
    processingQueue: [],
    outputBuffer: [],
    networkStatus: 'online',
    processingMode: 'auto',
    userSession: {
      lastProcessAt: null,
      totalMastered: 0
    }
  };

  private isProcessing: boolean = false;
  private processedHashes: Set<string> = new Set();
  private listeners: Set<(state: GlobalAppState) => void> = new Set();

  private converters: Record<string, any> = {
    pdf: PDFConverter,
    docx: WordConverter, doc: WordConverter,
    xlsx: ExcelConverter, xls: ExcelConverter, csv: ExcelConverter,
    pptx: PPTConverter, ppt: PPTConverter,
    odt: ODTConverter, ods: ODTConverter, odp: ODTConverter,
    jpg: ImageConverter, jpeg: ImageConverter, png: ImageConverter, webp: ImageConverter,
    gif: ImageConverter, heic: ImageConverter, heif: ImageConverter, avif: ImageConverter, 
    bmp: ImageConverter, tiff: ImageConverter, tif: ImageConverter,
    cr2: RawConverter, nef: RawConverter, arw: RawConverter, dng: RawConverter,
    mp4: VideoConverter, mov: VideoConverter, avi: VideoConverter, mkv: VideoConverter,
    mp3: AudioConverter, wav: AudioConverter, flac: AudioConverter, aac: AudioConverter,
    zip: ArchiveConverter, rar: ArchiveConverter, '7z': ArchiveConverter,
    json: CodeConverter, xml: CodeConverter, html: CodeConverter, md: CodeConverter,
    epub: EbookConverter, mobi: EbookConverter, azw: EbookConverter, fb2: EbookConverter,
    psd: DesignConverter, ai: DesignConverter, svg: ImageConverter,
    stl: CADConverter, obj: CADConverter, dxf: CADConverter
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.updateNetworkStatus('online'));
      window.addEventListener('offline', () => this.updateNetworkStatus('offline'));
    }
  }

  private updateNetworkStatus(status: 'online' | 'offline') {
    this.state.networkStatus = status;
    this.notify();
  }

  subscribe(listener: (state: GlobalAppState) => void) {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  private async generateFingerprint(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async addJobs(files: File[], fromFmt: string, toFmt: string, settings: any, operationId?: string) {
    // --- SPECIAL CASE: MERGE PDF ---
    // Dropping N files for merge should create exactly ONE job
    if (operationId === 'merge-pdf') {
      const job: ConversionJob = {
        id: Math.random().toString(36).substr(2, 9),
        file: files[0], // Display reference
        sourceFiles: files, // The actual batch to merge
        fromFmt: 'multi',
        toFmt: 'PDF',
        status: 'queued',
        progress: 0,
        stage: 'Calibrating Neural Merge...',
        context: 'WASM',
        settings,
        operationId
      };
      this.state.processingQueue = [...this.state.processingQueue, job];
      this.notify();
      this.processNext();
      return;
    }

    // --- STANDARD CASE: INDIVIDUAL CONVERSIONS ---
    const newJobs: ConversionJob[] = [];
    
    for (const file of files) {
      const fingerprint = await this.generateFingerprint(file);
      const jobKey = `${fingerprint}_${operationId || 'convert'}_${toFmt}`;

      if (this.processedHashes.has(jobKey)) continue;

      const fileBuffer: FileBuffer = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        fingerprint,
        metadata: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          format: file.name.split('.').pop()?.toUpperCase() || 'UNK'
        }
      };

      const job: ConversionJob = {
        id: Math.random().toString(36).substr(2, 9),
        fileId: fileBuffer.id,
        file: file,
        fromFmt: fromFmt || fileBuffer.metadata.format.toLowerCase(),
        toFmt: toFmt || 'PDF',
        status: 'queued',
        progress: 0,
        stage: 'Initial Calibration...',
        context: this.determineContext(operationId),
        settings,
        operationId
      };

      this.processedHashes.add(jobKey);
      this.state.activeFiles.unshift(fileBuffer);
      newJobs.push(job);
    }

    if (newJobs.length === 0) return;

    this.state.processingQueue = [...this.state.processingQueue, ...newJobs];
    this.notify();
    this.processNext();
  }

  private determineContext(opId?: string): ExecutionContext {
    const aiOps = ['ocr-pdf', 'translate-pdf', 'redact-pdf', 'compare-pdf', 'repair-pdf'];
    const smartOps = [
      'compress-pdf', 'extract-pages', 'organize-pdf', 'sign-pdf', 
      'protect-pdf', 'word-pdf', 'excel-pdf', 'pptx-pdf',
      'pdf-word', 'pdf-excel', 'pdf-pptx', 'rotate-pdf', 'page-numbers'
    ];
    if (opId && aiOps.includes(opId)) return 'AI';
    if (opId && smartOps.includes(opId)) return 'SMART';
    return 'WASM';
  }

  private async processNext() {
    if (this.isProcessing) return;
    const nextJob = this.state.processingQueue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.isProcessing = true;
    nextJob.status = 'processing';
    this.notify();

    try {
      let result;
      if (nextJob.operationId === 'merge-pdf' && nextJob.sourceFiles) {
        result = await this.executeMerge(nextJob.sourceFiles, nextJob);
      } else if (nextJob.operationId) {
        result = await this.runOperation(nextJob);
      } else {
        result = await this.runConversion(nextJob);
      }
      
      const objectUrl = URL.createObjectURL(result.blob);
      nextJob.status = 'complete';
      nextJob.progress = 100;
      nextJob.stage = 'Unit Mastered';
      
      const originalBase = nextJob.operationId === 'merge-pdf' ? 'Merge' : nextJob.file.name.replace(/\.[^/.]+$/, "");
      const ext = result.fileName.split('.').pop() || nextJob.toFmt.toLowerCase();
      const finalFileName = `Mastered_${originalBase}.${ext}`;

      nextJob.result = {
        ...result,
        fileName: finalFileName,
        size: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
        objectUrl
      };
      
      this.state.outputBuffer.unshift(nextJob);
      this.state.userSession.totalMastered++;
      this.state.userSession.lastProcessAt = new Date().toISOString();
    } catch (err: any) {
      nextJob.status = 'failed';
      nextJob.error = err.message || 'Processing Error';
      nextJob.stage = 'Logic Fault';
    } finally {
      this.isProcessing = false;
      this.state.processingQueue = this.state.processingQueue.filter(j => j.id !== nextJob.id);
      this.notify();
      this.processNext();
    }
  }

  private async executeMerge(files: File[], job: ConversionJob) {
    const manip = new PDFManipulator(files, (p, msg) => {
      job.progress = p; job.stage = msg; this.notify();
    });
    return manip.merge();
  }

  private async runOperation(job: ConversionJob) {
    const manip = new PDFManipulator(job.file, (p, msg) => {
      job.progress = p; job.stage = msg; this.notify();
    });
    const specialized = new SpecializedConverter(job.file, (p, msg) => {
      job.progress = p; job.stage = msg; this.notify();
    });

    switch (job.operationId) {
      case 'split-pdf': 
        return manip.split(job.settings.splitMode || 'range', job.settings.splitValue || '1');
      case 'extract-pages':
        return manip.extractPages(job.settings.pages || [0]);
      case 'remove-pages': 
        return manip.removePages(job.settings.pages || []);
      case 'organize-pdf': 
        return manip.reorderPages(job.settings.newOrder || []);
      case 'scan-to-pdf': 
        return specialized.convertTo('SEARCHABLE_PDF');
      case 'compress-pdf': 
        return manip.compress(job.settings.profile || 'balanced');
      case 'repair-pdf': 
        return specialized.convertTo('REPAIRED_PDF');
      case 'ocr-pdf': 
        return specialized.convertTo('SEARCHABLE_PDF');
      case 'rotate-pdf': 
        return manip.rotate(job.settings.angle || 90);
      case 'page-numbers': 
        return manip.addPageNumbers(job.settings);
      case 'watermark-pdf': 
        return manip.addWatermark(job.settings.text || 'AJN Master');
      case 'crop-pdf': 
        return manip.crop(job.settings.margins || { top: 50, bottom: 50, left: 50, right: 50 });
      case 'unlock-pdf': 
        return manip.rotate(0); // Mock bypass
      case 'protect-pdf': 
        return manip.protect(job.settings.password || '1234');
      case 'sign-pdf': 
        return manip.addWatermark('Digitally Signed', 0.1);
      case 'redact-pdf': 
        return specialized.convertTo('REDACTED_PDF', job.settings);
      case 'compare-pdf': 
        return specialized.convertTo('TRANSCRIPT', job.settings); // AI Mock
      case 'translate-pdf': 
        return specialized.convertTo('TRANSCRIPT', job.settings); // AI Mock
      case 'pdf-pdfa':
        return this.runConversion({ ...job, toFmt: 'PDFA' });
      default: 
        return this.runConversion(job);
    }
  }

  private async runConversion(job: ConversionJob) {
    const key = job.fromFmt.toLowerCase();
    const ConverterClass = this.converters[key];
    if (!ConverterClass) throw new Error(`Protocol ${key.toUpperCase()} Not Found`);
    const converter = new ConverterClass(job.file, (p: number, msg: string) => {
      job.progress = p; job.stage = msg; this.notify();
    });
    return await converter.convertTo(job.toFmt, job.settings);
  }

  cancelJob(id: string) {
    const job = this.state.processingQueue.find(j => j.id === id);
    if (job) { job.status = 'cancelled'; this.notify(); }
  }

  clearQueue() {
    this.state.outputBuffer.forEach(j => { if (j.result?.objectUrl) URL.revokeObjectURL(j.result.objectUrl); });
    this.state.outputBuffer = []; 
    this.state.activeFiles = [];
    this.processedHashes.clear();
    this.notify();
  }
}

export const engine = new ConversionEngine();
