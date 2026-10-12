import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import fs from 'node:fs'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const resumes = ['Unice_Bondoc_Resume', 'Unice_Bondoc_CV_Graduate_Software']

const browserCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
]
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate))

const browser = await puppeteer.launch({
  headless: 'new',
  ...(executablePath ? { executablePath } : {}),
})
try {
  const page = await browser.newPage()
  await page.emulateMediaType('print')
  for (const name of resumes) {
    const source = pathToFileURL(path.join(root, `public/resume/${name}.html`)).href
    const output = path.join(root, `public/resume/${name}.pdf`)
    await page.goto(source, { waitUntil: 'networkidle0' })
    const overflow = await page.evaluate(() => [...document.querySelectorAll('.page')]
      .map((element, index) => ({
        page: index + 1,
        contentBottom: element.querySelector('.page-content').getBoundingClientRect().bottom,
        footerTop: element.querySelector('footer').getBoundingClientRect().top,
      }))
      .filter(({ contentBottom, footerTop }) => contentBottom > footerTop - 8))
    if (overflow.length) throw new Error(`Resume content overlaps footer: ${name} ${JSON.stringify(overflow)}`)
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    })
    console.log(`Generated ${output}`)
  }
} finally {
  await browser.close()
}
