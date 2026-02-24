'use client';

import jsyaml from 'js-yaml';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProgressCallback, ConversionResult } from './pdf-converter';
import { WordConverter } from './word-converter';

/**
 * AJN Professional Code & Data Conversion Engine
 * Handles JSON, XML, CSV, YAML, HTML, Markdown, and SQL
 */
export class CodeConverter {
  private file: File;
  private onProgress?: ProgressCallback;

  constructor(file: File, onProgress?: ProgressCallback) {
    this.file = file;
    this.onProgress = onProgress;
  }

  private updateProgress(percent: number, message: string) {
    this.onProgress?.(percent, message);
  }

  async convertTo(targetFormat: string, settings: any = {}): Promise<ConversionResult> {
    const text = settings.htmlContent || (await this.file.text());
    const baseName = settings.htmlUrl ? 'Web_Capture' : this.file.name.split('.')[0];
    const target = targetFormat.toUpperCase();
    const ext = settings.htmlUrl ? 'html' : this.file.name.split('.').pop()?.toLowerCase();

    this.updateProgress(10, `Initializing Professional Code Engine...`);

    if (ext === 'json') {
      if (target === 'XML') return this.jsonToXml(text, baseName, settings);
      if (target === 'CSV') return this.jsonToCsv(text, baseName);
      if (target === 'YAML') return this.jsonToYaml(text, baseName, settings);
    }

    if (ext === 'xml' && target === 'JSON') return this.xmlToJson(text, baseName);

    if (ext === 'csv') {
      if (target === 'JSON') return this.csvToJson(text, baseName);
      if (target === 'SQL') return this.csvToSql(text, baseName, settings);
    }

    if (ext === 'yaml' && target === 'JSON') return this.yamlToJson(text, baseName);

    if (ext === 'html' || settings.htmlUrl) {
      if (target === 'PDF') return this.htmlToPdf(text, baseName, settings);
      if (target === 'DOCX') return this.htmlToDocx(text, baseName);
    }

    if (ext === 'md' || ext === 'markdown') {
      if (target === 'PDF') return this.markdownToPdf(text, baseName);
      if (target === 'DOCX') return this.markdownToDocx(text, baseName);
    }

    if (ext === 'sql' && target === 'CSV') return this.sqlToCsv(text, baseName);

    throw new Error(`Format transformation ${ext?.toUpperCase()} -> ${target} not yet supported.`);
  }

