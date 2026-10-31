# Studio Figura — Znajdź swoje studio

## Project foundation

Package name: `studio-figura-locations`. JavaScript/JSX only; no Next.js, TypeScript,
or router. `src/main.jsx` mounts `src/App.jsx`, which exports the complete premium
website from `src/ExistingSite.jsx`. The original components, animations,
map and media fallbacks are active. The sections below describe the existing site.

```text
src/
  components/   # retained components
  sections/     # future page sections
  data/         # retained location and brand data
  assets/       # imported assets
  hooks/        # future reusable hooks
  styles/       # retained optional global wrapper
  lib/          # retained utilities
  App.jsx       # exports the complete website
  ExistingSite.jsx # preserved premium application
  index.css     # active original theme and reset
  main.jsx      # React entry point
public/
  images/
  videos/
  favicon.svg   # placeholder, not an official brand logo
```

Tailwind CSS v4 uses `@tailwindcss/vite` in `vite.config.js` and its CSS import
provides Preflight. Original responsive typography and layout are preserved.
Use Node.js 24 LTS and npm. On Windows PowerShell, use `npm.cmd` if script
execution policy blocks `npm.ps1`; no policy change is necessary.

Production canonical: `https://www.lokalizacjesf.pl/`. The domain is a technical
address, not the brand. Keep the typographic STUDIO FIGURA wordmark until an
authorized logo is supplied. The hero headline is “Twoje piękno. Twoje miejsce.”
Redirect configurations below require deployment and both domains to be configured;
they have not been activated or verified on production.

Do not commit credentials or `.env` files. Dependencies, builds, npm cache and
private key files are ignored. Commit `package-lock.json` for reproducible installs.

Location directory for Studio Figura. Production URL: **https://www.lokalizacjesf.pl**
(technical address only — the brand shown on the site is *Studio Figura*).

Stack: React 19 · Vite · Tailwind CSS v4 · Motion for React · self-hosted fonts (Cormorant Garamond, Manrope).

```bash
npm install
npm run dev      # local development
npm run build    # production build → dist/
npm run preview  # serve the production build
npm run qr       # regenerate QR codes → qr/
```

## Editing locations

All studio data lives in [src/data/studios.js](src/data/studios.js). Every published studio is shown
immediately (no search or filters), and the cards, counts, map and footer update automatically.

