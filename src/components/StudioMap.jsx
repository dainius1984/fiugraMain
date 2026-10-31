import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, MapPinned } from 'lucide-react'
import ArchArt from './ArchArt'
import Reveal, { EASE } from './Reveal'
import { directionsUrl, fullAddress, mapEmbedUrl } from '../lib/studio-utils'

const CONSENT_KEY = 'sf-map-consent'

/**
 * Interactive Google map. Uses verified `coordinates` when present in studios.js,
 * otherwise the studio's street address. The third-party iframe loads only
 * after the visitor opts in (privacy + performance).
 */
export default function StudioMap({ studios }) {
  const [activeId, setActiveId] = useState(studios[0]?.id)
  const [consent, setConsent] = useState(false)
  const active = studios.find((s) => s.id === activeId) ?? studios[0]

  useEffect(() => {
    try {
      setConsent(localStorage.getItem(CONSENT_KEY) === '1')
    } catch {
      /* storage unavailable — ask again */
    }
  }, [])

  const allow = () => {
    setConsent(true)
    try {
      localStorage.setItem(CONSENT_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!active) return null

  return (
    <section id="mapa" aria-labelledby="mapa-heading" className="bg-ivory-200/60 py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal as="p" className="eyebrow mb-4 flex items-center gap-4 text-gold-600">
          <span aria-hidden="true" className="h-px w-10 bg-gold-500/60" />
          Mapa
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="mapa-heading" className="font-serif text-[2.6rem] leading-[1] text-forest-900 sm:text-6xl">
            Studio blisko <em className="text-gold-600">Ciebie</em>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <Reveal delay={0.12}>
            <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10" aria-label="Wybierz studio na mapie">
              {studios.map((studio, i) => {
                const isActive = studio.id === active.id
                return (
                  <li key={studio.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(studio.id)}
                      aria-pressed={isActive}
                      className="group flex min-h-18 w-full items-center gap-5 py-4 text-left"
                    >
                      <span
                        className={`font-serif text-sm italic transition-colors duration-500 ${
                          isActive ? 'text-gold-600' : 'text-forest-800/40'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block font-serif text-2xl leading-tight transition-colors duration-500 ${
                            isActive ? 'text-forest-900' : 'text-forest-800/60 group-hover:text-forest-900'
                          }`}
                        >
                          {studio.name.replace(/^Studio Figura\s*/, '')}
                        </span>
                        <span className="mt-0.5 block text-sm text-forest-800/60">{fullAddress(studio)}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`size-2 rotate-45 transition-all duration-500 ease-luxe ${
                          isActive ? 'scale-100 bg-gold-500' : 'scale-0 bg-forest-900'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
            <a
              href={directionsUrl(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex min-h-12 items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-forest-900"
            >
              <span className="border-b border-gold-500/60 pb-1 transition-colors duration-500 group-hover:border-forest-900">
                Wyznacz trasę: {active.name.replace(/^Studio Figura\s*/, '')}
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
              <span className="sr-only">(otwiera Mapy Google w nowej karcie)</span>
            </a>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-forest-900 ring-1 ring-forest-900/10 lg:aspect-auto lg:h-full lg:min-h-[460px]">
              {consent ? (
                <AnimatePresence mode="wait">
                  <motion.iframe
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    title={`Mapa: ${active.name}, ${fullAddress(active)}`}
                    src={mapEmbedUrl(active)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[12%]"
                    allowFullScreen
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0">
                  <ArchArt variant={2} className="absolute inset-0 h-full w-full" />
                  <div className="absolute inset-0 bg-forest-950/40" />
                  <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-ivory-100">
                    <MapPinned className="size-8 text-gold-300" strokeWidth={1.25} aria-hidden="true" />
                    <p className="mt-4 font-serif text-2xl sm:text-3xl">{active.name}</p>
                    <p className="mt-1 text-sm text-ivory-100/70">{fullAddress(active)}</p>
                    <button
                      type="button"
                      onClick={allow}
                      className="mt-6 inline-flex min-h-12 items-center rounded-full bg-gold-400 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-forest-950 transition-colors duration-500 hover:bg-gold-200"
                    >
                      Pokaż mapę
                    </button>
                    <p className="mt-4 max-w-xs text-xs leading-relaxed text-ivory-100/55">
                      Mapa jest dostarczana przez Google. Po jej wczytaniu Google może przetwarzać dane
                      i zapisywać pliki cookie.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
