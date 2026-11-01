import { useEffect, useId, useRef, useState } from 'react'
import { Check, Copy, Phone, X } from 'lucide-react'
import ButtonLink from './ButtonLink'
import { telHref } from '../lib/studio-utils'

/** Devices with a precise pointer that can hover — i.e. a mouse. Touch devices dial directly. */
const DESKTOP_POINTER = '(hover: hover) and (pointer: fine)'

/**
 * "Zadzwoń do nas" for one studio — shared by the studio cards and the map details panel.
 *
 * - The trigger is a real `tel:` link, so it works without JavaScript and on every phone:
 *   tapping it opens the dialer (the visitor still confirms the call there).
 * - With a mouse (no assumption that the computer can place calls) the click opens a small
 *   native <dialog> instead: the number, "Kopiuj numer" and "Zadzwoń".
 *   Escape / × / backdrop close it, and focus returns to the trigger.
 */
export default function StudioPhoneAction({ studio, className = '', size = 'md' }) {
  const href = telHref(studio)
  const triggerRef = useRef(null)
  const [open, setOpen] = useState(false)

  if (!href) return null

  const onClick = (event) => {
    if (!window.matchMedia(DESKTOP_POINTER).matches) return // touch: let the tel: link dial
    event.preventDefault()
    triggerRef.current = event.currentTarget
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    // Return focus to the trigger (native <dialog> also does this; explicit for consistency).
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }

  return (
    <>
      <ButtonLink
        href={href}
        onClick={onClick}
        variant="outline"
        size={size}
        icon={Phone}
        iconClassName="text-brand-400"
        className={className}
        aria-haspopup="dialog"
        aria-label={`Zadzwoń do nas: ${studio.name}, ${studio.phone.display}`}
      >
        Zadzwoń do nas
      </ButtonLink>
      {open && <PhoneDialog studio={studio} href={href} onClose={close} />}
    </>
  )
}

function PhoneDialog({ studio, href, onClose }) {
  const dialogRef = useRef(null)
  const numberRef = useRef(null)
  const copyRef = useRef(null)
  const titleId = useId()
  const descId = useId()
  const [copy, setCopy] = useState('idle') // idle | copied | manual
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    copyRef.current?.focus() // first useful action (showModal would focus the × button)
    const onCancel = (event) => {
      event.preventDefault()
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      if (dialog.open) dialog.close()
    }
  }, []) // open exactly once per mount

  const selectNumber = () => {
    const range = document.createRange()
    range.selectNodeContents(numberRef.current)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const copyNumber = async () => {
    const text = studio.phone.display
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(text)
      setCopy('copied')
    } catch {
      // Fallback: select the visible number and try the legacy copy command.
      selectNumber()
      let ok = false
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      setCopy(ok ? 'copied' : 'manual')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="sf-dialog m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl bg-ivory-50 p-0 text-ink-900 shadow-[0_40px_90px_-40px_rgba(23,23,23,0.6)] ring-1 ring-brand-200"
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onKeyDown={(event) => {
        // Keep Escape inside the dialog (the map panel around it also listens for Escape).
        if (event.key === 'Escape') event.stopPropagation()
      }}
    >
      <div className="relative p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij okno z numerem telefonu"
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-ink-600 transition-colors duration-300 hover:bg-ivory-200 hover:text-ink-900"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>

        <p className="eyebrow flex items-center gap-3 text-brand-600">
          <Phone className="size-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
          Zadzwoń do nas
        </p>
        <h2 id={titleId} className="mt-3 pr-10 font-serif text-[1.6rem] leading-tight text-ink-900">
          {studio.name}
        </h2>
        <p id={descId} className="sr-only">
          Numer telefonu studia. Możesz go skopiować albo otworzyć w aplikacji do połączeń.
        </p>
        <p
          ref={numberRef}
          // Clean sans-serif digits for fast reading (the studio name above stays serif).
          // Each group is unbreakable; ordinary spaces between groups keep manual copies clean.
          className="sf-phone-number mt-3 select-all font-sans text-[clamp(1.5rem,8.2vw,2.125rem)] font-semibold leading-tight tracking-[-0.01em] text-ink-900"
        >
          {studio.phone.display.split(' ').map((group, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span className="inline-block whitespace-nowrap">{group}</span>
            </span>
          ))}
        </p>

        <div className="mt-6 grid gap-2.5">
          <button
            type="button"
            ref={copyRef}
            onClick={copyNumber}
            className="group inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full border border-brand-300 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-900 transition-colors duration-300 hover:border-ink-900"
          >
            {copy === 'copied' ? (
              <Check className="size-4 text-brand-400" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Copy className="size-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
            )}
            {copy === 'copied' ? 'Skopiowano' : 'Kopiuj numer'}
          </button>
          <ButtonLink href={href} variant="ink" icon={Phone} className="w-full px-4 text-[0.74rem]">
            Zadzwoń
          </ButtonLink>
        </div>

        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-[0.82rem] text-ink-600">
          {copy === 'copied' && 'Numer skopiowany'}
          {copy === 'manual' && 'Numer jest zaznaczony — skopiuj go skrótem Ctrl+C (⌘+C).'}
        </p>
      </div>
    </dialog>
  )
}
