# Orb videos

Place finalized orb video clips here. Naming:

- `01-orb-origin.mp4` … `08-orb-becoming.mp4` (story orbs)
- `09-orb-root.mp4` (identity/root orb)

## If videos don’t show in the browser

Browsers need **web-compatible MP4** (H.264 video, AAC audio). If your files were exported in another codec or from a phone/editor that uses a different format, convert them:

1. Install [ffmpeg](https://ffmpeg.org/) (e.g. `brew install ffmpeg` on macOS).
2. From the project root run:
   ```bash
   npm run convert-videos
   ```
3. This creates `*-web.mp4` versions. After checking they play, you can replace the originals:
   ```bash
   cd public/memories/videos
   for f in *-web.mp4; do mv "$f" "${f%-web.mp4}.mp4"; done
   ```
   (Back up originals first if needed.)

You can also convert manually, e.g.:
```bash
ffmpeg -i input.mp4 -c:v libx264 -profile:v main -movflags +faststart -pix_fmt yuv420p -c:a aac -b:a 128k output.mp4
```

Open the browser console (F12 → Console) when loading the site; any video load errors will be logged there.
