import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import BrandLogo from './BrandLogo'
import { EASE } from './Reveal'

const LINKS = [
  { href: '#studia', label: 'Studia' },
  { href: '#mapa', label: 'Mapa' },
  { href: '#o-nas', label: 'Filozofia' },
]

export default function Navigation() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 480 && y > prev + 4)
    if (y < prev - 4) setHidden(false)
  })

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: hidden ? '-110%' : 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,backdrop-filter] duration-700 ease-luxe ${
        scrolled
          ? 'bg-ivory-100/85 text-ink-900 shadow-[0_1px_0_var(--color-brand-200)] backdrop-blur-xl'
          : 'bg-transparent text-ink-900'
      }`}
    >
      <nav
        aria-label="Główna nawigacja"
        className="container-site flex h-16 items-center justify-between md:h-20"
      >
        <a href="#top" aria-label="Studio Figura — początek strony" className="py-2">
          <BrandLogo className="text-[1.4rem] md:text-[1.7rem] xl:text-[1.9rem]" />
        </a>

        <ul className="hidden items-center gap-10 md:flex xl:gap-12">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative py-2 text-[0.75rem] font-medium xl:text-[0.8rem] uppercase tracking-[0.22em] opacity-80 transition-opacity duration-500 hover:opacity-100"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-brand-400 transition-transform duration-500 ease-luxe group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#mapa"
          className="inline-flex min-h-11 items-center rounded-full bg-ink-900 px-5 text-[0.7rem] xl:min-h-12 xl:px-6 xl:text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ivory-50 transition-colors duration-500 ease-luxe hover:bg-brand-600"
        >
          <span className="md:hidden">Studia</span>
          <span className="hidden md:inline">Znajdź studio</span>
        </a>
      </nav>
    </motion.header>
  )
}