  private async htmlToPdf(html: string, baseName: string, settings: any): Promise<ConversionResult> {
    this.updateProgress(10, "Initializing Master Web Capture Sequence...");

    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.width = '1024px'; 
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return reject(new Error("DOM Engine initialization failed"));

      this.updateProgress(20, "Loading HTML content into session buffer...");
      doc.open();
      doc.write(html);
      
      if (settings.customCss) {
        const style = doc.createElement('style');
        style.textContent = settings.customCss;
        doc.head.appendChild(style);
      }
      doc.close();

      iframe.onload = async () => {
        try {
          this.updateProgress(35, "Waiting for asset hydration...");
          await new Promise(r => setTimeout(r, 1000));

          this.updateProgress(45, "Measuring document scroll dimensions...");
          const scrollHeight = doc.body.scrollHeight;

          this.updateProgress(60, "Capturing high-fidelity DOM snapshot...");
          const canvas = await html2canvas(doc.body, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 1024,
            height: scrollHeight,
            windowWidth: 1024
          });
          document.body.removeChild(iframe);

          this.updateProgress(80, "Segmenting canvas into A4 page intervals...");
          const pdf = new jsPDF('p', 'pt', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const pxPerPage = (canvasWidth / pdfWidth) * pdfHeight;

          let yOffset = 0;
          let first = true;

          while (yOffset < canvasHeight) {
            if (!first) pdf.addPage();
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvasWidth;
            pageCanvas.height = Math.min(pxPerPage, canvasHeight - yOffset);
            const ctx = pageCanvas.getContext('2d')!;
            ctx.drawImage(canvas, 0, yOffset, canvasWidth, pageCanvas.height, 0, 0, canvasWidth, pageCanvas.height);
            pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, (pageCanvas.height / canvasWidth) * pdfWidth);
            yOffset += pxPerPage;
            first = false;
          }

          this.updateProgress(100, "Processing complete.");
          resolve({
            blob: pdf.output('blob'),
            fileName: `${baseName}.pdf`,
            mimeType: 'application/pdf'
          });
        } catch (e) {
          reject(e);
        }
      };
    });
  }

  private async jsonToXml(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const obj = JSON.parse(text);
    const indent = settings.indent || 2;
    const sanitizeTag = (k: string) => k.replace(/[^\w-]/g, '_');
    const toXml = (val: any, tag: string, lvl: number): string => {
      const space = ' '.repeat(lvl * indent);
      if (Array.isArray(val)) return val.map(el => toXml(el, tag, lvl)).join('\n');
      if (typeof val === 'object' && val !== null) {
        const children = Object.entries(val).map(([k, v]) => toXml(v, sanitizeTag(k), lvl + 1)).join('\n');
        return `${space}<${tag}>\n${children}\n${space}</${tag}>`;
      }
      return `${space}<${tag}>${val}</${tag}>`;
    };
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, 'root', 0)}`;
    return { blob: new Blob([xml], { type: 'application/xml' }), fileName: `${baseName}.xml`, mimeType: 'application/xml' };
  }

  private async jsonToCsv(text: string, baseName: string): Promise<ConversionResult> {
    let data = JSON.parse(text);
    if (!Array.isArray(data)) data = [data];
    const allKeys = new Set<string>();
    data.forEach((item: any) => Object.keys(item).forEach(k => allKeys.add(k)));
    const headers = Array.from(allKeys);
    const escape = (val: any) => {
      const s = String(val);
      if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const rows = [headers.map(escape).join(','), ...data.map((item: any) => headers.map(h => escape(item[h] ?? '')).join(','))];
    return { blob: new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv; charset=utf-8' }), fileName: `${baseName}.csv`, mimeType: 'text/csv' };
  }

  private async jsonToYaml(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const obj = JSON.parse(text);
    const yaml = jsyaml.dump(obj, { indent: settings.indent || 2, noRefs: true });
    return { blob: new Blob([yaml], { type: 'application/yaml' }), fileName: `${baseName}.yaml`, mimeType: 'application/yaml' };
  }

  private async xmlToJson(text: string, baseName: string): Promise<ConversionResult> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    const nodeToJson = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() || null;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const result: any = {};
        const el = node as Element;
        Array.from(el.attributes).forEach(attr => result[`@${attr.name}`] = attr.value);
        Array.from(el.childNodes).forEach(child => {
          const val = nodeToJson(child);
          if (val === null) return;
          const name = child.nodeName;
          if (result[name]) {
            if (!Array.isArray(result[name])) result[name] = [result[name]];
            result[name].push(val);
          } else result[name] = val;
        });
        return Object.keys(result).length === 1 && result['#text'] ? result['#text'] : result;
      }
      return null;
    };
    const json = JSON.stringify(nodeToJson(doc.documentElement), null, 2);
    return { blob: new Blob([json], { type: 'application/json' }), fileName: `${baseName}.json`, mimeType: 'application/json' };
  }

  private async csvToJson(text: string, baseName: string): Promise<ConversionResult> {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const delimiter = this.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(h => h.replace(/^"|"$/g, '').trim());
    const data = lines.slice(1).map(line => {
      const vals = line.split(delimiter);
      const obj: any = {};
      headers.forEach((h, i) => {
        let v = (vals[i] || '').replace(/^"|"$/g, '').trim();
        obj[h] = !isNaN(v as any) && v !== '' ? Number(v) : v.toLowerCase() === 'true' ? true : v.toLowerCase() === 'false' ? false : v;
      });
      return obj;
    });
    return { blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), fileName: `${baseName}.json`, mimeType: 'application/json' };
  }

  private async csvToSql(text: string, baseName: string, settings: any): Promise<ConversionResult> {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const delimiter = this.detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(h => h.replace(/^"|"$/g, '').trim());
    const tableName = baseName.replace(/[^\w]/g, '_');
    let sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n` + headers.map(h => `  \`${h}\` VARCHAR(255)`).join(',\n') + `\n);\n\nBEGIN;\n`;
    lines.slice(1).forEach(line => {
      const vals = line.split(delimiter).map(v => `'${v.replace(/^"|"$/g, '').trim().replace(/'/g, "''")}'`);
      sql += `INSERT INTO \`${tableName}\` (\`${headers.join('`,`')}\`) VALUES (${vals.join(',')});\n`;
    });
    sql += `COMMIT;`;
    return { blob: new Blob([sql], { type: 'application/sql' }), fileName: `${baseName}.sql`, mimeType: 'application/sql' };
  }

  private async yamlToJson(text: string, baseName: string): Promise<ConversionResult> {
    const obj = jsyaml.load(text);
    return { blob: new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }), fileName: `${baseName}.json`, mimeType: 'application/json' };
  }

  private async htmlToDocx(text: string, baseName: string): Promise<ConversionResult> {
    const converter = new WordConverter(new File([text], 'temp.html', { type: 'text/html' }));
    return converter.convertTo('DOCX');
  }

  private async markdownToPdf(text: string, baseName: string): Promise<ConversionResult> {
    const html = marked.parse(text);
    return this.htmlToPdf(html as string, baseName, {});
  }

  private async markdownToDocx(text: string, baseName: string): Promise<ConversionResult> {
    const html = marked.parse(text);
    return this.htmlToDocx(html as string, baseName);
  }

  private async sqlToCsv(text: string, baseName: string): Promise<ConversionResult> {
    const insertRegex = /INSERT INTO\s+`?(\w+)`?\s+\((.*?)\)\s+VALUES\s+\((.*?)\);/gi;
    let match;
    const results: any[] = [];
    while ((match = insertRegex.exec(text)) !== null) {
      const headers = match[2].split(',').map(h => h.trim().replace(/`/g, ''));
      const values = match[3].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      results.push(obj);
    }
    if (results.length === 0) throw new Error("No valid INSERT statements detected in SQL file.");
    return this.jsonToCsv(JSON.stringify(results), baseName);
  }

  private detectDelimiter(line: string): string {
    const counts = { ',': line.split(',').length, ';': line.split(';').length, '\t': line.split('\t').length };
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
}
