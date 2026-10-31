import { useMemo } from 'react'
import { MotionConfig } from 'motion/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import StudioDirectory from './components/StudioDirectory'
import BrandStatement from './components/BrandStatement'
import StudioMap from './components/StudioMap'
import Footer from './components/Footer'
import { publishedStudios as studios } from './data/studios'

export default function ExistingSite() {
  const places = useMemo(() => [...new Set(studios.map((s) => s.city))], [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#studia"
        className="sr-only z-[60] rounded-full bg-brand-400 px-5 py-3 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Przejdź do listy studiów
      </a>
      <Navigation />
      <main id="top">
        <Hero studioCount={studios.length} />
        <StudioDirectory studios={studios} />
        <StudioMap studios={studios} />
        <BrandStatement studioCount={studios.length} places={places} />
      </main>
      <Footer studios={studios} />
    </MotionConfig>
  )
}
