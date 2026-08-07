import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Floating glass back-to-top button.
 * Fixed in bottom-right corner, visible whenever scrolled > 300px.
 */
export function BackToTop() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setShow(y > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="liquid-glass-light flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-primary)] shadow-elevated transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            position: 'fixed',
            right: 'max(1.25rem, calc(var(--safe-right) + 1.25rem))',
            bottom: 'max(1.25rem, calc(var(--safe-bottom) + 1.25rem))',
            zIndex: 99,
          }}
          aria-label={t('backToTop.aria')}
          title={t('backToTop.aria')}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
