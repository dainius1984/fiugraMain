/** Typographic wordmark — replace with the official logo once an authorised asset is supplied. */
export default function Wordmark({ className = '' }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.45em] font-serif leading-none ${className}`}>
      <span className="tracking-[0.34em]">STUDIO</span>
      <span aria-hidden="true" className="h-[0.28em] w-[0.28em] -translate-y-[0.12em] rotate-45 bg-gold-400" />
      <span className="tracking-[0.34em]">FIGURA</span>
    </span>
  )
}
