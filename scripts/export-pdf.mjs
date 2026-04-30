import { join } from 'path';
import { generatePdf } from './generate-pdf.mjs';

const docsDir = join(import.meta.dirname, '..', 'docs', 'prd');
const outPath = join(import.meta.dirname, '..', 'Medical-Idea-TBD-PRD.pdf');

await generatePdf(docsDir, outPath);
console.log(`PDF exported to ${outPath}`);
