import { defineConfig } from 'vitepress'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: 'Tend',
  description: 'Tend — Product Requirements Document',
  themeConfig: {
    nav: [
      { text: 'PRD', link: '/prd/01-overview' },
      { text: 'Download PDF', link: '/Tend-PRD.pdf', target: '_blank' },
    ],
    sidebar: {
      '/prd/': [
        {
          text: 'Product Requirements',
          items: [
            { text: 'Overview', link: '/prd/01-overview' },
            { text: 'Features', link: '/prd/02-features' },
            { text: 'Workflows', link: '/prd/03-workflows' },
            { text: 'Open Questions', link: '/prd/04-open-questions' },
            { text: 'UI / UX', link: '/prd/05-ui-ux' },
          ]
        }
      ]
    },
    outline: {
      level: [2, 3]
    },
    search: {
      provider: 'local'
    }
  },
  async buildEnd(siteConfig) {
    const { generatePdf } = await import('../../scripts/generate-pdf.mjs')
    const docsDir = join(__dirname, '..', 'prd')
    const outPath = join(siteConfig.outDir, 'Tend-PRD.pdf')
    await generatePdf(docsDir, outPath)
    console.log('PDF generated at', outPath)
  }
})
