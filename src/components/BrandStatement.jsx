import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Reveal from './Reveal'
import { plural } from '../lib/studio-utils'

const STATEMENT =
  'Piękno zaczyna się od chwili tylko dla siebie — w miejscu, w którym możesz zwolnić, odetchnąć i poczuć się dobrze.'

function Word({ children, progress, range, still }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={still ? undefined : { opacity }} className="inline-block">
      {children}
      {' '}
    </motion.span>
  )
}

export default function BrandStatement({ studioCount, places }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = STATEMENT.split(' ')

  const glowY = useTransform(scrollYProgress, [0, 1], ['-10%', '20%'])

  return (
    <section
      id="o-nas"
      aria-labelledby="o-nas-heading"
      className="grain relative isolate overflow-hidden bg-forest-900 py-20 text-ivory-100 md:py-36"
    >
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: glowY }}
        className="absolute -right-1/4 top-0 -z-10 h-[120%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.16)_0%,transparent_65%)] blur-2xl"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <Reveal as="p" className="eyebrow mb-8 flex items-center gap-4 text-gold-300 md:mb-12">
          <span aria-hidden="true" className="h-px w-10 bg-gold-400/60" />
          <span id="o-nas-heading">Studio Figura</span>
        </Reveal>

        <p ref={ref} className="font-serif text-[2rem] leading-[1.15] text-ivory-50 sm:text-5xl md:text-6xl lg:text-[4.4rem]">
          {words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              still={reduceMotion}
            >
              {word}
            </Word>
          ))}
        </p>

        <div className="mt-14 flex flex-col gap-6 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-end sm:gap-12 md:mt-20">
          <Reveal>
            <p className="font-serif text-5xl text-gold-200 md:text-6xl">{studioCount}</p>
            <p className="eyebrow mt-2 text-ivory-100/60">{plural(studioCount, ['Studio', 'Studia', 'Studiów'])}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-serif text-2xl italic leading-snug text-ivory-100/80 md:text-3xl">{places.join(' · ')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
