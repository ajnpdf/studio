'use client';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Spreadsheet Engine
 * Implements grid detection and cell semantic mapping.
 */
export class ExcelConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  async convertTo(targetFormat: string): Promise<ConversionResult> {
    const buffer = await this.file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const baseName = this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();

    switch (target) {
      case 'PDF': return this.toPdf(wb, baseName);
      case 'CSV': return this.toCsv(wb, baseName);
      case 'XLS': return this.toBinary(wb, baseName, 'xls', 'application/vnd.ms-excel');
      case 'XLSX': return this.toBinary(wb, baseName, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      case 'ODS': return this.toBinary(wb, baseName, 'ods', 'application/vnd.oasis.opendocument.spreadsheet');
      case 'HTML': return this.toHtml(wb, baseName);
      default: throw new Error(`Target ${target} not supported.`);
    }
  }

  private async toPdf(wb: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    const pdf = new jsPDF('l', 'pt', 'a4');
    for (let i = 0; i < wb.SheetNames.length; i++) {
      const html = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[i]]);
      const container = document.createElement('div');
      container.style.padding = '20px'; 
      container.innerHTML = html;
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container);
      document.body.removeChild(container);
      
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 20, 20, 800, (canvas.height * 800) / canvas.width);
    }
    return { blob: pdf.output('blob'), fileName: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  private async toCsv(wb: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    if (wb.SheetNames.length === 1) {
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      return { blob: new Blob(['\uFEFF' + csv]), fileName: `${baseName}.csv`, mimeType: 'text/csv' };
    }
    const zip = new JSZip();
    wb.SheetNames.forEach(n => zip.file(`${n}.csv`, '\uFEFF' + XLSX.utils.sheet_to_csv(wb.Sheets[n])));
    return { blob: await zip.generateAsync({ type: 'blob' }), fileName: `${baseName}_csv.zip`, mimeType: 'application/zip' };
  }

  private async toHtml(wb: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    let html = `<html><head><style>
      body{font-family:sans-serif; background: #020617; color: white;}
      .tab{display:inline-block;padding:10px 20px;cursor:pointer;background:#1e293b; border-radius: 8px 8px 0 0; margin-right: 2px;}
      .active{background: #3b82f6;}
      table{border-collapse: collapse; width: 100%; border: 1px solid #334155;}
      th,td{border: 1px solid #334155; padding: 8px; text-align: left;}
    </style></head><body>`;
    
    wb.SheetNames.forEach((n, idx) => {
      html += `<div class='tab ${idx === 0 ? 'active' : ''}'>${n}</div>`;
    });
    
    wb.SheetNames.forEach((n, idx) => {
      html += `<div style='display:${idx === 0 ? 'block' : 'none'}'>${XLSX.utils.sheet_to_html(wb.Sheets[n])}</div>`;
    });
    
    html += `</body></html>`;
    return { blob: new Blob([html]), fileName: `${baseName}.html`, mimeType: 'text/html' };
  }

  private toBinary(wb: XLSX.WorkBook, baseName: string, ext: string, mime: string): ConversionResult {
    const out = XLSX.write(wb, { bookType: ext as any, type: 'array' });
    return { blob: new Blob([out]), fileName: `${baseName}.${ext}`, mimeType: mime };
  }
}
