import { useId, useMemo } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import StudioCard from './StudioCard'
import Reveal from './Reveal'
import { matchesQuery } from '../lib/studio-utils'

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

export default function StudioDirectory({ studios, cities, query, setQuery, city, setCity }) {
  const inputId = useId()
  const results = useMemo(
    () => studios.filter((s) => (!city || s.city === city) && matchesQuery(s, query)),
    [studios, city, query]
  )

  const filters = [{ city: null, label: 'Wszystkie', count: studios.length }, ...cities.map((c) => ({ ...c, label: c.city }))]
  const resetAll = () => {
    setQuery('')
    setCity(null)
  }

  return (
    <section id="studia" aria-labelledby="studia-heading" className="relative bg-ivory-100 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="eyebrow mb-4 flex items-center gap-4 text-gold-600">
              <span aria-hidden="true" className="h-px w-10 bg-gold-500/60" />
              Lokalizacje
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                id="studia-heading"
                className="font-serif text-[2.6rem] leading-[1] text-forest-900 sm:text-6xl lg:text-7xl"
              >
                Znajdź swoje <em className="text-gold-600">Studio&nbsp;Figura</em>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="w-full md:max-w-sm">
            <label htmlFor={inputId} className="sr-only">
              Szukaj po mieście lub nazwie lokalizacji
            </label>
            <div className="group relative">
              <Search
                aria-hidden="true"
                strokeWidth={1.5}
                className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-forest-800/50 transition-colors duration-500 group-focus-within:text-gold-600"
              />
              <input
                id={inputId}
                type="search"
                inputMode="search"
                autoComplete="off"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Miasto lub nazwa studia"
                className="h-14 w-full rounded-full border border-forest-900/15 bg-ivory-50 pl-13 pr-14 text-base text-forest-900 placeholder:text-forest-800/45 transition-[border-color,box-shadow] duration-500 ease-luxe focus:border-gold-500 focus:shadow-[0_0_0_4px_rgba(201,169,110,0.18)] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery('')}
                    aria-label="Wyczyść wyszukiwanie"
                    className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-forest-800/60 transition-colors hover:bg-ivory-200 hover:text-forest-900"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-8 md:mt-12">
          <div role="group" aria-label="Filtruj według miasta" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <LayoutGroup id="city-filter">
              {filters.map((f) => {
                const active = city === f.city
                return (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setCity(f.city)}
                    aria-pressed={active}
                    className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm transition-colors duration-500 ease-luxe ${
                      active ? 'text-ivory-100' : 'text-forest-800/75 hover:text-forest-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="city-pill"
                        className="absolute inset-0 -z-0 rounded-full bg-forest-900"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                    {!active && <span className="absolute inset-0 rounded-full border border-forest-900/12" />}
                    <span className="relative">{f.label}</span>
                    <span className={`relative text-xs ${active ? 'text-gold-300' : 'text-gold-600'}`}>{f.count}</span>
                  </button>
                )
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {results.length === 0
            ? 'Brak studiów spełniających kryteria.'
            : `Znaleziono studia: ${results.length}.`}
        </p>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {results.map((studio) => (
              <StudioCard key={studio.id} studio={studio} index={studios.indexOf(studio)} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-[1.75rem] border border-dashed border-forest-900/15 px-6 py-14 text-center"
            >
              <p className="font-serif text-3xl text-forest-900">Nie znaleźliśmy takiego studia</p>
              <p className="mx-auto mt-3 max-w-sm text-forest-800/70">
                Spróbuj wpisać nazwę miasta, np. „Wrocław” lub „Strzelin”.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-6 inline-flex min-h-12 items-center rounded-full border border-forest-900/20 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-forest-900 transition-colors duration-500 hover:bg-forest-900 hover:text-ivory-100"
              >
                Pokaż wszystkie studia
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
