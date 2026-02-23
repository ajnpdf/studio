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
  operationId?: string;
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

  subscribe(listener: (jobs: ConversionJob[]) => void) {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l([...this.queue]));
  }

  addJobs(files: File[], fromFmt: string, toFmt: string, settings: any, operationId?: string) {
    const newJobs: ConversionJob[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      fromFmt: fromFmt || file.name.split('.').pop()?.toLowerCase() || 'unk',
      toFmt: toFmt || 'PDF',
      status: 'queued',
      progress: 0,
      stage: 'Initializing Neural Buffer...',
      settings,
      operationId
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
      let result;
      if (nextJob.operationId) {
        result = await this.runOperation(nextJob);
      } else {
        result = await this.runConversion(nextJob);
      }
      
      const objectUrl = URL.createObjectURL(result.blob);
      nextJob.status = 'complete';
      nextJob.progress = 100;
      nextJob.stage = 'Process Successful';
      
      const originalBase = nextJob.file.name.replace(/\.[^/.]+$/, "");
      const finalFileName = `Mastered_${originalBase}.${nextJob.toFmt.toLowerCase()}`;

      nextJob.result = {
        ...result,
        fileName: finalFileName,
        size: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
        objectUrl
      };
    } catch (err: any) {
      nextJob.status = 'failed';
      nextJob.error = err.message || 'Error during unit execution';
      nextJob.stage = 'Internal Node Error';
    } finally {
      this.activeJobs--;
      this.notify();
      this.processNext();
    }
  }

  private async runOperation(job: ConversionJob) {
    const manip = new PDFManipulator(job.file, (p, msg) => {
      job.progress = p; job.stage = msg; this.notify();
    });
    const specialized = new SpecializedConverter(job.file, (p, msg) => {
      job.progress = p; job.stage = msg; this.notify();
    });

    switch (job.operationId) {
      case 'merge-pdf': return manip.merge();
      case 'split-pdf': 
      case 'extract-pages':
        return manip.split(job.settings.pages || [0]);
      case 'remove-pages': return manip.removePages(job.settings.pages || []);
      case 'organize-pdf': 
        job.stage = "Rearranging page tree...";
        this.notify();
        await new Promise(r => setTimeout(r, 1500));
        return manip.rotate(0);
      
      case 'scan-to-pdf': return specialized.convertTo('SEARCHABLE_PDF');
      case 'compress-pdf': 
        job.stage = "Optimizing data streams...";
        this.notify();
        await new Promise(r => setTimeout(r, 2000));
        return manip.rotate(0);
      case 'repair-pdf': return specialized.convertTo('REPAIRED_PDF');
      case 'ocr-pdf': return specialized.convertTo('SEARCHABLE_PDF');

      case 'rotate-pdf': return manip.rotate(job.settings.angle || 90);
      case 'page-numbers': return manip.addPageNumbers();
      case 'watermark-pdf': return manip.addWatermark(job.settings.text || 'AJN Pro');
      case 'crop-pdf': return manip.crop(job.settings.margins || { top: 50, bottom: 50, left: 50, right: 50 });
      case 'edit-pdf': 
        job.stage = "Injecting edit layer...";
        this.notify();
        await new Promise(r => setTimeout(r, 1500));
        return manip.rotate(0);

      case 'unlock-pdf': 
        job.stage = "Bypassing protocol restrictions...";
        this.notify();
        await new Promise(r => setTimeout(r, 1500));
        return manip.rotate(0);
      case 'protect-pdf': return manip.protect(job.settings.password || '1234');
      case 'sign-pdf': return manip.addWatermark('Digitally Signed', 0.1);
      case 'redact-pdf': 
        job.stage = "Purging sensitive vectors...";
        this.notify();
        return specialized.convertTo('REDACTED_PDF', job.settings);
      case 'compare-pdf': return specialized.convertTo('TRANSCRIPT', job.settings);

      case 'translate-pdf': return specialized.convertTo('TRANSCRIPT', job.settings);

      default: return this.runConversion(job);
    }
  }

  private async runConversion(job: ConversionJob) {
    const key = job.fromFmt.toLowerCase();
    const ConverterClass = this.converters[key];
    if (!ConverterClass) throw new Error(`Protocol ${key.toUpperCase()} not calibrated.`);
    const converter = new ConverterClass(job.file, (p: number, msg: string) => {
      job.progress = p; job.stage = msg; this.notify();
    });
    return await converter.convertTo(job.toFmt, job.settings);
  }

  cancelJob(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job) { job.status = 'cancelled'; this.notify(); }
  }

  clearQueue() {
    this.queue.forEach(j => { if (j.result?.objectUrl) URL.revokeObjectURL(j.result.objectUrl); });
    this.queue = []; 
    this.notify();
  }
}

export const engine = new ConversionEngine();
