import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../lib/hooks'

const MEDIA = typeof __HERO_MEDIA__ !== 'undefined' ? __HERO_MEDIA__ : {}

/**
 * Focal point for photo/video crops ("x% y%"). The frame is portrait on desktop and
 * landscape on phones; 35% 22% keeps both faces and upper bodies of the campaign photo in frame.
 */
const MEDIA_FOCUS = '35% 22%'

/** Short description of the campaign photo for screen readers. */
const PHOTO_ALT = 'Kobieta i mężczyzna w strojach sportowych w jasnym, ciepłym wnętrzu'

const PHOTO = MEDIA.photo
const LEGACY_POSTER = MEDIA.poster
/** Still image used by the video element and as the visible hero picture. */
const POSTER_SRC = PHOTO?.src ?? LEGACY_POSTER ?? null

/** True when a photograph or video has been supplied (otherwise the built-in artwork is shown). */
export const hasHeroMedia = Boolean(PHOTO || LEGACY_POSTER || MEDIA.posterMobile || MEDIA.video || MEDIA.videoMobile)

/**
 * Hero media, in order of preference:
 *   1. Video — /videos/studio-figura-hero.mp4 on desktop, /videos/studio-figura-hero-mobile.mp4 on phones.
 *      Never loaded for reduced-motion or data-saver visitors; the photo stays visible underneath.
 *   2. Campaign photo — responsive /images/hero-poster-<w>x<h>.{avif,webp} (generated from /images/1.png),
 *      or a single /images/hero-poster.* file.
 *   3. Built-in "natural light" artwork — only when no photo exists; clearly decorative.
 * Only files that exist at build time are referenced, so there are no broken media elements.
 */
export default function HeroMedia() {
  const reduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const conn = navigator.connection
    setSaveData(Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? ''))
  }, [])

  const src = isDesktop ? MEDIA.video : MEDIA.videoMobile
  const webm = isDesktop ? MEDIA.videoWebm : null
  const playVideo = Boolean(src) && !reduceMotion && !saveData

  // Pause playback while the hero is off-screen to save battery and CPU.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [playVideo, src])

  const imgProps = {
    fetchPriority: 'high',
    loading: 'eager',
    decoding: 'async',
    className: 'absolute inset-0 h-full w-full object-cover',
    style: { objectPosition: MEDIA_FOCUS },
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ivory-200">
      {PHOTO ? (
        <picture>
          {PHOTO.avif && <source type="image/avif" srcSet={PHOTO.avif} sizes={MEDIA.sizes} />}
          <source type="image/webp" srcSet={PHOTO.webp} sizes={MEDIA.sizes} />
          <img src={PHOTO.src} width={PHOTO.width} height={PHOTO.height} alt={PHOTO_ALT} {...imgProps} />
        </picture>
      ) : LEGACY_POSTER ? (
        <picture>
          {MEDIA.posterMobile && <source media="(max-width: 767px)" srcSet={MEDIA.posterMobile} />}
          <img src={LEGACY_POSTER} alt={PHOTO_ALT} {...imgProps} />
        </picture>
      ) : (
        <>
          <HeroArtwork />
          {MEDIA.posterMobile && <img src={MEDIA.posterMobile} alt={PHOTO_ALT} {...imgProps} className={`${imgProps.className} md:hidden`} />}
        </>
      )}

      {playVideo && (
        <video
          key={src}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-luxe ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={(isDesktop ? POSTER_SRC : MEDIA.posterMobile ?? POSTER_SRC) ?? undefined}
          style={{ objectPosition: MEDIA_FOCUS }}
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
          disablePictureInPicture
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

/** Points along a quadratic curve, used to grow the palm-frond shadow. */
function frond() {
  const p0 = [860, -40]
  const p1 = [640, 160]
  const p2 = [430, 560]
  const leaves = []
  for (let i = 1; i <= 13; i++) {
    const t = i / 14
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    const length = 230 - i * 11
    leaves.push({ x, y, angle: angle - 48, length }, { x, y, angle: angle + 48, length: length * 0.92 })
  }
  return { path: `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`, leaves }
}

const FROND = frond()

/**
 * Built-in fallback: warm wall, soft window light and a gently swaying palm shadow —
 * a calm "natural light" atmosphere in the brand palette. Purely decorative.
 */
function HeroArtwork() {
  const token = (name) => `var(--color-${name})`
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hero-wall" x1="0.9" y1="0" x2="0.2" y2="1">
            <stop offset="0" style={{ stopColor: token('ivory-50') }} />
            <stop offset="0.5" style={{ stopColor: token('ivory-100') }} />
            <stop offset="1" style={{ stopColor: token('brand-100') }} />
          </linearGradient>
          <radialGradient id="hero-sun" cx="0.78" cy="0.22" r="0.55">
            <stop offset="0" style={{ stopColor: token('brand-200') }} stopOpacity="0.85" />
            <stop offset="1" style={{ stopColor: token('brand-100') }} stopOpacity="0" />
          </radialGradient>
          <filter id="hero-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <rect width="800" height="1000" fill="url(#hero-wall)" />
        <rect width="800" height="1000" fill="url(#hero-sun)" />

        {/* Window light falling across the wall */}
        <g filter="url(#hero-soft)" style={{ fill: token('ivory-50') }}>
          {[0, 1, 2].map((i) => (
            <polygon
              key={i}
              points={`${330 + i * 150},0 ${430 + i * 150},0 ${150 + i * 150},1000 ${50 + i * 150},1000`}
              opacity={0.75 - i * 0.12}
            />
          ))}
        </g>
        {/* Window mullion shadows between the light shafts */}
        <g filter="url(#hero-soft)" style={{ fill: token('ink-900') }} opacity="0.05">
          {[0, 1].map((i) => (
            <polygon key={i} points={`${440 + i * 150},0 ${470 + i * 150},0 ${190 + i * 150},1000 ${160 + i * 150},1000`} />
          ))}
        </g>

        {/* Palm frond shadow */}
        <g className="hero-sway" filter="url(#hero-shadow)" style={{ fill: token('ink-900'), stroke: token('ink-900') }} opacity="0.11">
          <path d={FROND.path} fill="none" strokeWidth="6" strokeLinecap="round" />
          {FROND.leaves.map((leaf, i) => (
            <path
              key={i}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}
              d={`M 0 0 C ${leaf.length * 0.3} -${leaf.length * 0.11}, ${leaf.length * 0.75} -${leaf.length * 0.07}, ${leaf.length} 0 C ${leaf.length * 0.75} ${leaf.length * 0.06}, ${leaf.length * 0.3} ${leaf.length * 0.1}, 0 0 Z`}
              stroke="none"
            />
          ))}
        </g>

        {/* Floor line and a single warm accent */}
        <rect y="840" width="800" height="160" style={{ fill: token('brand-100') }} opacity="0.55" />
        <line x1="0" y1="840" x2="800" y2="840" style={{ stroke: token('brand-300') }} strokeWidth="1" />
        <circle cx="600" cy="400" r="74" fill="none" style={{ stroke: token('brand-400') }} strokeOpacity="0.55" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
