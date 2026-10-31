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

- `published: false` hides an entry completely. Location 5 (`studio-5`) is kept this way until its
  details are confirmed: fill in `name`, `city`, `street` and `website` or `facebook`, then set `published: true`.
  Incomplete entries stay hidden even when marked as published.
- Primary button: **Odwiedź stronę** when `website` is set, otherwise **Odwiedź Facebook**.
  Secondary button: **Wyznacz trasę** (Google Maps directions built from the street address or verified `coordinates`).
- Layout: one column on mobile, two on tablet; on desktop, three per row (5 studios → 3 + 2 centred),
  with 4 studios shown as a balanced 2 × 2 grid.
- Optional fields (`district`, `facebook`, `instagram`, `coordinates`) can stay `null`; the UI hides what is missing.

Only enter verified information.

## Media — where to put files

Media is detected at build time, so the site never links to a file that does not exist.
**Restart `npm run dev` (or rebuild) after adding files.**

| What | Path | Notes |
| --- | --- | --- |
| Hero video (desktop) | `public/videos/studio-figura-hero.mp4` | H.264, 1920×1080 or less, 8–15 s seamless loop, no audio, ideally < 4 MB |
| Hero video, WebM (optional) | `public/videos/studio-figura-hero.webm` | VP9, offered first to browsers that support it |
| Hero video, mobile (optional) | `public/videos/studio-figura-hero-mobile.mp4` | Portrait 720×1280, < 2 MB. Without it, phones show the still image (faster for QR visitors) |
| Hero poster / still | `public/images/hero-poster.webp` (or `.jpg`) | ~1920×1080, < 250 KB. Shown before the video loads and as the mobile background |
| Studio photos | `public/images/studios/<id>.webp` (or `.jpg`) | `<id>` from studios.js: `strzelin.webp`, `wroclaw-zwycieska.webp`, `wroclaw-szczepin.webp`, `bielany-wroclawskie.webp`. 1200×750 (16:10), < 200 KB |

Without media, the hero uses built-in brand artwork, and each card gets its own distinct illustrative artwork (clearly abstract, not a photo of the location).
Video never loads for visitors with *reduced motion* or *data saver* enabled.
Use only footage and photos you have rights to.

**Logo:** the wordmark in [src/components/Wordmark.jsx](src/components/Wordmark.jsx) is typographic.
Swap it for the official Studio Figura logo once an authorised asset is supplied.

## Map

The map loads Google Maps only after the visitor clicks *Pokaż mapę*, for privacy and performance.
It uses the street address. Once verified coordinates are known, add
`coordinates: { lat, lng }` to a studio to pin the exact location.

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
