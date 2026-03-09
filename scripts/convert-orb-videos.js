#!/usr/bin/env node
/**
 * Convert orb videos in public/memories/videos/ to web-compatible H.264/MP4.
 * Run: node scripts/convert-orb-videos.js
 * Requires: ffmpeg in PATH (install via Homebrew: brew install ffmpeg)
 *
 * Creates ...-web.mp4 next to each source. Replace originals with these if needed.
 */
import { readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const VIDEOS_DIR = join(__dirname, '..', 'public', 'memories', 'videos')

if (!existsSync(VIDEOS_DIR)) {
  console.error('Directory not found:', VIDEOS_DIR)
  process.exit(1)
}

const files = readdirSync(VIDEOS_DIR).filter((f) => f.endsWith('.mp4') && !f.endsWith('-web.mp4'))
if (files.length === 0) {
  console.log('No .mp4 files found in', VIDEOS_DIR)
  process.exit(0)
}

function runFfmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // H.264 main profile, faststart for web, yuv420p for compatibility, copy audio
    const args = [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-level', '4.0',
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y',
      outputPath,
    ]
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stderr = ''
    proc.stderr.on('data', (d) => { stderr += d.toString() })
    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr.slice(-500) || `ffmpeg exited ${code}`))
    })
    proc.on('error', (err) => reject(err))
  })
}

async function main() {
  console.log('Converting', files.length, 'video(s) to web-compatible H.264/MP4...\n')
  for (const f of files) {
    const base = f.replace(/\.mp4$/i, '')
    const inputPath = join(VIDEOS_DIR, f)
    const outputPath = join(VIDEOS_DIR, `${base}-web.mp4`)
    try {
      await runFfmpeg(inputPath, outputPath)
      console.log('  OK:', f, '->', `${base}-web.mp4`)
    } catch (err) {
      if (err.code === 'ENOENT' || err.message.includes('spawn ffmpeg')) {
        console.error('\nffmpeg not found. Install it first:')
        console.error('  macOS: brew install ffmpeg')
        console.error('  Ubuntu: sudo apt install ffmpeg')
        process.exit(1)
      }
      console.error('  FAIL:', f, err.message)
    }
  }
  console.log('\nDone. If you want to use the converted files, rename -web.mp4 to .mp4 (backup originals first).')
}

main()
