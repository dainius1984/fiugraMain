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

function detectHeroMedia() {
  return {
    video: exists('videos/studio-figura-hero.mp4') ? '/videos/studio-figura-hero.mp4' : null,
    videoWebm: exists('videos/studio-figura-hero.webm') ? '/videos/studio-figura-hero.webm' : null,
    videoMobile: exists('videos/studio-figura-hero-mobile.mp4') ? '/videos/studio-figura-hero-mobile.mp4' : null,
    poster: firstExisting(IMAGE_EXT.map((ext) => `images/hero-poster${ext}`)),
  }
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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __HERO_MEDIA__: JSON.stringify({
      ...hero,
      poster: hero.poster ? `/${hero.poster}` : null,
    }),
    __STUDIO_IMAGES__: JSON.stringify(detectStudioImages()),
  },
})
