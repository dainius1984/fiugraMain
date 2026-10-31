import { motion } from 'motion/react'
import { ArrowUpRight, MapPin, Navigation, X } from 'lucide-react'
import ButtonLink from '../ButtonLink'
import { FacebookIcon } from '../icons'
import { EASE } from '../Reveal'
import { directionsUrl, primaryLink } from '../../lib/studio-utils'

const NEW_TAB = ' (otwiera się w nowej karcie)'

/**
 * Studio details shown after selecting a marker or a selector item.
 * Phones/tablets: a panel directly below the map (the map stays fully visible).
 * Desktop: a floating panel over the top-left of the map.
 * Nothing redirects automatically — the visitor chooses the next step here.
 */
export default function MapPopup({ studio, number, onClose, reduceMotion, panelRef }) {
  const primary = primaryLink(studio)
  const headingId = `map-popup-${studio.id}`

  return (
    <motion.div
      key={studio.id}
      ref={panelRef}
      id="map-studio-details"
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: EASE }}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      className="relative z-20 mt-3 scroll-mb-4 rounded-2xl bg-ivory-50 p-5 shadow-[0_24px_60px_-32px_rgba(23,23,23,0.4)] ring-1 ring-brand-200 sm:p-6 lg:absolute lg:left-5 lg:top-5 lg:mt-0 lg:w-[23rem]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Zamknij szczegóły studia"
        className="absolute right-2.5 top-2.5 grid size-11 place-items-center rounded-full text-ink-600 transition-colors duration-300 hover:bg-ivory-200 hover:text-ink-900"
      >
        <X className="size-4" strokeWidth={1.75} />
      </button>

      <p className="eyebrow flex items-center gap-3 text-brand-600">
        <span className="font-serif text-base italic normal-case tracking-normal text-brand-400">{number}</span>
        <span aria-hidden="true" className="h-px w-6 bg-brand-400" />
        {studio.city}
      </p>
      <h3 id={headingId} className="mt-2 pr-8 font-serif text-[1.65rem] leading-[1.1] text-ink-900 lg:text-[1.85rem]">
        {studio.name}
      </h3>
      <address className="mt-2 flex items-start gap-2.5 text-[1rem] not-italic leading-snug">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
        <span>
          <span className="block font-medium text-ink-900">{studio.street}</span>
          <span className="block text-ink-600">{studio.city}</span>
        </span>
      </address>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:mt-5 lg:grid-cols-1">
        <ButtonLink
          href={primary.href}
          external
          variant="ink"
          icon={primary.kind === 'facebook' ? FacebookIcon : ArrowUpRight}
          className="w-full"
          aria-label={`${primary.label}: ${studio.name}${NEW_TAB}`}
        >
          {primary.label}
        </ButtonLink>
        <ButtonLink
          href={directionsUrl(studio)}
          external
          variant="outline"
          icon={Navigation}
          className="w-full"
          aria-label={`Wyznacz trasę do: ${studio.name}, ${studio.street}, ${studio.city} — Mapy Google${NEW_TAB}`}
        >
          Wyznacz trasę
        </ButtonLink>
      </div>
    </motion.div>
  )
}
