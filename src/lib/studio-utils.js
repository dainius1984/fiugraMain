const STUDIO_IMAGES = typeof __STUDIO_IMAGES__ !== 'undefined' ? __STUDIO_IMAGES__ : {}

export function fullAddress(studio) {
  return `${studio.street}, ${studio.city}`
}

/** Short, prominent label for a card: the district when present, otherwise the town. */
export function shortLabel(studio) {
  return studio.district ?? studio.city
}

export function studioImage(studio) {
  return studio.image ?? STUDIO_IMAGES[studio.id] ?? null
}

/** Main destination for a studio: its website, or its Facebook page when there is no website. */
export function primaryLink(studio) {
  if (studio.website) return { href: studio.website, kind: 'website', label: 'Odwiedź stronę' }
  if (studio.facebook) return { href: studio.facebook, kind: 'facebook', label: 'Odwiedź Facebook' }
  return null
}

/** Google Maps directions to the studio's street address (clearer for visitors than raw coordinates). */
export function directionsUrl(studio) {
  const destination = `${fullAddress(studio)}, Polska`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** Polish plural: plural(3, ['studio', 'studia', 'studiów']) → 'studia'. */
export function plural(n, [one, few, many]) {
  if (n === 1) return one
  const d = n % 10
  const dd = n % 100
  return d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many
}
