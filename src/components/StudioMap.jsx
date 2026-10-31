import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MapPinned } from 'lucide-react'
import Reveal, { EASE } from './Reveal'
import MapPopup from './map/MapPopup'
import MapLocationSelector from './map/MapLocationSelector'
import { locationsPhrase, pad2 } from '../lib/studio-utils'

const CONSENT_KEY = 'sf-map-consent'
const DESKTOP = '(min-width: 1024px)'
const LOAD_TIMEOUT_MS = 20000

/**
 * The studio finder — the site's central feature.
 *
 * Privacy: OpenFreeMap tiles (and MapLibre itself) load only after the visitor presses
 * "Pokaż interaktywną mapę" (remembered on this device). Until then a static preview shows the
 * studios at their true relative positions, and the selector + details panel work fully.
 *
 * One `selectedId` drives markers, selector and the details panel.
 */
export default function StudioMap({ studios }) {
  const located = useMemo(() => studios.filter((s) => s.coordinates), [studios])
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const mapEl = useRef(null)
  const panelRef = useRef(null)
  const controllerRef = useRef(null)
  const openerRef = useRef(null)

  const [selectedId, setSelectedId] = useState(null)
  const [consent, setConsent] = useState(false)
  const [nearViewport, setNearViewport] = useState(false)
  const [status, setStatus] = useState('preview') // preview | loading | ready | unsupported | error
  const [attempt, setAttempt] = useState(0)

  const selected = located.find((s) => s.id === selectedId) ?? null
  const selectedIndex = located.findIndex((s) => s.id === selectedId)

  const selectStudio = useCallback((id, trigger) => {
    openerRef.current = trigger
    setSelectedId(id)
  }, [])

  const closeDetails = useCallback((event) => {
    // Restore keyboard focus before the exiting panel's DOM is removed. Pointer
    // dismissal does not move focus to a distant marker unexpectedly.
    if (event?.type === 'keydown' || event?.detail === 0) {
      const trigger = openerRef.current
      const target = trigger?.isConnected && !trigger.closest('[inert]')
        ? trigger
        : [...(sectionRef.current?.querySelectorAll('[data-studio-selector]') ?? [])]
          .find((button) => button.dataset.studioSelector === selectedId)
      target?.focus({ preventScroll: true })
    }
    setSelectedId(null)
  }, [selectedId])

  // Remembered consent → load automatically, but only once the section is close to view.
  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY) === '1') setConsent(true)
    } catch {
      /* storage unavailable: ask again */
    }
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNearViewport(true), { rootMargin: '400px 0px' })
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  // Lazy-load MapLibre and create the single map instance.
  useEffect(() => {
    if (!consent || !nearViewport || !mapEl.current) return
    let cancelled = false
    let failed = false
    let controller
    const fail = () => {
      if (cancelled || failed) return
      failed = true
      clearTimeout(timeout)
      setStatus('error')
      // An error can arrive while the controller is being constructed.
      queueMicrotask(() => {
        controller?.destroy()
        if (controllerRef.current === controller) controllerRef.current = null
      })
    }
    // Covers the lazy import, style and first visible tiles, including stalled requests.
    const timeout = setTimeout(fail, LOAD_TIMEOUT_MS)
    setStatus('loading')
    import('./map/createStudioMap')
      .then(({ createStudioMap, webgl2Supported }) => {
        if (cancelled || failed) return
        if (!webgl2Supported()) {
          clearTimeout(timeout)
          setStatus('unsupported')
          return
        }
        try {
          controller = createStudioMap(mapEl.current, {
            studios: located,
            reduceMotion: Boolean(reduceMotion),
            isCompact: () => !window.matchMedia(DESKTOP).matches,
            onSelect: selectStudio,
            onReady: () => {
              if (cancelled || failed) return
              clearTimeout(timeout)
              setStatus('ready')
            },
            onError: fail,
          })
          controllerRef.current = controller
        } catch {
          fail()
        }
      })
      .catch(fail)
    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller?.destroy()
      if (controllerRef.current === controller) controllerRef.current = null
    }
    // The studio list is static data; reduced-motion is read once at creation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, nearViewport, attempt, selectStudio])

  // Sync selection → markers + camera.
  useEffect(() => {
    const controller = controllerRef.current
    if (!controller || status !== 'ready') return
    controller.setActive(selectedId)
    if (selectedId) controller.focus(selectedId)
  }, [selectedId, status])

  // On phones the details panel sits under the map: bring it into view after a selection.
  useEffect(() => {
    if (!selectedId || window.matchMedia(DESKTOP).matches) return
    const id = requestAnimationFrame(() =>
      panelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' })
    )
    return () => cancelAnimationFrame(id)
  }, [selectedId, reduceMotion])

  const activate = useCallback(() => {
    setAttempt((value) => value + 1)
    setConsent(true)
    setNearViewport(true)
    try {
      localStorage.setItem(CONSENT_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  const showAll = useCallback(() => {
    setSelectedId(null)
    controllerRef.current?.setActive(null)
    controllerRef.current?.showAll()
  }, [])

  const live = status === 'ready'

  return (
    <section
      ref={sectionRef}
      id="mapa"
      aria-labelledby="mapa-heading"
      className="bg-ivory-100 pb-14 pt-8 md:pb-24 md:pt-20"
      onKeyDown={(e) => e.key === 'Escape' && selectedId && closeDetails(e)}
    >
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 id="mapa-heading" className="font-serif text-[2.4rem] leading-[1.02] text-ink-900 sm:text-6xl lg:text-[4.2rem]">
              Znajdź swoje <em className="text-brand-400">Studio&nbsp;Figura</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink-600 md:mt-5 md:text-lg">
              Wybierz lokalizację na mapie i odwiedź stronę swojego gabinetu.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} y={20} className="mt-7 md:mt-10">
          <div className="relative">
            {/* Map frame — fixed height (no layout shift); preview underneath, live map fades in on top */}
            <div className="relative isolate h-[clamp(360px,56svh,440px)] overflow-hidden rounded-[1.25rem] bg-ivory-200 shadow-[0_30px_70px_-45px_rgba(23,23,23,0.45)] ring-1 ring-brand-200 md:h-[500px] md:rounded-[1.5rem] lg:h-[600px] xl:h-[640px]">
              <MapPreview
                studios={located}
                selectedId={selectedId}
                onSelect={selectStudio}
                status={status}
                onActivate={activate}
                hidden={live}
                reduceMotion={reduceMotion}
              />
              {/* React owns only this wrapper's classes; MapLibre owns the inner container's. */}
              <div inert={!live} aria-hidden={!live} className={`absolute inset-0 transition-opacity duration-700 ease-luxe ${live ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                <div ref={mapEl} role="region" aria-label="Interaktywna mapa studiów Studio Figura" className="sf-map h-full w-full" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selected && (
                <MapPopup
                  key={selected.id}
                  studio={selected}
                  number={pad2(selectedIndex + 1)}
                  onClose={closeDetails}
                  reduceMotion={reduceMotion}
                  panelRef={panelRef}
                />
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {selected ? `Wybrano: ${selected.name}, ${selected.street}, ${selected.city}.` : ''}
        </p>

        <MapLocationSelector
          studios={located}
          selectedId={selectedId}
          onSelect={selectStudio}
          onShowAll={showAll}
          controlsId="map-studio-details"
        />
      </div>
    </section>
  )
}

/* ─────────────────────────── Preview (before activation) ─────────────────────────── */

/** Web-Mercator projection of the studios into a 0–1 box, preserving the true aspect ratio. */
function useProjection(studios) {
  return useMemo(() => {
    const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
    const xs = studios.map((s) => (s.coordinates.lng * Math.PI) / 180)
    const ys = studios.map((s) => merc(s.coordinates.lat))
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    const w = maxX - minX || 1
    const h = maxY - minY || 1
    return {
      ratio: w / h,
      points: studios.map((s, i) => ({ id: s.id, x: (xs[i] - minX) / w, y: (maxY - ys[i]) / h })),
    }
  }, [studios])
}

function MapPreview({ studios, selectedId, onSelect, status, onActivate, hidden, reduceMotion }) {
  const { ratio, points } = useProjection(studios)
  const busy = status === 'loading'
  const failed = status === 'unsupported' || status === 'error'

  return (
    <div inert={hidden} aria-hidden={hidden} className={`absolute inset-0 transition-opacity duration-700 ease-luxe ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      {/* Quiet cartographic texture */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_30%,var(--color-ivory-50)_0%,var(--color-ivory-100)_55%,var(--color-ivory-200)_100%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
        <defs>
          <pattern id="sf-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" style={{ stroke: 'var(--color-brand-200)' }} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sf-grid)" />
      </svg>

      {/* Plot area: right side on desktop, top part on phones (the activation card takes the rest) */}
      <div className="absolute inset-x-6 bottom-[46%] top-6 [container-type:size] md:bottom-[40%] lg:inset-y-14 lg:left-[44%] lg:right-14">
        <div
          className="relative mx-auto h-full"
          style={{ width: `min(100cqw, ${(100 * ratio).toFixed(2)}cqh)`, maxHeight: `${(100 / ratio).toFixed(2)}cqw` }}
        >
          {points.map((p, i) => {
            const active = p.id === selectedId
            return (
              <motion.button
                key={p.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={(event) => onSelect(p.id, event.currentTarget)}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }}
                className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full border-[1.5px] border-brand-400 text-[0.7rem] font-semibold shadow-[0_8px_18px_-8px_rgba(23,23,23,0.6)] transition-[background-color,color,scale] duration-500 ease-luxe ${
                    active ? 'scale-115 bg-brand-600 text-ivory-50' : 'bg-ink-900 text-brand-400'
                  }`}
                >
                  {pad2(i + 1)}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Activation card */}
      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ivory-50/95 p-4 shadow-[0_20px_50px_-30px_rgba(23,23,23,0.45)] ring-1 ring-brand-200 backdrop-blur sm:p-5 md:inset-x-auto md:left-6 md:max-w-[24rem] lg:bottom-auto lg:left-10 lg:top-1/2 lg:-translate-y-1/2 lg:p-7">
        <p className="eyebrow hidden items-center gap-3 text-brand-600 sm:flex">
          <MapPinned className="size-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
          {locationsPhrase(studios.length)}
        </p>
        <p className="font-serif text-[1.35rem] leading-tight text-ink-900 sm:mt-2 sm:text-[1.6rem] lg:text-[1.9rem]">
          {failed ? 'Mapa jest niedostępna' : 'Wszystkie studia na jednej mapie'}
        </p>
        <p aria-live="polite" className="mt-1.5 text-[0.82rem] leading-snug text-ink-600 lg:mt-3 lg:text-[0.9rem]">
          {failed
            ? status === 'unsupported'
              ? 'Twoja przeglądarka nie obsługuje mapy interaktywnej. Wybierz studio z listy poniżej.'
              : 'Nie udało się wczytać mapy. Spróbuj ponownie lub wybierz studio z listy poniżej.'
            : 'Mapa wczytuje kafelki z OpenFreeMap (dane © OpenStreetMap) — dopiero po kliknięciu.'}
        </p>
        {status !== 'unsupported' && (
          <button
            type="button"
            onClick={onActivate}
            disabled={busy}
            className="group relative isolate mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink-900 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors duration-500 ease-luxe disabled:cursor-wait sm:w-auto lg:mt-5 lg:min-h-13"
          >
            <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand-600 transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
            {busy ? 'Wczytywanie mapy…' : failed ? 'SPRÓBUJ PONOWNIE' : 'Pokaż interaktywną mapę'}
          </button>
        )}
      </div>
    </div>
  )
}
