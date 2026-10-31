import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../lib/hooks'

const MEDIA = typeof __HERO_MEDIA__ !== 'undefined' ? __HERO_MEDIA__ : {}

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
    <div className="absolute inset-0 overflow-hidden bg-forest-950">
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

/** Built-in image fallback: layered light, arches and grain in brand colours. */
function HeroArtwork() {
  return (
    <div aria-hidden="true" className="grain absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_20%,#2c5a45_0%,#163326_38%,#0a1912_78%)]" />
      <div className="animate-drift absolute -right-[20%] -top-[25%] h-[85%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(236,220,184,0.32)_0%,rgba(201,169,110,0.12)_40%,transparent_70%)] blur-2xl" />
      <div
        className="animate-drift absolute -bottom-[30%] -left-[15%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(44,90,69,0.7)_0%,transparent_70%)] blur-3xl"
        style={{ animationDelay: '-9s' }}
      />
      <div className="absolute inset-y-0 left-[38%] w-[28%] -skew-x-[18deg] bg-gradient-to-b from-ivory-100/[0.07] via-ivory-100/[0.03] to-transparent blur-xl" />

      <svg
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMaxYMax slice"
        className="absolute bottom-0 right-0 h-[92%] w-full opacity-70 md:w-[62%]"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const w = 260 + i * 92
          const cx = 560
          const top = 190 + i * 36
          return (
            <path
              key={i}
              d={`M ${cx - w / 2} 1000 V ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V 1000`}
              fill="none"
              stroke="#c9a96e"
              strokeOpacity={0.42 - i * 0.065}
              strokeWidth={i === 0 ? 1.4 : 0.9}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
    </div>
  )
}
