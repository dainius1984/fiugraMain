/**
 * MapLibre GL JS (v6) map for the studio finder — loaded lazily, only after the visitor
 * activates the map, so neither the library nor third-party tiles are fetched before that.
 *
 * Tiles/style: OpenFreeMap "Positron" (no API key). Coordinates come from studios.js
 * ({ lat, lng }) and are converted to MapLibre's [lng, lat] order here, in one place.
 */
import { AttributionControl, LngLatBounds, Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

setWorkerUrl(workerUrl)

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

/** Polish UI strings (keys from MapLibre's default locale table). */
const LOCALE = {
  'CooperativeGesturesHandler.WindowsHelpText': 'Użyj Ctrl + przewijania, aby przybliżyć mapę',
  'CooperativeGesturesHandler.MacHelpText': 'Użyj ⌘ + przewijania, aby przybliżyć mapę',
  'CooperativeGesturesHandler.MobileHelpText': 'Przesuwaj mapę dwoma palcami',
  'NavigationControl.ZoomIn': 'Przybliż',
  'NavigationControl.ZoomOut': 'Oddal',
  'AttributionControl.ToggleAttribution': 'Pokaż źródła mapy',
  'Map.Title': 'Mapa studiów Studio Figura',
  'Marker.Title': 'Znacznik studia',
}

const toLngLat = ({ lat, lng }) => [lng, lat]
const pad2 = (n) => String(n).padStart(2, '0')
const shortName = (name) => name.replace(/^Studio Figura\s*/, '')

export function webgl2Supported() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

/**
 * @param {HTMLElement} container
 * @param {{ studios: object[], reduceMotion: boolean, isCompact: () => boolean,
 *           focusInsets?: () => ({ top?: number, bottom?: number } | null),
 *           onSelect: (id: string, trigger: HTMLElement) => void,
 *           onReady: () => void, onError?: (error: Error) => void }} options
 */
export function createStudioMap(container, { studios, reduceMotion, isCompact, focusInsets, onSelect, onReady, onError }) {
  const located = studios.filter((s) => s.coordinates)
  const bounds = located.reduce((b, s) => b.extend(toLngLat(s.coordinates)), new LngLatBounds())

  // Room for the circular markers (48px) on every side. Bottom is a little deeper than top so the
  // southernmost studio (Strzelin) never sits on the edge; the top leaves space for the name tooltip.
  // Tablets (compact layout, wider container) get a step between phone and desktop.
  const fitPadding = () => {
    if (!isCompact()) return { top: 84, bottom: 96, left: 88, right: 88 }
    if (container.clientWidth >= 600) return { top: 64, bottom: 80, left: 56, right: 56 }
    return { top: 52, bottom: 68, left: 36, right: 36 }
  }
  // Compact layouts: `focusInsets` reports how much of the map the sticky header and the details
  // bottom sheet cover, so the focused studio is centred in the part that stays visible.
  const focusPadding = () => {
    if (!isCompact()) return { top: 60, bottom: 60, left: 420, right: 60 }
    const insets = focusInsets?.() ?? {}
    const top = Math.min(40 + (insets.top ?? 0), container.clientHeight / 2)
    // Always leave at least ~96px of map between the paddings.
    const bottom = Math.max(40, Math.min(40 + (insets.bottom ?? 0), container.clientHeight - top - 96))
    return { top, bottom, left: 24, right: 24 }
  }

  const map = new Map({
    container,
    style: STYLE_URL,
    bounds,
    // Start slightly wider, then settle onto the studios (skipped for reduced motion).
    fitBoundsOptions: { padding: reduceMotion ? fitPadding() : scalePadding(fitPadding(), 2.2), absolutePadding: true },
    attributionControl: false,
    cooperativeGestures: true,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    renderWorldCopies: false,
    minZoom: 6,
    maxZoom: 18,
    locale: LOCALE,
    // The observer below owns resize/refit ordering.
    trackResize: false,
  })
  map.touchZoomRotate.disableRotation()
  map.keyboard.disableRotation()

  map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')
  // OpenFreeMap's tile metadata supplies "OpenFreeMap © OpenMapTiles Data from OpenStreetMap".
  map.addControl(new AttributionControl({ compact: false }), 'bottom-left')

  const markers = new globalThis.Map()
  let destroyed = false
  let ready = false
  let resizeFrame = 0
  let resizeTimer
  let errorTimer

  located.forEach((studio, index) => {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'sf-mk'
    el.setAttribute('aria-label', `${pad2(index + 1)} — ${studio.name}, ${studio.street}, ${studio.city}. Pokaż szczegóły`)
    el.setAttribute('aria-pressed', 'false')
    el.style.setProperty('--sf-mk-delay', reduceMotion ? '0ms' : `${250 + index * 110}ms`)
    el.innerHTML = `<span class="sf-mk__dot" aria-hidden="true">${pad2(index + 1)}</span><span class="sf-mk__tip" aria-hidden="true">${shortName(studio.name)}</span>`
    const select = (event) => {
      event.stopPropagation()
      onSelect(studio.id, el)
    }
    el.addEventListener('click', select)
    const marker = new Marker({ element: el, anchor: 'center' }).setLngLat(toLngLat(studio.coordinates))
    markers.set(studio.id, { marker, el, studio, select })
  })

  let activeId = null

  const overview = (duration = 0) => map.fitBounds(bounds, {
    padding: fitPadding(), absolutePadding: true, duration, essential: true,
  })
  const focusedCamera = (id) => {
    const entry = markers.get(id)
    return entry && { center: toLngLat(entry.studio.coordinates), zoom: 14.5, padding: focusPadding() }
  }
  const refit = () => {
    if (destroyed || !ready || !container.clientWidth || !container.clientHeight) return
    map.stop()
    const target = focusedCamera(activeId)
    if (target) map.jumpTo(target)
    else overview()
  }

  // Keep the canvas in sync with layout changes (breakpoints, font scaling, late fonts).
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      if (!destroyed) map.resize()
    })
    clearTimeout(resizeTimer)
    // Camera calculations do not depend on pending tile requests or map.loaded().
    resizeTimer = setTimeout(refit, 150)
  })
  resizeObserver.observe(container)

  const fail = (error) => {
    if (destroyed) return
    clearTimeout(errorTimer)
    onError?.(error)
  }
  const handleError = ({ error, sourceId }) => {
    // A failed style cannot initialize. Individual tile errors get a recovery window
    // so a transient request does not immediately remove an otherwise usable map.
    if (!ready && (error?.url === STYLE_URL || (!sourceId && !map.getStyle()?.layers?.length))) {
      fail(error)
      return
    }
    if (!errorTimer) errorTimer = setTimeout(() => fail(error), 4000)
  }
  const handleSourceData = (event) => {
    if (event.tile?.state === 'loaded') {
      clearTimeout(errorTimer)
      errorTimer = undefined
    }
  }
  map.on('error', handleError)
  map.on('sourcedata', handleSourceData)

  const handleLoad = () => {
    if (destroyed) return
    ready = true
    warmUpStyle(map)
    markers.forEach(({ marker, el }) => {
      marker.addTo(map)
      el.classList.add('is-in') // staggered reveal via --sf-mk-delay
    })
    map.resize()
    overview(reduceMotion ? 0 : 1100)
    onReady()
  }
  map.once('load', handleLoad)

  return {
    setActive(id) {
      activeId = id
      markers.forEach(({ el }, key) => {
        const active = key === id
        el.classList.toggle('is-active', active)
        el.setAttribute('aria-pressed', String(active))
      })
    },
    focus(id) {
      const target = focusedCamera(id)
      if (!target || destroyed) return
      if (reduceMotion) {
        map.jumpTo(target)
        return
      }
      // Farther hops (e.g. Wrocław → Strzelin) get a little more time; capped for snappiness.
      const from = map.getCenter()
      const km = from.distanceTo({ lng: target.center[0], lat: target.center[1] }) / 1000
      const duration = Math.round(Math.min(900, 500 + km * 12))
      map.flyTo({ ...target, duration, curve: 1.2, essential: true })
    },
    showAll() {
      activeId = null
      if (ready && !destroyed) overview(reduceMotion ? 0 : 800)
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      cancelAnimationFrame(resizeFrame)
      clearTimeout(resizeTimer)
      clearTimeout(errorTimer)
      resizeObserver.disconnect()
      map.off('load', handleLoad)
      map.off('error', handleError)
      map.off('sourcedata', handleSourceData)
      markers.forEach(({ marker, el, select }) => {
        el.removeEventListener('click', select)
        marker.remove()
      })
      markers.clear()
      map.remove()
    },
  }
}

