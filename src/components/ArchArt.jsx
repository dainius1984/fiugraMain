import { useId } from 'react'

/**
 * Decorative, brand-coloured artwork (nested arches + soft light).
 * Used as an elegant placeholder until real studio photography is supplied.
 * It is clearly illustrative — never presented as a photo of a studio.
 */
export default function ArchArt({ variant = 0, className = '', label }) {
  const uid = useId().replace(/:/g, '')
  const centers = [250, 150, 280, 120, 210, 170]
  const cx = centers[variant % centers.length]
  const arches = [0, 1, 2, 3, 4]

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#1f4433" />
          <stop offset="0.55" stopColor="#163326" />
          <stop offset="1" stopColor="#0a1912" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx={cx / 400} cy="0.35" r="0.55">
          <stop offset="0" stopColor="#ecdcb8" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#c9a96e" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c9a96e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f1e7" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f6f1e7" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#bg-${uid})`} />
      <rect width="400" height="300" fill={`url(#glow-${uid})`} />
      <polygon points={`${cx - 150},0 ${cx - 70},0 ${cx + 120},300 ${cx - 10},300`} fill={`url(#beam-${uid})`} />

      {arches.map((i) => {
        const w = 70 + i * 34
        const top = 90 + i * 16 - (variant % 2) * 10
        const x0 = cx - w / 2
        const x1 = cx + w / 2
        return (
          <path
            key={i}
            d={`M ${x0} 300 V ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x1} ${top + w / 2} V 300`}
            fill="none"
            stroke="#c9a96e"
            strokeOpacity={0.55 - i * 0.1}
            strokeWidth={i === 0 ? 1.2 : 0.8}
          />
        )
      })}
      <line x1="0" y1="262" x2="400" y2="262" stroke="#c9a96e" strokeOpacity="0.18" strokeWidth="0.6" />
    </svg>
  )
}
