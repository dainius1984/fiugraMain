const STUDIO_IMAGES = typeof __STUDIO_IMAGES__ !== 'undefined' ? __STUDIO_IMAGES__ : {}

export function fullAddress(studio) {
  return `${studio.street}, ${studio.city}`
}

export function studioImage(studio) {
  return studio.image ?? STUDIO_IMAGES[studio.id] ?? null
}

export function directionsUrl(studio) {
  const destination = studio.coordinates
    ? `${studio.coordinates.lat},${studio.coordinates.lng}`
    : `${studio.name}, ${fullAddress(studio)}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

export function mapEmbedUrl(studio) {
  const q = studio.coordinates
    ? `${studio.coordinates.lat},${studio.coordinates.lng}`
    : `${fullAddress(studio)}, Polska`
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`
}

export function displayHost(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** Lowercase + strip Polish diacritics so "wroclaw" matches "Wrocław". */
export function normalize(text) {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .trim()
}

export function matchesQuery(studio, query) {
  const q = normalize(query)
  if (!q) return true
  const haystack = normalize(
    [studio.name, studio.city, studio.district, studio.street].filter(Boolean).join(' ')
  )
  return q.split(/\s+/).every((token) => haystack.includes(token))
}

/** Polish plural: plural(3, ['studio', 'studia', 'studiów']) → 'studia'. */
export function plural(n, [one, few, many]) {
  if (n === 1) return one
  const d = n % 10
  const dd = n % 100
  return d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many
}
