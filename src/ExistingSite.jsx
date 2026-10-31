import { useMemo, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import StudioDirectory from './components/StudioDirectory'
import BrandStatement from './components/BrandStatement'
import StudioMap from './components/StudioMap'
import Footer from './components/Footer'
import { studios } from './data/studios'

export default function ExistingSite() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState(null)

  const cities = useMemo(() => {
    const counts = new Map()
    for (const s of studios) counts.set(s.city, (counts.get(s.city) ?? 0) + 1)
    return [...counts].map(([name, count]) => ({ city: name, count }))
  }, [])

  const pickCity = (name) => {
    setQuery('')
    setCity(name)
  }

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#studia"
        className="sr-only z-[60] rounded-full bg-gold-400 px-5 py-3 text-forest-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Przejdź do listy studiów
      </a>
      <Navigation />
      <main id="top">
        <Hero cities={cities} onPickCity={pickCity} />
        <StudioDirectory
          studios={studios}
          cities={cities}
          query={query}
          setQuery={setQuery}
          city={city}
          setCity={setCity}
        />
        <BrandStatement studioCount={studios.length} cityCount={cities.length} />
        <StudioMap studios={studios} />
      </main>
      <Footer studios={studios} />
    </MotionConfig>
  )
}