- Five locations: Wrocław Szczepin, Wrocław Swojczyce (website ends in **.com**; Szczepin's ends in **.pl**),
  Wrocław Zwycięska, Bielany Wrocławskie (Facebook only) and Strzelin. The client confirmed these five, including Strzelin.
- `published: false` hides an entry completely; incomplete entries stay hidden even when published.
- Primary button: **Odwiedź stronę** when `website` is set, otherwise **Odwiedź Facebook**.
  Secondary button: **Wyznacz trasę** (Google Maps directions built from the street address).
- Page order: hero → **map (main feature)** → studio cards → brand statement → footer. "Znajdź studio" links to `#mapa`.
- Card layout: one column on mobile, two on tablet and laptops, 3 + 2 centred from 1280px.
- Optional fields (`district`, `facebook`, `instagram`) can stay `null`; the UI hides what is missing.

Only enter verified information.

## Media — where to put files

Media is detected at build time, so the site never links to a file that does not exist.
**Restart `npm run dev` (or rebuild) after adding files.**

| What | Path | Notes |
| --- | --- | --- |
| Hero video (desktop) | `public/videos/studio-figura-hero.mp4` | H.264, 1920×1080 or less, 8–15 s seamless loop, no audio, ideally < 4 MB |
| Hero video, WebM (optional) | `public/videos/studio-figura-hero.webm` | VP9, offered first to browsers that support it |
| Hero video, mobile (optional) | `public/videos/studio-figura-hero-mobile.mp4` | Landscape 1280×800, < 2 MB (phones show the media as a 16:10 band). Without it, phones show the still image |
| Hero photo (responsive) | `public/images/hero-poster-<w>x<h>.avif` + `.webp` | Several widths of one image (e.g. 768, 1200, 1536). Build-time detection creates the `srcset`, width/height and an `index.html` preload |
| Hero photo (single file, alternative) | `public/images/hero-poster.webp` (or `.jpg`) | Used only when no sized variants exist |
| Hero photo, mobile crop (optional) | `public/images/hero-poster-mobile.webp` | Only if the main photo cannot be cropped well for phones |
| Studio photos | `public/images/studios/<id>.webp` (or `.jpg`) | `<id>` from studios.js: `wroclaw-szczepin.webp`, `wroclaw-swojczyce.webp`, `wroclaw-zwycieska.webp`, `bielany-wroclawskie.webp`. 1200×750 (16:10), < 200 KB |

**Current hero photo:** the selected campaign photograph `public/images/1.png` (1536×1024, 1.8 MB PNG, kept unchanged as the master).
The site serves optimised copies generated from it: `hero-poster-{768x512,1200x800,1536x1024}.avif` (13 / 24 / 35 KB) and
`.webp` (20 / 37 / 53 KB). Browsers download exactly one, typically the 1200 px AVIF, and never the PNG.
To replace the photo, regenerate the variants from the new master (any image tool, keeping the `-<w>x<h>` names).
Delete the variants to fall back to the built-in "natural light" artwork. A video, if added, plays over the photo.
The crop focus for hero photos and videos is `MEDIA_FOCUS` in `src/components/HeroMedia.jsx` (currently `35% 22%`).

Without media, the hero uses the built-in artwork (warm light and a palm-leaf shadow). Each card gets its own distinct
illustration, clearly abstract and not a photo of the location. Only add a studio photo that really shows that branch:
cards present it as that studio. Photos fade in once loaded, inside a reserved 16:10 box, so nothing shifts.
Video never loads for visitors with *reduced motion* or *data saver* enabled.
Use only footage and photos you have rights to.

**Logo:** [src/components/BrandLogo.jsx](src/components/BrandLogo.jsx) is used in the navigation and footer.
Add the official, authorised logo as `public/images/brand/studio-figura-logo.svg` (or `.webp` / `.png` with transparency).
Add `studio-figura-logo-light.*` for the dark footer. Both are picked up automatically at build time and shown undistorted
at the wordmark's height. Until then, the temporary typographic lockup in
[src/components/Wordmark.jsx](src/components/Wordmark.jsx) is shown. It is not the official logo.

## Map

The *Znajdź swoje Studio Figura* section is the main feature: one large map of all studios, a selector below it,
and a details panel for the chosen studio.

- **Library:** [MapLibre GL JS](https://maplibre.org/) 6.x (`maplibre-gl`), set up as the docs describe for bundlers:
  named imports, `setWorkerUrl` with `maplibre-gl-worker.mjs?worker&url`, and the package CSS.
  Code: `src/components/map/createStudioMap.js`. It needs WebGL 2; without it the site says so and the selector still works.
- **Tiles:** [OpenFreeMap](https://openfreemap.org/) style `positron` (vector tiles, no API key or billing). Its own
  attribution ("OpenFreeMap © OpenMapTiles Data from OpenStreetMap") is always shown. Land and water are lightly warmed to the brand palette.
- **Privacy and performance:** MapLibre (about 290 KB gzipped) and the tiles load only after the visitor presses
  **Pokaż interaktywną mapę**. The choice is remembered on that device (`localStorage` key `sf-map-consent`).
  Before that, a static preview shows the studios at their true relative positions, and the selector and
  details panel work without the map.
- **Markers:** numbered 01–05 in data order. Black with an orange ring; the active one turns orange. They appear with a short stagger,
  show the studio name on hover/keyboard focus, and are real buttons (keyboard and screen-reader accessible).
- **Selecting** a marker or a selector item flies the camera to the studio (500–900 ms depending on distance) and opens the
  details panel: name, address, **Odwiedź stronę** / **Odwiedź Facebook**, **Wyznacz trasę**. Nothing redirects
  automatically. Escape or × closes the panel. On phones the panel sits below the map; on desktop it floats at the top-left.
- **Pokaż wszystkie lokalizacje** clears the selection and fits all studios again.
- **Gestures:** cooperative gestures, so the page always scrolls normally (Ctrl/⌘ + scroll to zoom; two fingers to pan on phones).
  No rotation or tilt. Reduced motion turns off the marker stagger, camera flights and intro zoom.
- **Coordinates:** `coordinates` in studios.js (stored as `{ lat, lng }`, converted to MapLibre's `[lng, lat]` in one place).
  All five were re-checked with OpenStreetMap Nominatim on 2026-10-31; each matches the exact house number.

## Visual identity

The palette matches the client's promotional banner: white, black and Studio Figura orange.
Every colour is a token in `src/index.css` (`@theme static`, so tokens used only from inline SVG styles are emitted too):

- `ivory-*`: warm whites (background `#F8F4EF`, surfaces `#FFFFFF`).
- `ink-*`: black and charcoal (text `#171717`, muted `#716B66`, dark `#141414`).
- `brand-*`: orange.
  - `brand-400` **`#E05A22`** is the signature orange for lines, icons, large display type and map markers.
  - `brand-600` `#B4441A` is for small orange text on light backgrounds and for fills behind white text (WCAG AA).
  - `brand-50`…`brand-300` are light tints for hairlines, hover washes and illustration line work.

**Layout:** sections share the `container-site` utility (1240px of content on desktop). The card grid uses the slightly wider `container-wide` (1312px). From 1700px the root font size scales up by 6.25%, and from 2200px by 12.5%, so large monitors keep the same proportions. Both utilities are in `src/index.css`.

Orange stays an accent and never fills whole sections. Black is reserved for buttons, map markers and the footer.
The favicon (`public/favicon.svg`) is a static file, so it repeats `#E05A22` directly.

## Domain, redirects and QR codes

- Canonical URL: `https://www.lokalizacjesf.pl/` (set in `index.html`, `robots.txt`, `sitemap.xml`).
- **301 redirect** `lokalizacjesf.pl` → `https://www.lokalizacjesf.pl` (and HTTP → HTTPS):
  - Apache / most Polish shared hosting: `public/.htaccess` (copied into `dist/` on build).
  - Vercel: `vercel.json`. Also add both domains in the project settings and mark `www` as primary.
  - Netlify: add both domains, set `www.lokalizacjesf.pl` as primary (Netlify redirects automatically).
  - nginx:
    ```nginx
    server { listen 80; listen 443 ssl; server_name lokalizacjesf.pl;
             return 301 https://www.lokalizacjesf.pl$request_uri; }
    ```
- QR codes: `npm run qr` writes `qr/studio-figura-qr.svg` (vector, for print) and `.png` (2048 px),
  both encoding `https://www.lokalizacjesf.pl/`. Test a printed code before mass printing.

## Social sharing image

No `og:image` is set yet, because no authorised brand image exists. When one is available, add a
1200×630 JPG at `public/og-image.jpg` and add to `index.html`:
`<meta property="og:image" content="https://www.lokalizacjesf.pl/og-image.jpg" />`
(and change `twitter:card` to `summary_large_image`).
