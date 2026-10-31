import Wordmark from './Wordmark'

const LOGO = typeof __BRAND_LOGO__ !== 'undefined' ? __BRAND_LOGO__ : {}

/**
 * Brand mark used in the navigation and footer.
 * - Official logo: drop an authorised file into /public/images/brand/
 *   (`studio-figura-logo.svg|webp|png`, plus `studio-figura-logo-light.*` for the dark footer)
 *   and it is used automatically, unscaled in proportion (height-driven, `w-auto`).
 * - Until then the typographic <Wordmark> is shown.
 *
 * `className` sets the size: a height for the image (e.g. `h-10`) is derived from the
 * same font-size class used by the wordmark, so both versions occupy the same space.
 */
export default function BrandLogo({ tone = 'dark', className = '' }) {
  const src = tone === 'light' ? LOGO.light : LOGO.dark
  if (src) {
    return <img src={src} alt="Studio Figura" className={`block h-[1.6em] w-auto ${className}`} decoding="async" />
  }
  return <Wordmark tone={tone} className={className} />
}
