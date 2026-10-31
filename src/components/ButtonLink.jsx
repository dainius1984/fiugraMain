import { motion } from 'motion/react'

const base =
  'group/btn relative isolate inline-flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ease-luxe'

const variants = {
  brand: 'bg-brand-600 text-ivory-50 hover:text-ivory-50',
  ink: 'bg-ink-900 text-ivory-50 hover:text-ivory-50',
  outline: 'border border-brand-300 text-ink-900 hover:border-ink-900 hover:text-ivory-50',
  'outline-light': 'border border-ivory-100/30 text-ivory-100 hover:border-ivory-100 hover:text-ink-900',
}

const sweep = {
  brand: 'bg-ink-900',
  ink: 'bg-brand-600',
  outline: 'bg-ink-900',
  'outline-light': 'bg-ivory-100',
}

/**
 * Pill link with a refined fill-sweep on hover and a gentle press state.
 * Pass `external` to open in a new tab safely.
 */
export default function ButtonLink({
  href,
  children,
  variant = 'ink',
  external = false,
  className = '',
  icon: Icon,
  iconOnly = false,
  label,
  ...rest
}) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${iconOnly ? 'aspect-square shrink-0 px-0 w-14' : ''} ${className}`}
      aria-label={label}
      {...externalProps}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-luxe group-hover/btn:scale-x-100 ${sweep[variant]}`}
      />
      {!iconOnly && <span className="whitespace-nowrap">{children}</span>}
      {Icon && (
        <Icon
          className={`size-4 shrink-0 transition-transform duration-500 ease-luxe ${
            iconOnly ? 'size-5' : 'group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5'
          }`}
          strokeWidth={1.75}
        />
      )}
    </motion.a>
  )
}
