/**
 * Regenerates the served brand assets from the source artwork in `assets/`.
 * Run with: node scripts/build-brand-assets.mjs
 *
 * See docs/brand-assets.md for why the wordmark needs its background keyed out.
 */
import sharp from "sharp"
import { statSync } from "node:fs"

/** Measured from assets/brand-name.png: background 241.5-255, artwork 25-150. */
const CLEAR = 238
const OPAQUE = 200
/** Alpha above this counts as content when finding the crop box. */
const CONTENT_ALPHA = 24

async function keyAndTrim(src, dest, targetWidth) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const out = Buffer.alloc(w * h * 4)
  let minX = w, minY = h, maxX = -1, maxY = -1

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 3
      const d = (y * w + x) * 4
      const [r, g, b] = [data[s], data[s + 1], data[s + 2]]
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b
      const alpha = Math.min(255, Math.max(0, Math.round(((CLEAR - luminance) / (CLEAR - OPAQUE)) * 255)))
      if (alpha === 0) continue
      out[d] = r
      out[d + 1] = g
      out[d + 2] = b
      out[d + 3] = alpha
      if (alpha > CONTENT_ALPHA) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const pad = 6
  const left = Math.max(0, minX - pad)
  const top = Math.max(0, minY - pad)
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({
      left,
      top,
      width: Math.min(w - left, maxX - minX + 1 + pad * 2),
      height: Math.min(h - top, maxY - minY + 1 + pad * 2),
    })
    .resize({ width: targetWidth, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(dest)
}

async function icon(size, pad, dest) {
  const inner = await sharp("public/brand/sedra-mark.png")
    .resize({ height: size - pad * 2, fit: "inside" })
    .toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: "#0A2226" } })
    .composite([{ input: inner, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(dest)
}

// The mark already ships with a real alpha channel, so it only needs trimming.
await sharp("assets/logo-icon.png")
  .trim({ threshold: 1 })
  .resize({ height: 320, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile("public/brand/sedra-mark.png")

await keyAndTrim("assets/brand-name.png", "public/brand/sedra-wordmark.png", 1200)
await icon(512, 56, "app/icon.png")
await icon(180, 20, "app/apple-icon.png")

for (const file of [
  "public/brand/sedra-mark.png",
  "public/brand/sedra-wordmark.png",
  "app/icon.png",
  "app/apple-icon.png",
]) {
  const { width, height } = await sharp(file).metadata()
  console.log(`${file} -> ${width}x${height}, ${(statSync(file).size / 1024).toFixed(0)}KB`)
}
