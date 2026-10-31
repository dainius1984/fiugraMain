/**
 * Temporary typographic wordmark: a centred, stacked "STUDIO / FIGURA" lockup.
 * It is not the official logo. <BrandLogo> replaces it automatically once an
 * authorised logo file is added to /public/images/brand/.
 * Size it with a font-size class (e.g. `text-2xl`); everything scales in em.
 */
export default function Wordmark({ tone = 'dark', className = '' }) {
  const light = tone === 'light'
  return (
    <span role="img" aria-label="Studio Figura" className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        aria-hidden="true"
        className={`mr-[-0.72em] font-sans text-[0.4em] font-semibold tracking-[0.72em] ${
          light ? 'text-brand-400' : 'text-brand-600'
        }`}
      >
        STUDIO
      </span>
      <span
        aria-hidden="true"
        className={`mr-[-0.16em] mt-[0.16em] font-serif font-medium tracking-[0.16em] ${
          light ? 'text-ivory-50' : 'text-ink-900'
        }`}
      >
        FIGURA
      </span>
    </span>
  )
}
