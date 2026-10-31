import { useId } from 'react'

/**
 * Distinct illustrative artwork per studio card, used until authorised photos exist.
 * Abstract and clearly decorative — never presented as a photograph of a location.
 */
// Every colour derives from the theme tokens in index.css (no hardcoded hex values).
const token = (name) => `var(--color-${name})`
const mix = (name, pct, base = 'ivory-50') => `color-mix(in srgb, ${token(name)} ${pct}%, ${token(base)})`

const PALETTES = [
  { from: token('ivory-50'), via: token('ivory-100'), to: token('brand-100'), glow: token('ivory-50'), line: token('brand-400') }, // porcelain
  { from: token('brand-50'), via: token('brand-100'), to: mix('brand-200', 85), glow: token('ivory-50'), line: token('brand-500') }, // apricot
  { from: token('ivory-100'), via: token('ivory-200'), to: token('ivory-300'), glow: token('ivory-50'), line: token('brand-400') }, // stone
  { from: token('ivory-50'), via: token('brand-100'), to: token('brand-200'), glow: token('brand-50'), line: token('brand-600') }, // blush
  { from: token('ivory-100'), via: mix('brand-100', 70, 'ivory-200'), to: mix('brand-300', 35, 'ivory-200'), glow: token('ivory-50'), line: token('brand-500') }, // linen
]

function Arches({ c }) {
  return [0, 1, 2, 3, 4].map((i) => {
    const w = 80 + i * 36
    const cx = 290
    const top = 70 + i * 14
    return (
      <path
        key={i}
        d={`M ${cx - w / 2} 250 V ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V 250`}
        fill="none"
        style={{ stroke: c.line }}
        strokeOpacity={0.6 - i * 0.11}
        strokeWidth={i === 0 ? 1.3 : 0.8}
      />
    )
  })
}

function Sunrise({ c }) {
  return (
    <>
      <circle cx="285" cy="168" r="62" fillOpacity="0.16" style={{ fill: c.glow }} />
      <circle cx="285" cy="168" r="62" fill="none" style={{ stroke: c.line }} strokeOpacity="0.65" strokeWidth="1.1" />
      <circle cx="285" cy="168" r="84" fill="none" style={{ stroke: c.line }} strokeOpacity="0.2" strokeWidth="0.7" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={140 + i * 8}
          x2={400}
          y1={196 + i * 10}
          y2={196 + i * 10}
          style={{ stroke: c.line }}
          strokeOpacity={0.45 - i * 0.06}
          strokeWidth="0.7"
        />
      ))}
    </>
  )
}

function Arcade({ c }) {
  return [0, 1, 2, 3, 4].map((i) => {
    const x = 150 + i * 52
    const w = 38
    const top = 92
    return (
      <path
        key={i}
        d={`M ${x} 250 V ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2} V 250`}
        fillOpacity={0.04 + i * 0.015}
        style={{ fill: c.glow, stroke: c.line }}
        strokeOpacity={0.55 - i * 0.06}
        strokeWidth="0.9"
      />
    )
  })
}

function Ripple({ c }) {
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx="320"
          cy="70"
          r={24 + i * 26}
          fill="none"
          style={{ stroke: c.line }}
          strokeOpacity={0.6 - i * 0.09}
          strokeWidth={i === 0 ? 1.2 : 0.7}
        />
      ))}
      <path d="M 170 250 C 220 190, 250 150, 330 120" fill="none" style={{ stroke: c.line }} strokeOpacity="0.5" strokeWidth="0.9" />
      <path d="M 250 166 C 262 140, 290 128, 312 128 C 300 150, 278 164, 250 166 Z" fillOpacity="0.22" style={{ fill: c.line }} />
    </>
  )
}

function Drape({ c }) {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const x = 180 + i * 30
    return (
      <path
        key={i}
        d={`M ${x} 0 C ${x + 40} 70, ${x - 30} 150, ${x + 20} 250`}
        fill="none"
        style={{ stroke: c.line }}
        strokeOpacity={0.5 - Math.abs(i - 3) * 0.1}
        strokeWidth="0.9"
      />
    )
  })
}

const COMPOSITIONS = [Arches, Sunrise, Arcade, Ripple, Drape]

export default function StudioArt({ variant = 0, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const c = PALETTES[variant % PALETTES.length]
  const Composition = COMPOSITIONS[variant % COMPOSITIONS.length]

  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" style={{ stopColor: c.from }} />
          <stop offset="0.55" style={{ stopColor: c.via }} />
          <stop offset="1" style={{ stopColor: c.to }} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.72" cy="0.3" r="0.6">
          <stop offset="0" style={{ stopColor: c.glow }} stopOpacity="0.9" />
          <stop offset="1" style={{ stopColor: c.glow }} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#bg-${uid})`} />
      <rect width="400" height="250" fill={`url(#glow-${uid})`} />
      <Composition c={c} />
    </svg>
  )
}
