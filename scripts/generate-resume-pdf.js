import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const source = `file://${path.join(root, 'public/resume/Unice_Bondoc_Resume.html')}`
const output = path.join(root, 'public/resume/Unice_Bondoc_Resume.pdf')

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
  await page.goto(source, { waitUntil: 'networkidle0' })
  await page.pdf({
    path: output,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  })
  console.log(`Generated ${output}`)
} finally {
  await browser.close()
}
