// Generates print-ready QR codes that point to the canonical production URL.
// Usage: npm run qr   → writes qr/studio-figura-qr.svg and .png (not deployed)
import fs from 'node:fs'
import path from 'node:path'
import QRCode from 'qrcode'

const URL = 'https://www.lokalizacjesf.pl/'
const outDir = path.resolve(import.meta.dirname, '../qr')
fs.mkdirSync(outDir, { recursive: true })

const options = {
  errorCorrectionLevel: 'H', // tolerant to print damage / small logo overlays
  margin: 4,
  color: { dark: '#0f241b', light: '#ffffff' },
}

fs.writeFileSync(path.join(outDir, 'studio-figura-qr.svg'), await QRCode.toString(URL, { ...options, type: 'svg' }))
await QRCode.toFile(path.join(outDir, 'studio-figura-qr.png'), URL, { ...options, width: 2048 })
console.log(`QR codes for ${URL} written to ${outDir}`)
