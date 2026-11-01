/**
 * Central list of Studio Figura locations — the five locations confirmed by the client.
 *
 * Only add information that has been verified with the studio.
 * Leave optional fields as `null` — the UI hides anything that is missing.
 *
 * Fields:
 *  - id          unique slug; a photo at /public/images/studios/<id>.webp|jpg is picked up automatically
 *  - published   false hides the entry from the website entirely
 *  - name        full studio name
 *  - city        city / town
 *  - district    optional district name (shown as the card's short label)
 *  - street      street address
 *  - website     official studio website (https), or null
 *  - facebook    official Facebook page URL, or null
 *                (cards link to the website when present, otherwise to Facebook)
 *  - instagram   official Instagram profile URL, or null
 *  - phone       { e164, display }: the studio's own number (client-supplied 2026-11-01).
 *                e164 feeds tel: links; display is what visitors read. null hides call actions.
 *  - coordinates { lat, lng } of the building, used for the overview map.
 *                Source: OpenStreetMap / Nominatim, house-level match for each street address
 *                (checked 2026-10-31). "Wyznacz trasę" always navigates by street address.
 */
export const studios = [
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
    phone: { e164: '+48500753477', display: '+48 500 753 477' },
    coordinates: { lat: 51.119799, lng: 17.0173832 },
  },
  {
    id: 'wroclaw-swojczyce',
    published: true,
    name: 'Studio Figura Wrocław Swojczyce',
    city: 'Wrocław',
    district: 'Swojczyce',
    street: 'ul. Chałupnicza 30A',
    website: 'https://studiofigurawroclaw.com/',
    facebook: null,
    instagram: null,
    phone: { e164: '+48728809122', display: '+48 728 809 122' },
    coordinates: { lat: 51.1106034, lng: 17.1268951 },
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
    phone: { e164: '+48537863083', display: '+48 537 863 083' },
    coordinates: { lat: 51.0592934, lng: 17.0126415 },
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
    phone: { e164: '+48532255745', display: '+48 532 255 745' },
    coordinates: { lat: 51.034787, lng: 16.9626561 },
  },
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
    phone: { e164: '+48881281092', display: '+48 881 281 092' },
    coordinates: { lat: 50.77828, lng: 17.06487 },
  },
]

/** A studio is shown only when published and complete enough to be useful. */
export const publishedStudios = studios.filter(
  (s) => s.published && s.name && s.city && s.street && (s.website || s.facebook)
)
