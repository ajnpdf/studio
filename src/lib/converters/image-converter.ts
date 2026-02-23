'use client';

import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { ProgressCallback, ConversionResult } from './pdf-converter';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;

/**
 * AJN Neural Image Conversion Engine
 * Implements high-fidelity raster and vector transformations
 */
export class ImageConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  private async getFFmpeg() {
    if (ffmpegInstance) return ffmpegInstance;
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  }

  async convertTo(targetFormat: string, settings: any = {}): Promise<ConversionResult> {
    const target = targetFormat.toUpperCase();
    const baseName = this.file.name.split('.')[0];
    const ext = this.file.name.split('.').pop()?.toLowerCase();

    this.updateProgress(10, `Initializing Neural Image Engine...`);

    // SPECIAL: JPG TO PDF
    if (target === 'PDF' && ['jpg', 'jpeg', 'png', 'webp'].includes(ext!)) {
      return this.toPDF(baseName);
    }

    // Routing Logic
    if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp'].includes(ext!)) {
      return this.handleCommonFormats(target, baseName, settings);
    }

    if (ext === 'gif') {
      return this.handleGif(target, baseName, settings);
    }

    throw new Error(`Format transformation ${ext?.toUpperCase()} -> ${target} not yet calibrated.`);
  }

  /**
   * 10. JPG TO PDF (Master Logic)
   */
  private async toPDF(baseName: string): Promise<ConversionResult> {
    this.updateProgress(20, "Creating master document buffer...");
    const pdf = await PDFDocument.create();
    const bytes = await this.file.arrayBuffer();

    this.updateProgress(50, "Embedding raster layers...");
    const image = await pdf.embedJpg(bytes);
    const page = pdf.addPage([image.width, image.height]);

    this.updateProgress(80, "Executing pixel-perfect render...");
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    const newBytes = await pdf.save();
    return {
      blob: new Blob([newBytes], { type: "application/pdf" }),
      fileName: `${baseName}.pdf`,
      mimeType: "application/pdf"
    };
  }

  private async handleCommonFormats(target: string, baseName: string, settings: any): Promise<ConversionResult> {
    const img = await this.loadImage(this.file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;

    this.updateProgress(40, `Processing ${canvas.width}x${canvas.height} pixel matrix...`);

    if (['JPG', 'JPEG', 'BMP'].includes(target)) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    let blob: Blob;
    let mimeType: string;

    switch (target) {
      case 'PNG':
        blob = await this.toBlob(canvas, 'image/png');
        mimeType = 'image/png';
        break;
      case 'JPG':
      case 'JPEG':
        blob = await this.toBlob(canvas, 'image/jpeg', settings.quality / 100 || 0.92);
        mimeType = 'image/jpeg';
        break;
      case 'WEBP':
        blob = await this.toBlob(canvas, 'image/webp', settings.quality / 100 || 0.85);
        mimeType = 'image/webp';
        break;
      case 'BMP':
        blob = await this.toBlob(canvas, 'image/bmp');
        mimeType = 'image/bmp';
        break;
      default:
        throw new Error(`Format ${target} not supported in common pipeline.`);
    }

    this.updateProgress(100, "Processing complete.");
    return { blob, fileName: `${baseName}.${target.toLowerCase()}`, mimeType };
  }

  private async handleGif(target: string, baseName: string, settings: any): Promise<ConversionResult> {
    if (target !== 'MP4' && target !== 'WEBP') {
      return this.handleCommonFormats(target, baseName, settings);
    }

    this.updateProgress(20, "Initializing FFmpeg neural transcode...");
    const ffmpeg = await this.getFFmpeg();
    const inputName = 'input.gif';
    const outputName = target === 'MP4' ? 'output.mp4' : 'output.webp';

    await ffmpeg.writeFile(inputName, await fetchFile(this.file));
    
    if (target === 'MP4') {
      await ffmpeg.exec(['-i', inputName, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', outputName]);
    } else {
      await ffmpeg.exec(['-i', inputName, '-vcodec', 'libwebp', '-loop', '0', outputName]);
    }

    const data = await ffmpeg.readFile(outputName);
    const mime = target === 'MP4' ? 'video/mp4' : 'image/webp';
    
    return {
      blob: new Blob([data], { type: mime }),
      fileName: `${baseName}.${target.toLowerCase()}`,
      mimeType: mime
    };
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => reject(new Error("Failed to load image into neural memory."));
      img.src = url;
    });
  }

  private toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), type, quality));
  }
}
