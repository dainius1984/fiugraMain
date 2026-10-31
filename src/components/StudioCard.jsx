import { motion } from 'motion/react'
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react'
import StudioArt from './StudioArt'
import ButtonLink from './ButtonLink'
import { FacebookIcon, InstagramIcon } from './icons'
import { EASE } from './Reveal'
import { directionsUrl, primaryLink, shortLabel, studioImage } from '../lib/studio-utils'

export const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
}

const NEW_TAB = ' (otwiera się w nowej karcie)'

export default function StudioCard({ studio, index, className = '' }) {
  const image = studioImage(studio)
  const primary = primaryLink(studio)
  const headingId = `studio-${studio.id}`
  // Secondary social icons only when they are not already the primary destination.
  const showFacebook = studio.facebook && primary.kind !== 'facebook'

  return (
    <motion.article
      variants={cardVariants}
      aria-labelledby={headingId}
      className={`group/card relative flex flex-col overflow-hidden rounded-[1.5rem] bg-ivory-50 shadow-[0_24px_50px_-36px_rgba(23,23,23,0.28)] ring-1 ring-brand-300/45 transition-[box-shadow,transform] duration-700 ease-luxe hover:shadow-[0_36px_70px_-40px_rgba(23,23,23,0.38)] hover:ring-brand-400/70 md:hover:-translate-y-1 ${className}`}
    >
      {/* Visual — photo when supplied, otherwise distinct illustrative artwork */}
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/9] overflow-hidden bg-ivory-200 sm:aspect-[16/10]"
      >
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-luxe group-hover/card:scale-[1.06]">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              width="1200"
              height="750"
              className="h-full w-full object-cover"
            />
          ) : (
            <StudioArt variant={index} className="h-full w-full" />
          )}
        </div>
        {image && <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />}
        <div className="absolute inset-x-6 bottom-5 sm:inset-x-7 sm:bottom-6">
          {studio.district && (
            <span className={`eyebrow block text-[0.65rem] ${image ? 'text-brand-200' : 'text-brand-600'}`}>{studio.city}</span>
          )}
          <span className={`mt-1 block font-serif text-[2.1rem] italic leading-none sm:text-[2.4rem] ${image ? 'text-ivory-50' : 'text-ink-900'}`}>
            {shortLabel(studio)}
          </span>
        </div>
      </a>

      <span aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-brand-300/80 to-transparent" />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Orange rule that extends on hover */}
        <span
          aria-hidden="true"
          className="mb-4 block h-px w-10 bg-brand-400 transition-[width] duration-700 ease-luxe group-hover/card:w-20"
        />
        <h3 id={headingId} className="font-serif text-[1.65rem] font-medium leading-[1.1] text-ink-900 sm:text-[1.75rem]">
          {studio.name}
        </h3>

        <address className="mt-3 flex items-start gap-2.5 text-[1.05rem] not-italic leading-snug text-ink-800">
          <MapPin
            className="mt-[0.2rem] size-[1.05rem] shrink-0 text-brand-400 transition-colors duration-700 group-hover/card:text-brand-600"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>
            {studio.street}
            <span className="text-ink-600">, {studio.city}</span>
          </span>
        </address>

        <div className="mt-auto flex flex-col gap-2.5 pt-7">
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
          <div className="flex gap-2.5">
            <ButtonLink
              href={directionsUrl(studio)}
              external
              variant="outline"
              icon={Navigation}
              className="flex-1"
              aria-label={`Wyznacz trasę do: ${studio.name}, ${studio.street}, ${studio.city} — Mapy Google${NEW_TAB}`}
            >
              Wyznacz trasę
            </ButtonLink>
            {showFacebook && (
              <ButtonLink
                href={studio.facebook}
                external
                variant="outline"
                icon={FacebookIcon}
                iconOnly
                label={`Facebook: ${studio.name}${NEW_TAB}`}
              />
            )}
            {studio.instagram && (
              <ButtonLink
                href={studio.instagram}
                external
                variant="outline"
                icon={InstagramIcon}
                iconOnly
                label={`Instagram: ${studio.name}${NEW_TAB}`}
              />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
