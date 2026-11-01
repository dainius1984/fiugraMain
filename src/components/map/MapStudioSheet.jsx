import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, MapPin, MapPinned, Navigation, Phone, X } from 'lucide-react'
import ButtonLink from '../ButtonLink'
import { FacebookIcon } from '../icons'
import { EASE } from '../Reveal'
import { directionsUrl, primaryLink, telHref } from '../../lib/studio-utils'

const NEW_TAB = ' (otwiera się w nowej karcie)'

const secondary =
  'inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-brand-300 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-900 transition-colors duration-300 hover:border-ink-900 active:bg-ivory-200'

/**
 * Phones and tablets: compact, non-modal bottom sheet with the selected studio's details.
 * One sheet only — selecting another studio updates its content in place. The map above stays
 * interactive and the page scrolls normally. Every action is a plain link, so it works without
 * MapLibre; "Zadzwoń" dials the studio's tel: number directly.
 */
export default function MapStudioSheet({
  studio, number, open, onClose, reduceMotion, panelRef, focusOnOpen, mapAction,
}) {
  const bodyRef = useRef(null)

  // Keyboard selection moves focus into the sheet (pointer/touch selection leaves it in place).
  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    focusOnOpen.current = false
    bodyRef.current?.focus({ preventScroll: true })
  }, [open, studio?.id, focusOnOpen])

  return (
    <AnimatePresence>
      {open && studio && (
        <motion.div
          ref={panelRef}
          id="map-studio-details"
          role="dialog"
          aria-modal="false"
          aria-labelledby="map-sheet-title"
          initial={reduceMotion ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { y: '110%' }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 mx-auto max-h-[calc(100svh-5rem)] max-w-lg overflow-y-auto overscroll-contain rounded-t-[1.5rem] bg-ivory-50 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-4 shadow-[0_-18px_50px_-24px_rgba(23,23,23,0.45)] ring-1 ring-brand-200 md:bottom-[max(1rem,env(safe-area-inset-bottom))] md:rounded-[1.5rem] md:pb-5 md:pl-5 md:pr-5"
        >
          {/* Subtle orange accent along the top edge */}
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,var(--color-brand-400)_30%,var(--color-brand-400)_70%,transparent)] opacity-70" />

          <motion.div
            key={studio.id}
            ref={bodyRef}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="outline-none"
          >
            <div className="flex items-start gap-3 pr-10">
              {/* Same badge as the map marker, so the sheet reads as "this pin" */}
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border-2 border-brand-400 bg-brand-600 text-[0.8rem] font-bold tabular-nums text-ivory-50"
              >
                {number}
              </span>
              <div className="min-w-0">
                <h3 id="map-sheet-title" className="font-serif text-[1.35rem] leading-[1.12] text-ink-900">
                  {studio.name}
                </h3>
                <address className="mt-1 flex items-center gap-1.5 text-[0.92rem] not-italic leading-snug text-ink-700">
                  <MapPin className="size-3.5 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <span className="font-medium text-ink-900">{studio.street}</span>, {studio.city}
                  </span>
                </address>
              </div>
            </div>

            <StudioActions studio={studio} />

            {mapAction && (
              <button
                type="button"
                onClick={mapAction.onClick}
                disabled={mapAction.busy}
                className="mx-auto mt-2 flex min-h-11 items-center gap-2 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-900 disabled:cursor-wait disabled:text-ink-600"
              >
                <MapPinned className="size-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                <span className="border-b border-brand-300 pb-0.5">{mapAction.label}</span>
              </button>
            )}
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij szczegóły studia"
            className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-ink-600 transition-colors duration-300 hover:bg-ivory-200 hover:text-ink-900"
          >
            <X className="size-[1.1rem]" strokeWidth={1.75} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StudioActions({ studio }) {
  const primary = primaryLink(studio)
  const tel = telHref(studio)
  return (
    <div className="mt-3.5 grid grid-cols-2 gap-2">
      <ButtonLink
        href={primary.href}
        external
        variant="ink"
        size="md"
        icon={primary.kind === 'facebook' ? FacebookIcon : ArrowUpRight}
        className="col-span-2 w-full"
        aria-label={`${primary.label}: ${studio.name}${NEW_TAB}`}
      >
        {primary.label}
      </ButtonLink>
      <a
        href={directionsUrl(studio)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${secondary} ${tel ? '' : 'col-span-2'}`}
        aria-label={`Wyznacz trasę do: ${studio.name}, ${studio.street}, ${studio.city} — Mapy Google${NEW_TAB}`}
      >
        <Navigation className="size-4 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">Wyznacz trasę</span>
      </a>
      {tel && (
        <a href={tel} className={secondary} aria-label={`Zadzwoń: ${studio.name}, ${studio.phone.display}`}>
          <Phone className="size-4 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">Zadzwoń</span>
        </a>
      )}
    </div>
  )
}
