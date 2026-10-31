import Wordmark from './Wordmark'

const LOGO = typeof __BRAND_LOGO__ !== 'undefined' ? __BRAND_LOGO__ : {}

/**
 * Official Studio Figura logo (files detected at build time in /public/images/brand/).
 *
 *  variant="mark"  SF monogram — compact navigation, where the full lockup's small
 *                  "STUDIO FIGURA" line would be too small to read
 *  variant="full"  complete lockup; tone="light" uses the white-lettered file for dark backgrounds
 *
 * Size it with a height class (e.g. `h-11`); width follows the intrinsic aspect ratio, so the logo
 * is never stretched. Width/height attributes reserve space before the image loads.
 * Falls back to the typographic <Wordmark> if no logo file is present.
 */
export default function BrandLogo({ variant = 'full', tone = 'dark', className = '', alt = 'Studio Figura' }) {
  const asset = variant === 'mark' ? LOGO.mark : tone === 'light' ? LOGO.light : LOGO.dark
  if (asset?.src) {
    return (
      <img
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={alt}
        decoding="async"
        className={`block w-auto max-w-none select-none ${className}`}
        draggable="false"
      />
    )
  }
  return <Wordmark tone={tone} className="text-[1.4rem] md:text-[1.7rem]" />
}