function scalePadding(padding, factor) {
  return Object.fromEntries(Object.entries(padding).map(([k, v]) => [k, Math.round(v * factor)]))
}

/**
 * Gentle brand tuning of the Positron style: warm-white land, soft warm-grey water, and a touch
 * more cartographic contrast — crisper place labels and slightly firmer main roads, still monochrome.
 * Layer ids are from OpenFreeMap Positron; each change is skipped if a layer is missing.
 * Runs on 'load', when the style is fully parsed.
 */
function warmUpStyle(map) {
  const paint = (layer, prop, value) => {
    if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value)
  }
  const layout = (layer, prop, value) => {
    if (map.getLayer(layer)) map.setLayoutProperty(layer, prop, value)
  }
  paint('background', 'background-color', '#f8f4ef')
  paint('water', 'fill-color', '#e4e2dd')

  // Place names: ink instead of pure black, with a sharp warm-white halo (the default is blurred).
  for (const id of ['label_city', 'label_city_capital', 'label_town', 'label_village']) {
    paint(id, 'text-color', '#171717')
    paint(id, 'text-halo-color', '#f8f4ef')
    paint(id, 'text-halo-width', 1.6)
    paint(id, 'text-halo-blur', 0.3)
  }
  paint('label_other', 'text-color', '#3d3a36')
  paint('label_other', 'text-halo-color', '#f8f4ef')
  paint('label_other', 'text-halo-blur', 0.3)
  // One step larger for towns and villages (the overview sits around zoom 9–10).
  layout('label_town', 'text-size', ['interpolate', ['exponential', 1.2], ['zoom'], 7, 13, 11, 15])
  layout('label_village', 'text-size', ['interpolate', ['exponential', 1.2], ['zoom'], 7, 11, 11, 13])

  // Street names and waterways: a little darker, same quiet greys.
  for (const id of ['highway-name-major', 'highway-name-minor']) {
    paint(id, 'text-color', '#4a4641')
    paint(id, 'text-halo-color', '#f8f4ef')
    paint(id, 'text-halo-width', 1.2)
  }
  paint('waterway_line_label', 'text-color', '#8c867e')

  // Main roads: warm-grey casings and low-zoom lines, readable but not colourful.
  for (const id of ['highway_major_casing', 'highway_motorway_casing', 'highway_motorway_bridge_casing']) {
    paint(id, 'line-color', '#cdc6bd')
  }
  paint('highway_major_subtle', 'line-color', 'rgba(196, 189, 180, 0.8)')
  paint('highway_motorway_subtle', 'line-color', 'rgba(188, 180, 170, 0.75)')
  for (const id of ['highway_motorway_inner', 'highway_motorway_bridge_inner']) {
    paint(id, 'line-color', ['interpolate', ['linear'], ['zoom'], 5.8, 'rgba(188, 180, 170, 0.75)', 6, '#ffffff'])
  }
}
