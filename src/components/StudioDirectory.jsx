import { motion } from 'motion/react'
import StudioCard from './StudioCard'
import Reveal from './Reveal'

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

/**
 * Card widths for a centred, wrapping grid (widths match each breakpoint's gap):
 *  - mobile: one column · tablet and small laptops: two columns
 *  - desktop (≥1280px): three columns, so five studios sit 3 + 2 centred;
 *    exactly 4 studios keep a balanced 2 × 2 layout instead of 3 + 1.
 */
function cardWidth(count) {
  const twoCol = 'md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-2rem)/2)]'
  if (count === 4 || count <= 2) return `w-full ${twoCol}`
  return `w-full ${twoCol} xl:w-[calc((100%-2*2rem)/3)]`
}

export default function StudioDirectory({ studios }) {
  const balanced = studios.length === 4

  return (
    <section id="studia" aria-labelledby="studia-heading" className="relative bg-ivory-100 py-14 md:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2
              id="studia-heading"
              className="font-serif text-[2.5rem] leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl"
            >
              Znajdź swoje <em className="text-brand-400">Studio&nbsp;Figura</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-600 md:mt-6 md:text-lg">
              Wybierz najbliższe studio — przejdź na jego stronę lub wyznacz trasę.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <span aria-hidden="true" className="mx-auto mt-7 block h-px w-16 bg-brand-400 md:mt-9" />
          </Reveal>
        </div>

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className={`mx-auto mt-10 flex flex-wrap justify-center gap-5 md:mt-14 md:gap-6 lg:gap-8 ${
            balanced ? 'max-w-5xl' : ''
          }`}
        >
          {studios.map((studio, index) => (
            <li key={studio.id} className={`flex ${cardWidth(studios.length)}`}>
              <StudioCard studio={studio} index={index} className="w-full" />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
