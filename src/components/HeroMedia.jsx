import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../lib/hooks'

const MEDIA = typeof __HERO_MEDIA__ !== 'undefined' ? __HERO_MEDIA__ : {}

/** True when real hero media exists for phones (otherwise the mobile hero stays text-only and compact). */
export const hasMobileHeroMedia = Boolean(MEDIA.poster || MEDIA.videoMobile)

/**
 * Cinematic hero background.
 * - Plays /videos/studio-figura-hero.mp4 when present (desktop only by default;
 *   phones get /videos/studio-figura-hero-mobile.mp4 if supplied, otherwise the still).
 * - Never loads video for reduced-motion or data-saver users.
 * - Falls back to /images/hero-poster.* or the built-in artwork — no broken links.
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

  return (
    <div className="absolute inset-0 overflow-hidden bg-ivory-200">
      <HeroArtwork />

      {MEDIA.poster && (
        <img
          src={MEDIA.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
          poster={MEDIA.poster ?? undefined}
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

/** Built-in image fallback: warm white light, champagne arches and a soft shadow play. */
function HeroArtwork() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_70%_15%,#ffffff_0%,#f3efe7_45%,#e6dccb_100%)]" />
      <div className="animate-drift absolute -right-[25%] -top-[20%] h-[80%] w-[90%] rounded-full bg-[radial-gradient(circle,rgba(232,221,200,0.9)_0%,rgba(182,151,92,0.18)_45%,transparent_70%)] blur-2xl" />
      <div
        className="animate-drift absolute -bottom-[25%] -left-[20%] h-[60%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(23,23,23,0.08)_0%,transparent_70%)] blur-3xl"
        style={{ animationDelay: '-9s' }}
      />
      <div className="absolute inset-y-0 left-[30%] w-[30%] -skew-x-[16deg] bg-gradient-to-b from-white/70 via-white/20 to-transparent blur-2xl" />

      <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 200 + i * 80
          const cx = 300
          const top = 240 + i * 34
          return (
            <path
              key={i}
              d={`M ${cx - w / 2} 900 V ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V 900`}
              fill="none"
              stroke="#b6975c"
              strokeOpacity={0.55 - i * 0.09}
              strokeWidth={i === 0 ? 1.4 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
    </div>
  )
}
