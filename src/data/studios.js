/**
 * Central list of Studio Figura locations.
 *
 * Only add information that has been verified with the studio.
 * Leave optional fields as `null` — the UI hides anything that is missing.
 *
 * Fields:
 *  - id          unique slug; a photo at /public/images/studios/<id>.webp|jpg is picked up automatically
 *  - published   false keeps the entry out of the website entirely (no empty or placeholder card)
 *  - name        full studio name
 *  - city        city / town (shown on the card and used for navigation)
 *  - district    optional district name (shown as the card's short label)
 *  - street      street address
 *  - website     official studio website (https), or null
 *  - facebook    official Facebook page URL, or null
 *                (cards link to the website when present, otherwise to Facebook)
 *  - instagram   official Instagram profile URL, or null
 *  - coordinates { lat, lng } — only verified values, or null
 *                (navigation and the map fall back to the street address when null)
 */
export const studios = [
  {
    id: 'strzelin',
    published: true,
    name: 'Studio Figura Strzelin',
    city: 'Strzelin',
    district: null,
    street: 'ul. Fabryczna 25',
    website: 'https://studiofigurastrzelin.pl/',
    facebook: null,
    instagram: null,
    coordinates: null,
  },
  {
    id: 'wroclaw-zwycieska',
    published: true,
    name: 'Studio Figura Wrocław Zwycięska',
    city: 'Wrocław',
    district: 'Zwycięska',
    street: 'ul. Zwycięska 43',
    website: 'https://sfwroclawzwycieska.pl/',
    facebook: null,
    instagram: null,
    coordinates: null,
  },
  {
    id: 'wroclaw-szczepin',
    published: true,
    name: 'Studio Figura Wrocław Szczepin',
    city: 'Wrocław',
    district: 'Szczepin',
    street: 'ul. Michalczyka 3C',
    website: 'https://studiofigurawroclaw.pl/',
    facebook: null,
    instagram: null,
    coordinates: null,
  },
  {
    id: 'bielany-wroclawskie',
    published: true,
    name: 'Studio Figura Bielany Wrocławskie',
    city: 'Bielany Wrocławskie',
    district: null,
    street: 'ul. Agrestowa 18',
    website: null,
    facebook: 'https://www.facebook.com/share/1EzaXjEp3B/?mibextid=wwXIfr',
    instagram: null,
    coordinates: null,
  },
  {
    // Location 5 — details pending. Fill in verified data and set `published: true`.
    id: 'studio-5',
    published: false,
    name: null,
    city: null,
    district: null,
    street: null,
    website: null,
    facebook: null,
    instagram: null,
    coordinates: null,
  },
]

/** A studio is shown only when published and complete enough to be useful. */
export const publishedStudios = studios.filter(
  (s) => s.published && s.name && s.city && s.street && (s.website || s.facebook)
)
