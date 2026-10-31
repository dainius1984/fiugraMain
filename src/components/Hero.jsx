import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import HeroMedia from './HeroMedia'
import { EASE } from './Reveal'
import { plural } from '../lib/studio-utils'

const LINES = [
  { words: ['Twoje', 'piękno.'], className: 'text-ivory-50' },
  { words: ['Twoje', 'miejsce.'], className: 'italic text-gold-200' },
]

export default function Hero({ studioCount }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  let wordIndex = 0

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate flex h-[74svh] min-h-[520px] items-end overflow-hidden bg-forest-950 text-ivory-100 md:h-svh md:min-h-[680px]"
    >
      {/* Media with slow cinematic settle + scroll parallax */}
      <motion.div
        className="absolute inset-0 -z-10 will-change-transform"
        style={reduceMotion ? undefined : { y: mediaY, scale: mediaScale }}
        initial={reduceMotion ? false : { scale: 1.14 }}
        animate={reduceMotion ? undefined : { scale: 1.06 }}
        transition={{ duration: 2.8, ease: EASE }}
      >
        <HeroMedia />
      </motion.div>

      {/* Dark gradient overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/70 via-transparent to-transparent"
      />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8 md:pb-20 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.38em' }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
          className="eyebrow mb-5 flex items-center gap-4 text-gold-300 md:mb-7"
        >
          <span aria-hidden="true" className="h-px w-10 bg-gold-400/70" />
          Studio Figura
        </motion.p>

        <h1
          id="hero-heading"
          className="font-serif text-[3.1rem] font-normal leading-[0.98] tracking-[-0.01em] sm:text-7xl md:text-8xl lg:text-[8.5rem]"
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
          className="mt-5 max-w-md text-base leading-relaxed text-ivory-100/80 md:mt-8 md:text-lg"
        >
          Znajdź swoje Studio Figura i odkryj przestrzeń stworzoną z myślą o Tobie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.35 }}
          className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center md:mt-10"
        >
          <motion.a
            href="#studia"
            whileTap={{ scale: 0.97 }}
            className="group relative isolate inline-flex min-h-14 items-center justify-between gap-6 overflow-hidden rounded-full bg-gold-400 py-2 pl-7 pr-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-forest-950 sm:justify-start"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold-200 transition-transform duration-500 ease-luxe group-hover:scale-x-100"
            />
            Znajdź swoje studio
            <span className="grid size-10 place-items-center rounded-full bg-forest-950 text-gold-200 transition-transform duration-500 ease-luxe group-hover:translate-y-0.5">
              <ArrowDown className="size-4" strokeWidth={1.75} />
            </span>
          </motion.a>

          <p className="text-sm text-ivory-100/65 sm:max-w-[16rem]">
            {studioCount} {plural(studioCount, ['studio', 'studia', 'studiów'])} — wybierz najbliższe i przejdź na jego stronę.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        className="absolute bottom-10 right-10 hidden flex-col items-center gap-4 lg:flex"
      >
        <span className="eyebrow text-[0.6rem] text-ivory-100/50 [writing-mode:vertical-rl]">Przewiń</span>
        <span className="relative h-16 w-px overflow-hidden bg-ivory-100/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gold-300"
            animate={reduceMotion ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
