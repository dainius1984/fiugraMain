/**
 * Central list of Studio Figura locations.
 *
 * Only add information that has been verified with the studio.
 * Leave optional fields as `null` — the UI hides anything that is missing.
 *
 * Fields:
 *  - id          unique slug; a photo at /public/images/studios/<id>.webp|jpg is picked up automatically
 *  - name        full studio name
 *  - city        city (used for filter chips and search)
 *  - district    optional district / area name (searchable)
 *  - street      street address
 *  - website     official studio website (https)
 *  - facebook    official Facebook page URL, or null
 *  - instagram   official Instagram profile URL, or null
 *  - coordinates { lat, lng } — only verified values, or null
 *                (the map falls back to the street address when null)
 */
export const studios = [
  {
    id: 'strzelin',
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
    name: 'Studio Figura Wrocław Szczepin',
    city: 'Wrocław',
    district: 'Szczepin',
    street: 'ul. Michalczyka 3C',
    website: 'https://studiofigurawroclaw.pl/',
    facebook: null,
    instagram: null,
    coordinates: null,
  },
]
