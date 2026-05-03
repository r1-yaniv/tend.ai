import { join } from 'path';
import { mkdirSync, watch } from 'fs';
import { generatePdf } from './generate-pdf.mjs';

const docsDir = join(import.meta.dirname, '..', 'docs', 'prd');
const mockupsDir = join(import.meta.dirname, '..', 'docs', 'mockups');
const publicDir = join(import.meta.dirname, '..', 'docs', 'public');
const outPath = join(publicDir, 'Tend-PRD.pdf');

mkdirSync(publicDir, { recursive: true });

async function build() {
  const start = Date.now();
  try {
    await generatePdf(docsDir, outPath);
    console.log(`PDF generated (${Date.now() - start}ms)`);
  } catch (err) {
    console.error('PDF generation failed:', err.message);
  }
}

await build();

if (process.argv.includes('--watch')) {
  let debounce = null;
  const rebuild = (filename) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      console.log(`${filename} changed, regenerating PDF...`);
      build();
    }, 500);
  };

  watch(docsDir, { recursive: true }, (event, filename) => {
    if (!filename?.endsWith('.md')) return;
    rebuild(`prd/${filename}`);
  });

  watch(mockupsDir, { recursive: true }, (event, filename) => {
    if (!filename || filename.endsWith('.pen')) return;
    rebuild(`mockups/${filename}`);
  });

  console.log('Watching docs/prd/ and docs/mockups/ for changes...');
}
