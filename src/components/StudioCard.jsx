import { motion } from 'motion/react'
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react'
import ArchArt from './ArchArt'
import ButtonLink from './ButtonLink'
import { FacebookIcon, InstagramIcon } from './icons'
import { EASE } from './Reveal'
import { directionsUrl, displayHost, studioImage } from '../lib/studio-utils'

export const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: EASE } },
}

const NEW_TAB = ' (otwiera się w nowej karcie)'

export default function StudioCard({ studio, index }) {
  const image = studioImage(studio)
  const number = String(index + 1).padStart(2, '0')
  const headingId = `studio-${studio.id}`

  return (
    <motion.article
      layout
      variants={cardVariants}
      exit="exit"
      aria-labelledby={headingId}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-ivory-50 shadow-[0_1px_0_rgba(15,36,27,0.06),0_30px_60px_-40px_rgba(15,36,27,0.45)] ring-1 ring-forest-900/5 transition-shadow duration-700 ease-luxe hover:shadow-[0_1px_0_rgba(15,36,27,0.06),0_40px_80px_-40px_rgba(15,36,27,0.6)]"
    >
      <a
        href={studio.website}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/10] overflow-hidden bg-forest-900"
      >
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.06]">
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
            <ArchArt variant={index} className="h-full w-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 font-serif text-sm italic text-gold-200/90">{number}</span>
        <span className="eyebrow absolute bottom-5 left-5 text-ivory-100/90">
          {studio.city}
          {studio.district && <span className="text-gold-300"> · {studio.district}</span>}
        </span>
      </a>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 id={headingId} className="font-serif text-[1.85rem] leading-[1.05] text-forest-900">
          {studio.name}
        </h3>

        <address className="mt-4 flex items-start gap-2.5 text-[0.95rem] not-italic leading-snug text-forest-800/75">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" strokeWidth={1.75} aria-hidden="true" />
          <span>
            {studio.street}
            <br />
            {studio.city}
          </span>
        </address>

        <p className="mt-2 pl-[1.6rem] text-xs tracking-wide text-forest-800/50">{displayHost(studio.website)}</p>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
          <ButtonLink
            href={studio.website}
            external
            variant="forest"
            icon={ArrowUpRight}
            className="w-full"
            aria-label={`Strona: ${studio.name}${NEW_TAB}`}
          >
            Strona studia
          </ButtonLink>
          <ButtonLink
            href={directionsUrl(studio)}
            external
            variant="outline"
            icon={Navigation}
            className="flex-1"
            aria-label={`Nawiguj do: ${studio.name} w Mapach Google${NEW_TAB}`}
          >
            Nawiguj
          </ButtonLink>
          {studio.facebook && (
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
    </motion.article>
  )
}
