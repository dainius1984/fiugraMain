import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Maximize2 } from 'lucide-react'
import Reveal from './Reveal'
import { directionsUrl, fullAddress, primaryLink } from '../lib/studio-utils'

// Extra top padding leaves room for the pins above their coordinates.
const FIT = { paddingTopLeft: [28, 56], paddingBottomRight: [28, 24] }

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function popupHtml(studio) {
  const primary = primaryLink(studio)
  return `
    <div class="sf-popup">
      <p class="sf-popup__name">${escapeHtml(studio.name)}</p>
      <p class="sf-popup__address">${escapeHtml(fullAddress(studio))}</p>
      <div class="sf-popup__actions">
        <a href="${escapeHtml(primary.href)}" target="_blank" rel="noopener noreferrer" class="sf-popup__primary">${escapeHtml(primary.label)}</a>
        <a href="${escapeHtml(directionsUrl(studio))}" target="_blank" rel="noopener noreferrer" class="sf-popup__secondary">Wyznacz trasę</a>
      </div>
    </div>`
}

/**
 * Overview map of every studio (Leaflet + OpenStreetMap, no API key).
 * Leaflet is loaded lazily when the section approaches the viewport.
 * Markers use the verified `coordinates` from studios.js.
 */
export default function StudioMap({ studios }) {
  const located = studios.filter((s) => s.coordinates)
  const sectionRef = useRef(null)
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const boundsRef = useRef(null)
  const [activeId, setActiveId] = useState(null)
  const [ready, setReady] = useState(false)
  const [touchLocked, setTouchLocked] = useState(false)
  const reduceMotion = useReducedMotion()

  // Load Leaflet only when the map is about to be seen.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || located.length === 0) return
    let cancelled = false

    const init = async () => {
      const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
      if (cancelled || !mapEl.current || mapRef.current) return

      const isTouch = window.matchMedia('(pointer: coarse)').matches
      const map = L.map(mapEl.current, {
        scrollWheelZoom: false, // never hijack page scrolling
        dragging: !isTouch, // on phones: tap the map first, then drag
        zoomControl: false,
      })
      L.control.zoom({ position: 'bottomright', zoomInTitle: 'Przybliż', zoomOutTitle: 'Oddal' }).addTo(map)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      located.forEach((studio, i) => {
        const icon = L.divIcon({
          className: 'sf-marker',
          html: `<span class="sf-pin"><span>${i + 1}</span></span>`,
          iconSize: [36, 40],
          iconAnchor: [18, 36], // the rotated square's tip
          popupAnchor: [0, -36],
        })
        const marker = L.marker([studio.coordinates.lat, studio.coordinates.lng], {
          icon,
          title: studio.name,
          alt: studio.name,
          riseOnHover: true,
        })
          .bindPopup(popupHtml(studio), { className: 'sf-leaflet-popup', maxWidth: 280 })
          .addTo(map)
        marker.on('popupopen', () => setActiveId(studio.id))
        marker.on('popupclose', () => setActiveId((id) => (id === studio.id ? null : id)))
        markersRef.current[studio.id] = marker
      })

      boundsRef.current = L.latLngBounds(located.map((s) => [s.coordinates.lat, s.coordinates.lng]))
      map.fitBounds(boundsRef.current, FIT)

      map.on('focus click', () => map.scrollWheelZoom.enable())
      map.on('blur mouseout', () => map.scrollWheelZoom.disable())
      if (isTouch) {
        setTouchLocked(true)
        map.once('click', () => {
          map.dragging.enable()
          setTouchLocked(false)
        })
      }

      mapRef.current = map
      setReady(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          init()
        }
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(section)

    return () => {
      cancelled = true
      observer.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = {}
    }
    // Studios are static data; initialise once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the active marker visually highlighted.
  useEffect(() => {
    for (const [id, marker] of Object.entries(markersRef.current)) {
      marker.getElement()?.classList.toggle('is-active', id === activeId)
    }
  }, [activeId, ready])

  const focusStudio = useCallback(
    (studio) => {
      const map = mapRef.current
      const marker = markersRef.current[studio.id]
      if (!map || !marker) return
      if (window.matchMedia('(max-width: 1023px)').matches) {
        mapEl.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
      }
      const target = [studio.coordinates.lat, studio.coordinates.lng]
      map.closePopup()
      map.once('moveend', () => marker.openPopup())
      if (reduceMotion) map.setView(target, 15, { animate: false })
      else map.flyTo(target, 15, { duration: 1.2 })
      setActiveId(studio.id)
    },
    [reduceMotion]
  )

  const showAll = () => {
    const map = mapRef.current
    if (!map || !boundsRef.current) return
    map.closePopup()
    if (reduceMotion) map.fitBounds(boundsRef.current, { ...FIT, animate: false })
    else map.flyToBounds(boundsRef.current, { ...FIT, duration: 1.1 })
    setActiveId(null)
  }

  if (located.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="mapa"
      aria-labelledby="mapa-heading"
      className="border-t border-brand-300/50 bg-ivory-50 py-16 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 id="mapa-heading" className="font-serif text-[2.4rem] leading-[1.02] text-ink-900 sm:text-6xl">
              Znajdź nas <em className="text-brand-400">na mapie</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-600 md:mt-6 md:text-lg">
              Pięć lokalizacji. Wybierz tę, do której masz najbliżej.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10">
          <Reveal delay={0.12} className="order-2 lg:order-1">
            <ol className="divide-y divide-brand-300/50 border-y border-brand-300/50" aria-label="Lokalizacje na mapie">
              {located.map((studio, i) => {
                const isActive = studio.id === activeId
                return (
                  <li key={studio.id}>
                    <button
                      type="button"
                      onClick={() => focusStudio(studio)}
                      aria-pressed={isActive}
                      className="group flex min-h-16 w-full items-center gap-4 py-3.5 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors duration-500 ease-luxe ${
                          isActive
                            ? 'border-brand-400 bg-brand-400 text-ink-900'
                            : 'border-ink-900 bg-ink-900 text-brand-400 group-hover:border-brand-400'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block font-serif text-[1.35rem] leading-tight text-ink-900">
                          {studio.name.replace(/^Studio Figura\s*/, '')}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink-600">{fullAddress(studio)}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-px bg-brand-400 transition-[width] duration-700 ease-luxe ${
                          isActive ? 'w-8' : 'w-0 group-hover:w-5'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ol>
            <button
              type="button"
              onClick={showAll}
              className="group mt-5 inline-flex min-h-12 items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink-900"
            >
              <Maximize2 className="size-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
              <span className="border-b border-brand-400/60 pb-0.5 transition-colors duration-500 group-hover:border-ink-900">
                Pokaż wszystkie studia
              </span>
            </button>
          </Reveal>

          <Reveal delay={0.18} className="order-1 lg:order-2">
            <div className="relative isolate overflow-hidden rounded-[1.5rem] ring-1 ring-brand-300/60">
              <div
                ref={mapEl}
                role="region"
                aria-label="Mapa lokalizacji Studio Figura"
                className="sf-map h-[520px] w-full bg-ivory-200 lg:h-[600px]"
              />
              {!ready && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-ink-600">
                  Ładowanie mapy…
                </div>
              )}
              {touchLocked && (
                <p className="pointer-events-none absolute inset-x-0 top-3 z-[500] mx-auto w-max rounded-full bg-ink-900/80 px-4 py-2 text-xs text-ivory-50 backdrop-blur">
                  Dotknij mapy, aby ją przesuwać
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
