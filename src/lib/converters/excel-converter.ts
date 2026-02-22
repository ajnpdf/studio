'use client';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProgressCallback, ConversionResult } from './pdf-converter';

/**
 * AJN Neural Excel Converter Service
 * Implements high-precision spreadsheet transformations
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
    const isCsv = this.file.name.toLowerCase().endsWith('.csv');

    this.updateProgress(10, `Initializing Neural Spreadsheet Engine...`);

    // Load workbook
    const workbook = isCsv 
      ? this.loadCsv(await this.file.text())
      : XLSX.read(arrayBuffer, { type: 'array', cellDates: true, cellStyles: true });

    const sheetNames = workbook.SheetNames;
    this.updateProgress(20, `Detected ${sheetNames.length} worksheets.`);

    switch (targetFormat.toUpperCase()) {
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
        throw new Error(`Format ${targetFormat} not yet supported for spreadsheets.`);
    }
  }

  private loadCsv(text: string): XLSX.WorkBook {
    // Neural delimiter detection
    const firstLine = text.split('\n')[0];
    const delimiters = [',', ';', '\t', '|'];
    const counts = delimiters.map(d => ({ d, count: firstLine.split(d).length }));
    const best = counts.sort((a, b) => b.count - a.count)[0].d;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.csv_to_sheet(text, { FS: best });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return workbook;
  }

  private async toPdf(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    const pdf = new jsPDF('l', 'pt', 'a4'); // Landscape usually better for spreadsheets
    const sheetNames = workbook.SheetNames;

    for (let i = 0; i < sheetNames.length; i++) {
      const sheetName = sheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      this.updateProgress(Math.round((i / sheetNames.length) * 100), `Rendering ${sheetName} to vector canvas...`);

      if (i > 0) pdf.addPage();

      // Convert sheet to HTML for rendering
      const html = XLSX.utils.sheet_to_html(worksheet);
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.innerHTML = `
        <style>
          h2 { font-family: sans-serif; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          table { border-collapse: collapse; font-family: monospace; font-size: 10px; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          th { background-color: #f2f2f2; font-weight: bold; }
        </style>
        <h2>Sheet: ${sheetName}</h2>
        ${html}
      `;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
    }

    return {
      blob: pdf.output('blob'),
      fileName: `${baseName}.pdf`,
      mimeType: 'application/pdf'
    };
  }

  private async toCsv(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    const sheetNames = workbook.SheetNames;
    
    if (sheetNames.length === 1) {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetNames[0]]);
      return {
        blob: new Blob(['\uFEFF' + csv], { type: 'text/csv; charset=utf-8' }),
        fileName: `${baseName}.csv`,
        mimeType: 'text/csv'
      };
    }

    const zip = new JSZip();
    sheetNames.forEach(name => {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
      zip.file(`${name}.csv`, '\uFEFF' + csv);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    return {
      blob: content,
      fileName: `${baseName}_sheets.zip`,
      mimeType: 'application/zip'
    };
  }

  private toBinary(workbook: XLSX.WorkBook, baseName: string, ext: string, mime: string): ConversionResult {
    const out = XLSX.write(workbook, { bookType: ext as any, type: 'array' });
    return {
      blob: new Blob([out], { type: mime }),
      fileName: `${baseName}.${ext}`,
      mimeType: mime
    };
  }

  private async toHtml(workbook: XLSX.WorkBook, baseName: string): Promise<ConversionResult> {
    let fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <style>
        body { font-family: system-ui; padding: 20px; background: #f4f4f9; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .tab { padding: 8px 16px; cursor: pointer; border-radius: 6px; background: #eee; font-weight: bold; }
        .tab.active { background: #000; color: white; }
        .sheet-container { display: none; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow-x: auto; }
        .sheet-container.active { display: block; }
        table { border-collapse: collapse; width: 100%; min-width: 600px; }
        th, td { border: 1px solid #eee; padding: 10px; text-align: left; }
        tr:hover { background: #fafafa; }
        th { background: #f8f8f8; position: sticky; top: 0; }
      </style>
    </head><body><div class='tabs'>`;

    workbook.SheetNames.forEach((name, i) => {
      fullHtml += `<div class='tab ${i === 0 ? 'active' : ''}' onclick='showSheet("${name}", this)'>${name}</div>`;
    });

    fullHtml += `</div>`;

    workbook.SheetNames.forEach((name, i) => {
      const html = XLSX.utils.sheet_to_html(workbook.Sheets[name]);
      fullHtml += `<div id='${name}' class='sheet-container ${i === 0 ? 'active' : ''}'>${html}</div>`;
    });

    fullHtml += `
      <script>
        function showSheet(id, el) {
          document.querySelectorAll('.sheet-container').forEach(s => s.classList.remove('active'));
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.getElementById(id).classList.add('active');
          el.classList.add('active');
        }
      </script>
    </body></html>`;

    return {
      blob: new Blob([fullHtml], { type: 'text/html' }),
      fileName: `${baseName}.html`,
      mimeType: 'text/html'
    };
  }
}
