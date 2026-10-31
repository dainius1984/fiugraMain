import { ArrowUpRight } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { site } from '../data/site'
import { fullAddress, primaryLink } from '../lib/studio-utils'

export default function Footer({ studios }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink-950 text-ivory-100">
      <div className="container-site pb-10 pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo tone="light" className="text-[1.9rem] md:text-[2.2rem]" />
            <p className="mt-5 font-serif text-2xl italic text-brand-400">Twoje piękno. Twoje miejsce.</p>
          </div>

          <nav aria-label="Studia Studio Figura">
            <p className="eyebrow mb-5 text-brand-400">Studia</p>
            <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {studios.map((studio) => (
                <li key={studio.id}>
                  <a
                    href={primaryLink(studio).href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center justify-between gap-4 border-b border-ivory-100/10 py-3"
                  >
                    <span>
                      <span className="block text-ivory-50 transition-colors duration-500 group-hover:text-brand-400">
                        {studio.name}
                      </span>
                      <span className="block text-sm text-ivory-100/55">{fullAddress(studio)}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 shrink-0 text-brand-400 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only">(otwiera się w nowej karcie)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory-100/10 pt-6 text-xs text-ivory-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.brand}</p>
          <a href={site.url} className="tracking-[0.18em] uppercase transition-colors hover:text-brand-400">
            {site.domainLabel}
          </a>
        </div>
      </div>
    </footer>
  )
}
