import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Detects optional media placed in /public so the site never references
 * files that do not exist. Restart `npm run dev` after adding new media.
 */
const publicDir = path.resolve(import.meta.dirname, 'public')
const exists = (rel) => fs.existsSync(path.join(publicDir, rel))
const firstExisting = (candidates) => candidates.find(exists) ?? null

const IMAGE_EXT = ['.webp', '.avif', '.jpg', '.jpeg', '.png']

/**
 * Responsive hero photo: public/images/hero-poster-<width>x<height>.{avif,webp}
 * (several widths of the same image). Produces srcset strings, the largest WebP as the
 * fallback src, and its intrinsic size for width/height attributes.
 */
function detectHeroPhoto() {
  const dir = path.join(publicDir, 'images')
  if (!fs.existsSync(dir)) return null
  const variants = fs
    .readdirSync(dir)
    .map((file) => file.match(/^hero-poster-(\d+)x(\d+)\.(avif|webp)$/))
    .filter(Boolean)
    .map(([file, w, h, type]) => ({ url: `/images/${file}`, width: Number(w), height: Number(h), type }))
    .sort((a, b) => a.width - b.width)
  const webp = variants.filter((v) => v.type === 'webp')
  if (webp.length === 0) return null
  const srcset = (list) => list.map((v) => `${v.url} ${v.width}w`).join(', ')
  const largest = webp.at(-1)
  return {
    avif: srcset(variants.filter((v) => v.type === 'avif')) || null,
    webp: srcset(webp),
    src: largest.url,
    width: largest.width,
    height: largest.height,
  }
}

/**
 * Rendered width of the hero photo, for the browser's srcset choice: the desktop frame is
 * portrait (4:5, up to ~720px tall), so the 3:2 photo renders about 1.5× the frame height.
 */
const HERO_SIZES = '(min-width: 1024px) 1080px, calc(100vw - 2.5rem)'

function detectHeroMedia() {
  return {
    photo: detectHeroPhoto(),
    sizes: HERO_SIZES,
    video: exists('videos/studio-figura-hero.mp4') ? '/videos/studio-figura-hero.mp4' : null,
    videoWebm: exists('videos/studio-figura-hero.webm') ? '/videos/studio-figura-hero.webm' : null,
    videoMobile: exists('videos/studio-figura-hero-mobile.mp4') ? '/videos/studio-figura-hero-mobile.mp4' : null,
    poster: firstExisting(IMAGE_EXT.map((ext) => `images/hero-poster${ext}`)),
    posterMobile: firstExisting(IMAGE_EXT.map((ext) => `images/hero-poster-mobile${ext}`)),
  }
}

const LOGO_EXT = ['.svg', '.webp', '.png']

/** Intrinsic size of a PNG (read from its IHDR header) — used for width/height attributes (no layout shift). */
function pngSize(rel) {
  const file = path.join(publicDir, rel)
  if (!fs.existsSync(file)) return null
  const head = Buffer.alloc(24)
  const fd = fs.openSync(file, 'r')
  fs.readSync(fd, head, 0, 24, 0)
  fs.closeSync(fd)
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) }
}

/**
 * Official logo files in public/images/brand/ (only authorised assets):
 *  - studio-figura-logo.*        full lockup (SF monogram, STUDIO FIGURA, orange rule) — light backgrounds
 *  - studio-figura-logo-light.*  same lockup with white lettering — dark backgrounds (footer)
 *  - studio-figura-mark.*        SF monogram only — compact navigation
 * WebP is preferred; a PNG of the same name supplies the intrinsic size.
 */
function detectBrandLogo() {
  const asset = (name) => {
    const file = firstExisting(LOGO_EXT.map((ext) => `images/brand/${name}${ext}`))
    return file ? { src: `/${file}`, ...pngSize(`images/brand/${name}.png`) } : null
  }
  return { dark: asset('studio-figura-logo'), light: asset('studio-figura-logo-light'), mark: asset('studio-figura-mark') }
}

function detectStudioImages() {
  const dir = path.join(publicDir, 'images/studios')
  if (!fs.existsSync(dir)) return {}
  const map = {}
  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase()
    if (!IMAGE_EXT.includes(ext)) continue
    const id = path.basename(file, path.extname(file))
    // Prefer the first format in IMAGE_EXT order (webp > avif > jpg > png).
    if (!map[id] || IMAGE_EXT.indexOf(ext) < IMAGE_EXT.indexOf(path.extname(map[id]))) {
      map[id] = `/images/studios/${file}`
    }
  }
  return map
}

const hero = detectHeroMedia()

/** Preloads the hero photo from index.html so it starts downloading before the app script runs. */
function heroPreload() {
  return {
    name: 'studio-figura-hero-preload',
    transformIndexHtml() {
      const photo = hero.photo
      if (!photo) return []
      const best = photo.avif ? { srcset: photo.avif, type: 'image/avif' } : { srcset: photo.webp, type: 'image/webp' }
      return [
        {
          tag: 'link',
          attrs: { rel: 'preload', as: 'image', imagesrcset: best.srcset, imagesizes: HERO_SIZES, type: best.type, fetchpriority: 'high' },
          injectTo: 'head',
        },
      ]
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), heroPreload()],
  // MapLibre (~1 MB) is a lazy chunk loaded only after the visitor activates the map.
  build: { chunkSizeWarningLimit: 1200 },
  define: {
    __HERO_MEDIA__: JSON.stringify({
      ...hero,
      poster: hero.poster ? `/${hero.poster}` : null,
      posterMobile: hero.posterMobile ? `/${hero.posterMobile}` : null,
    }),
    __BRAND_LOGO__: JSON.stringify(detectBrandLogo()),
    __STUDIO_IMAGES__: JSON.stringify(detectStudioImages()),
  },
})
