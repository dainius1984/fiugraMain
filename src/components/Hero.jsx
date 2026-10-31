import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import HeroMedia, { hasMobileHeroMedia } from './HeroMedia'
import { EASE } from './Reveal'
import { plural } from '../lib/studio-utils'

const LINES = [
  { words: ['Twoje', 'piękno.'], className: 'text-ink-900' },
  { words: ['Twoje', 'miejsce.'], className: 'italic text-gold-500' },
]

export default function Hero({ studioCount }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])

  let wordIndex = 0

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-ivory-100 pb-6 pt-28 text-ink-900 md:flex md:min-h-[min(100svh,980px)] md:items-center md:pb-16 md:pt-28"
    >
      {/* Quiet architectural line work behind the text */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="absolute -left-24 -top-10 -z-10 h-[420px] w-[420px] opacity-60 md:-left-40 md:h-[640px] md:w-[640px]"
      >
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="200" cy="200" r={110 + i * 42} fill="none" stroke="#b6975c" strokeOpacity={0.28 - i * 0.07} strokeWidth="0.8" />
        ))}
      </svg>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-12">
        <motion.div style={reduceMotion ? undefined : { y: contentY }} className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.38em' }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
            className="eyebrow mb-5 flex items-center gap-4 text-gold-600 md:mb-7"
          >
            <span aria-hidden="true" className="h-px w-10 bg-gold-400" />
            Studio Figura
          </motion.p>

          <h1
            id="hero-heading"
            className="font-serif text-[3.2rem] font-normal leading-[0.98] tracking-[-0.01em] sm:text-7xl md:text-[5.6rem] lg:text-[7.4rem]"
          >
            {LINES.map((line, li) => (
              <span key={li} className={`block ${line.className}`}>
                {line.words.map((word) => {
                  const i = wordIndex++
                  return (
                    <span key={word + i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '105%', opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.3, ease: EASE, delay: 0.45 + i * 0.14 }}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.15 }}
            className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-600 md:mt-8 md:text-lg"
          >
            Znajdź swoje Studio Figura i odkryj przestrzeń stworzoną z myślą o Tobie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.35 }}
            className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 md:mt-10"
          >
            <motion.a
              href="#studia"
              whileTap={{ scale: 0.97 }}
              className="group relative isolate inline-flex min-h-14 items-center justify-between gap-6 overflow-hidden rounded-full bg-ink-900 py-2 pl-7 pr-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-ivory-50 transition-colors duration-500 ease-luxe hover:text-ink-900 sm:justify-start"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold-200 transition-transform duration-500 ease-luxe group-hover:scale-x-100"
              />
              Znajdź swoje studio
              <span className="grid size-10 place-items-center rounded-full bg-gold-400 text-ink-900 transition-transform duration-500 ease-luxe group-hover:translate-y-0.5">
                <ArrowDown className="size-4" strokeWidth={1.75} />
              </span>
            </motion.a>

            <p className="text-sm leading-relaxed text-ink-600 sm:max-w-[15rem]">
              {studioCount} {plural(studioCount, ['studio', 'studia', 'studiów'])} — wybierz najbliższe i przejdź na jego stronę.
            </p>
          </motion.div>
        </motion.div>

        {/* Arch-framed media: video / poster / built-in artwork */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
          className={`relative md:col-span-5 ${hasMobileHeroMedia ? '' : 'hidden md:block'}`}
        >
          <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] ring-1 ring-gold-300/60 md:aspect-[4/5] md:max-w-[460px]">
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={reduceMotion ? undefined : { y: mediaY, scale: mediaScale }}
              initial={reduceMotion ? false : { scale: 1.12 }}
              animate={reduceMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 2.8, ease: EASE }}
            >
              <HeroMedia />
            </motion.div>
          </div>
          {/* Offset gold outline for an editorial, layered feel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 mx-auto hidden translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[1.5rem] border border-gold-400/40 md:block md:max-w-[460px]"
          />
        </motion.div>
      </div>
    </section>
  )
}
