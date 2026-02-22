'use client';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Excel Converter Service
 * High-precision grid analysis and multi-sheet transformation
 */
export class ExcelConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async convertTo(targetFormat: string): Promise<ConversionResult> {
    const arrayBuffer = await this.file.arrayBuffer();
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();

    this.updateProgress(10, `Identifying spreadsheet schema...`);
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    switch (target) {
      case 'PDF':
        return this.toPdf(workbook, baseName);
      case 'CSV':
        return this.toCsv(workbook, baseName);
      case 'XLSX':
        return this.toBinary(workbook, baseName, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      case 'XLS':
        return this.toBinary(workbook, baseName, 'xls', 'application/vnd.ms-excel');
      case 'ODS':
        return this.toBinary(workbook, baseName, 'ods', 'application/vnd.oasis.opendocument.spreadsheet');
      case 'HTML':
        return this.toHtml(workbook, baseName);
      default:
        throw new Error(`Format ${target} not supported.`);
    }
  }

  private async toPdf(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    const pdf = new jsPDF('l', 'pt', 'a4');
    for (let i = 0; i < workbook.SheetNames.length; i++) {
      const name = workbook.SheetNames[i];
      const html = XLSX.utils.sheet_to_html(workbook.Sheets[name]);
      
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.innerHTML = `<h2 style="font-family:sans-serif">${name}</h2>${html}`;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);

      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 40, 40, 760, (canvas.height * 760) / canvas.width);
      this.updateProgress(Math.round((i / workbook.SheetNames.length) * 100), `Rendering worksheet: ${name}...`);
    }
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async toCsv(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    if (workbook.SheetNames.length === 1) {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
      return { blob: new Blob(['\uFEFF' + csv], { type: 'text/csv' }), fileName: `${baseName}.csv`, mimeType: 'text/csv' };
    }
    const zip = new JSZip();
    workbook.SheetNames.forEach(n => zip.file(`${n}.csv`, '\uFEFF' + XLSX.utils.sheet_to_csv(workbook.Sheets[n])));
    const blob = await zip.generateAsync({ type: 'blob' });
    return { blob, fileName: `${baseName}_csv.zip`, mimeType: 'application/zip' };
  }

  private async toHtml(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    let html = `<html><head><style>body{font-family:sans-serif}.tab{padding:10px;background:#eee;cursor:pointer}.active{background:#fff;border:1px solid #ccc}</style></head><body>`;
    workbook.SheetNames.forEach((n, i) => {
      const sheetHtml = XLSX.utils.sheet_to_html(workbook.Sheets[n]);
      html += `<div class='tab ${i === 0 ? 'active' : ''}'>${n}</div><div class='sheet'>${sheetHtml}</div>`;
    });
    html += `</body></html>`;
    return { blob: new Blob([html], { type: 'text/html' }), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }

  private toBinary(wb: XLSX.WorkBook, baseName: string, ext: string, mime: string): ConversionResult {
    const out = XLSX.write(wb, { bookType: ext as any, type: 'array' });
    return { blob: new Blob([out], { type: mime }), fileName: `${baseName}.${ext}`, mimeType: mime };
  }
}
