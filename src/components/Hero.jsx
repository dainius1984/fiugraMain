import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import HeroMedia from './HeroMedia'
import { EASE } from './Reveal'
import { plural } from '../lib/studio-utils'

const LINES = [
  { words: ['Twoje', 'piękno'], className: 'text-ink-900' },
  // The dash is glued to "nasza" (no-break space) so it can never end up alone on a line.
  { words: ['—\u00A0nasza', 'specjalność.'], className: 'italic text-brand-400' },
]

export default function Hero({ studioCount }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Restrained scroll response: the media drifts closer by a few percent, nothing more.
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const studiosLabel = plural(studioCount, ['studio', 'studia', 'studiów'])

  let wordIndex = 0

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-ivory-100 pb-8 pt-20 text-ink-900 md:pb-12 md:pt-24 lg:flex lg:min-h-[min(100svh,960px)] lg:items-center lg:pb-16 lg:pt-28"
    >
      <div className="container-site flex flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-16">
        {/* Media — campaign photo (or video when supplied), otherwise the natural-light artwork */}
        <div className="relative lg:order-2">
          {/* Reserved box (fixed aspect ratio) → no layout shift while the photo loads */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
            className="group/hero relative aspect-[16/9] max-h-[30svh] w-full overflow-hidden rounded-[1.25rem] bg-ivory-200 md:aspect-[16/8] md:max-h-[40svh] lg:ml-auto lg:aspect-[4/5] lg:max-h-[min(76svh,720px)] xl:max-h-[min(80svh,820px)] lg:rounded-[2rem] lg:rounded-tl-[9rem]"
          >
            <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { scale: mediaScale }}>
              {/* Barely-there hover drift for mouse users */}
              <div className="absolute inset-0 transition-transform duration-[1800ms] ease-luxe motion-reduce:transition-none [@media(hover:hover)]:group-hover/hero:scale-[1.025] motion-reduce:[@media(hover:hover)]:group-hover/hero:scale-100">
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2.4, ease: EASE, delay: 0.1 }}
                >
                  <HeroMedia />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Offset orange hairline — editorial layering (desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 hidden translate-x-5 translate-y-5 rounded-[2rem] rounded-tl-[9rem] border border-brand-300 lg:block"
          />

          {/* Editorial caption (desktop only): sits on the lower-left edge, clear of both faces */}
          <motion.a
            href="#mapa"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE, delay: reduceMotion ? 0 : 1.3 }}
            className="group absolute -left-6 bottom-10 hidden rounded-xl bg-ivory-50/92 px-4 py-3 ring-1 ring-brand-200/80 backdrop-blur-sm lg:block"
          >
            <span className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-600">
              <span aria-hidden="true" className="h-px w-4 bg-brand-400" />
              Studio Figura
            </span>
            <span className="mt-1 block font-serif text-[1.15rem] italic leading-tight text-ink-900">Wrocław i okolice</span>
            <span className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] tracking-[0.04em] text-ink-600 transition-colors duration-500 group-hover:text-brand-600">
              Odkryj nasze lokalizacje
              <ArrowRight className="size-3 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
            </span>
          </motion.a>
        </div>

        {/* Copy */}
        <div className="lg:order-1">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.38em' }}
            transition={{ duration: reduceMotion ? 0 : 1.6, ease: EASE, delay: reduceMotion ? 0 : 0.2 }}
            className="eyebrow mb-4 flex items-center gap-4 text-brand-600 md:mb-6"
          >
            <span aria-hidden="true" className="h-px w-10 bg-brand-400" />
            Studio Figura
          </motion.p>

          <h1
            id="hero-heading"
            // Sized so the longer line ("— nasza specjalność.", ≈7.3em wide) always fits its column;
            // on phones it scales with the viewport (column = 100vw − 2.5rem).
            className="font-serif text-[min(2.75rem,calc((100vw-2.5rem)/7.6))] font-normal leading-[1.02] tracking-[-0.01em] sm:text-7xl lg:text-[3.6rem] xl:text-[4.3rem]"
          >
            {LINES.map((line, li) => (
              <span key={li} className={`block whitespace-nowrap ${line.className}`}>
                {line.words.map((word) => {
                  const i = wordIndex++
                  return (
                    <span key={word + i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={reduceMotion ? false : { y: '105%', opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: reduceMotion ? 0 : 1.2, ease: EASE, delay: reduceMotion ? 0 : 0.4 + i * 0.12 }}
                      >
                        {word}
                      </motion.span>
                      {' '}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE, delay: reduceMotion ? 0 : 1 }}
            className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-ink-600 md:mt-6 md:text-lg lg:mt-8"
          >
            Nowoczesne technologie, modelowanie sylwetki, kosmetologia estetyczna, pielęgnacja twarzy.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE, delay: reduceMotion ? 0 : 1.15 }}
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-10"
          >
            <motion.a
              href="#mapa"
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="group relative isolate inline-flex min-h-14 items-center justify-between gap-6 overflow-hidden rounded-full bg-ink-900 py-2 pl-7 pr-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ivory-50 transition-colors duration-500 ease-luxe sm:justify-start"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand-600 transition-transform duration-500 ease-luxe group-hover:scale-x-100"
              />
              Znajdź swoje studio
              <span className="grid size-10 place-items-center rounded-full bg-brand-400 text-ivory-50 transition-[transform,background-color,color] duration-500 ease-luxe group-hover:translate-y-0.5 group-hover:bg-ivory-50 group-hover:text-brand-600">
                <ArrowDown className="size-4" strokeWidth={1.75} />
              </span>
            </motion.a>

            <p className="text-sm leading-relaxed text-ink-600 sm:max-w-[15rem] lg:hidden">
              {studioCount} {studiosLabel} — wybierz swoje na mapie.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
