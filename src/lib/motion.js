/**
 * Mindloop-style fade-up for whileInView sections (Framer Motion).
 * @param {number} delay seconds
 */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})
