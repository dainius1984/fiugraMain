import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

/** Fades and lifts content into view once, the first time it is scrolled to. */
export default function Reveal({ as = 'div', delay = 0, y = 28, className = '', children, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export { EASE }
