import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { mdToPdf } from 'md-to-pdf';

function imgToDataUri(filePath) {
  if (!existsSync(filePath)) return '';
  const buf = readFileSync(filePath);
  const ext = filePath.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/' + ext;
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const FILES = [
  '01-overview.md',
  '02-features.md',
  '03-workflows.md',
  '04-open-questions.md',
  '05-ui-ux.md',
];

const CSS = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #1a1a1a;
  }
  h1 { font-size: 26px; border-bottom: 2px solid #333; padding-bottom: 8px; margin-top: 0; }
  h2 { font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 28px; }
  h3 { font-size: 16px; margin-top: 20px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
  tr:nth-child(even) { background: #fafafa; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  pre { background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #666; margin-left: 0; padding-left: 16px; color: #555; }
  .gap-box {
    background: #fff8e1; border: 1px solid #ffe082; border-left: 4px solid #ffa000;
    padding: 10px 14px; margin: 12px 0; border-radius: 4px; font-size: 12px;
  }
  .info-box {
    background: #e3f2fd; border: 1px solid #90caf9; border-left: 4px solid #1976d2;
    padding: 10px 14px; margin: 12px 0; border-radius: 4px; font-size: 12px;
  }
  .tip-box {
    background: #e8f5e9; border: 1px solid #a5d6a7; border-left: 4px solid #388e3c;
    padding: 10px 14px; margin: 12px 0; border-radius: 4px; font-size: 12px;
  }
  img { max-width: 100%; max-height: min(400px, 240mm); width: auto; height: auto; page-break-inside: avoid; break-inside: avoid; border-radius: 8px; object-fit: contain; display: block; }
  .image-row { display: flex; gap: 12px; align-items: start; margin: 12px 0; page-break-inside: avoid; break-inside: avoid; }
  .image-row img { margin: 0; flex-shrink: 1; min-width: 0; }
  .page-break { page-break-after: always; }
  s { color: #999; }
`;

export async function generatePdf(docsDir, outPath) {
  const mockupsDir = join(docsDir, '..', 'mockups');

  const combined = FILES
    .map((f) => readFileSync(join(docsDir, f), 'utf-8'))
    .join('\n\n<div class="page-break"></div>\n\n');

  const processed = combined
    .replace(/!\[([^\]]*)\]\(\.\.\/mockups\/([^)]+)\)/g, (_, alt, file) => {
      const dataUri = imgToDataUri(join(mockupsDir, file));
      return dataUri
        ? `<img src="${dataUri}" alt="${alt}" style="max-width:100%;margin:12px 0;border-radius:8px;" />`
        : `<em>[Image: ${alt}]</em>`;
    })
    .replace(/::: warning (GAP(?:[^\n]*))\n([\s\S]*?):::/g, (_, title, body) =>
      `<div class="gap-box"><strong>⚠ ${title.trim()}</strong><br/>${body.trim()}</div>`)
    .replace(/::: warning\n([\s\S]*?):::/g, (_, body) =>
      `<div class="gap-box"><strong>⚠ GAP</strong><br/>${body.trim()}</div>`)
    .replace(/::: info (.*)\n([\s\S]*?):::/g, (_, title, body) =>
      `<div class="info-box"><strong>ℹ ${title.trim()}</strong><br/>${body.trim()}</div>`)
    .replace(/::: tip (.*)\n([\s\S]*?):::/g, (_, title, body) =>
      `<div class="tip-box"><strong>💡 ${title.trim()}</strong><br/>${body.trim()}</div>`);

  const pdf = await mdToPdf(
    { content: processed },
    {
      basedir: docsDir,
      pdf_options: {
        format: 'A4',
        margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' },
        printBackground: true,
      },
      css: CSS,
    }
  );

  writeFileSync(outPath, pdf.content);
  return outPath;
}
