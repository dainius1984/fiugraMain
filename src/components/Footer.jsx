import { ArrowUpRight } from 'lucide-react'
import Wordmark from './Wordmark'
import { site } from '../data/site'
import { fullAddress } from '../lib/studio-utils'

export default function Footer({ studios }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-forest-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 md:pt-24 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark className="text-xl md:text-2xl" />
            <p className="mt-5 font-serif text-2xl italic text-gold-200/90">Twoje piękno. Twoje miejsce.</p>
          </div>

          <nav aria-label="Studia Studio Figura">
            <p className="eyebrow mb-5 text-gold-300/80">Studia</p>
            <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {studios.map((studio) => (
                <li key={studio.id}>
                  <a
                    href={studio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center justify-between gap-4 border-b border-ivory-100/10 py-3"
                  >
                    <span>
                      <span className="block text-ivory-50 transition-colors duration-500 group-hover:text-gold-200">
                        {studio.name}
                      </span>
                      <span className="block text-sm text-ivory-100/50">{fullAddress(studio)}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 shrink-0 text-gold-300/70 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only">(otwiera się w nowej karcie)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory-100/10 pt-6 text-xs text-ivory-100/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.brand}</p>
          <a href={site.url} className="tracking-[0.18em] uppercase transition-colors hover:text-gold-200">
            {site.domainLabel}
          </a>
        </div>
      </div>
    </footer>
  )
}
