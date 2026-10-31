import { motion } from 'motion/react'

const base =
  'group/btn relative isolate inline-flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ease-luxe'

const variants = {
  gold: 'bg-gold-400 text-forest-950 hover:text-forest-950',
  forest: 'bg-forest-900 text-ivory-100 hover:text-forest-950',
  outline: 'border border-forest-900/20 text-forest-900 hover:border-forest-900 hover:text-ivory-100',
  'outline-light': 'border border-ivory-100/30 text-ivory-100 hover:border-ivory-100 hover:text-forest-950',
}

const sweep = {
  gold: 'bg-gold-200',
  forest: 'bg-gold-300',
  outline: 'bg-forest-900',
  'outline-light': 'bg-ivory-100',
}

/**
 * Pill link with a refined fill-sweep on hover and a gentle press state.
 * Pass `external` to open in a new tab safely.
 */
export default function ButtonLink({
  href,
  children,
  variant = 'forest',
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
