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

export type JobStatus = 'queued' | 'processing' | 'complete' | 'failed' | 'cancelled';

export interface ConversionJob {
  id: string;
  file: File;
  fromFmt: string;
  toFmt: string;
  status: JobStatus;
  progress: number;
  stage: string;
  result?: {
    blob: Blob;
    fileName: string;
    mimeType: string;
    size: string;
    objectUrl: string;
  };
  error?: string;
  settings: any;
}

export class AJNConversionError extends Error {
  code: string;
  recoverable: boolean;
  constructor(message: string, code: string, recoverable: boolean = false) {
    super(message);
    this.code = code;
    this.recoverable = recoverable;
  }
}

class ConversionEngine {
  private queue: ConversionJob[] = [];
  private activeJobs: number = 0;
  private maxConcurrent: number = 3;
  private listeners: Set<(jobs: ConversionJob[]) => void> = new Set();

  private converters: Record<string, any> = {
    pdf: PDFConverter,
    docx: WordConverter, doc: WordConverter,
    xlsx: ExcelConverter, xls: ExcelConverter, csv: ExcelConverter,
    pptx: PPTConverter, ppt: PPTConverter,
    odt: ODTConverter, ods: ODTConverter, odp: ODTConverter,
    jpg: ImageConverter, jpeg: ImageConverter, png: ImageConverter, webp: ImageConverter,
    cr2: RawConverter, nef: RawConverter, arw: RawConverter, dng: RawConverter,
    mp4: VideoConverter, mov: VideoConverter, avi: VideoConverter, mkv: VideoConverter,
    mp3: AudioConverter, wav: AudioConverter, flac: AudioConverter, aac: AudioConverter,
    zip: ArchiveConverter, rar: ArchiveConverter, '7z': ArchiveConverter,
    json: CodeConverter, xml: CodeConverter, html: CodeConverter, md: CodeConverter,
    epub: EbookConverter, mobi: EbookConverter, azw: EbookConverter, fb2: EbookConverter,
    psd: DesignConverter, ai: DesignConverter, svg: DesignConverter,
    stl: CADConverter, obj: CADConverter, dxf: CADConverter
  };

  subscribe(listener: (jobs: ConversionJob[]) => void) {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l([...this.queue]));
  }

  addJobs(files: File[], fromFmt: string, toFmt: string, settings: any) {
    const newJobs: ConversionJob[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      fromFmt: fromFmt || file.name.split('.').pop()?.toLowerCase() || 'unk',
      toFmt,
      status: 'queued',
      progress: 0,
      stage: 'Awaiting neural resources...',
      settings
    }));

    this.queue = [...newJobs, ...this.queue];
    this.notify();
    this.processNext();
  }

  private async processNext() {
    if (this.activeJobs >= this.maxConcurrent) return;

    const nextJob = this.queue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.activeJobs++;
    nextJob.status = 'processing';
    this.notify();

    try {
      const result = await this.runConversion(nextJob);
      const objectUrl = URL.createObjectURL(result.blob);
      
      nextJob.status = 'complete';
      nextJob.progress = 100;
      nextJob.stage = 'Neutral transformation successful';
      nextJob.result = {
        ...result,
        size: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
        objectUrl
      };
      
      this.saveToHistory(nextJob);
      
      // Auto-revocation timer to save memory
      setTimeout(() => {
        // We don't revoke immediately because user might click download
        // But we track it for cleanup
      }, 300000); // 5 mins

    } catch (err: any) {
      nextJob.status = 'failed';
      nextJob.error = err.message || 'Unknown network error';
      nextJob.stage = 'Internal Error';
    } finally {
      this.activeJobs--;
      this.notify();
      this.processNext();
    }
  }

  private async runConversion(job: ConversionJob) {
    const key = job.fromFmt.toLowerCase();
    const ConverterClass = this.converters[key];
    
    if (!ConverterClass) {
      throw new AJNConversionError(`Format ${key.toUpperCase()} not supported`, 'UNSUPPORTED_FORMAT');
    }

    const onProgress = (p: number, msg: string) => {
      job.progress = p;
      job.stage = msg;
      this.notify();
    };

    const converter = new ConverterClass(job.file, onProgress);
    return await converter.convertTo(job.toFmt, job.settings);
  }

  private saveToHistory(job: ConversionJob) {
    if (typeof window === 'undefined') return;
    const history = JSON.parse(localStorage.getItem('ajn_history') || '[]');
    const entry = {
      id: job.id,
      fileName: job.file.name,
      fromFmt: job.fromFmt,
      toFmt: job.toFmt,
      date: new Date().toISOString(),
      size: job.result?.size,
      status: 'complete'
    };
    localStorage.setItem('ajn_history', JSON.stringify([entry, ...history].slice(0, 50)));
  }

  cancelJob(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job) {
      job.status = 'cancelled';
      job.stage = 'Manually terminated';
      this.notify();
    }
  }

  clearQueue() {
    // Revoke all completed job URLs before clearing
    this.queue.forEach(j => {
      if (j.result?.objectUrl) URL.revokeObjectURL(j.result.objectUrl);
    });
    this.queue = [];
    this.notify();
  }
}

export const engine = new ConversionEngine();
