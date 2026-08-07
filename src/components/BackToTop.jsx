import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Floating glass back-to-top button.
 * Fixed in bottom-right corner ABOVE ConciergeBar (bottom: ~84px / 5.25rem).
 * Appears ONLY after scrolling down to section 3 (#details / Brand Journey).
 */
export function BackToTop() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      const vh = window.innerHeight || 800

      // Trigger appearance when user reaches section 3 (#details / Brand Journey)
      const detailsEl = document.querySelector('#details')
      let threshold = vh * 1.8
      if (detailsEl) {
        const top = detailsEl.getBoundingClientRect().top + y
        threshold = Math.max(vh * 1.5, top - 200)
      }

      setShow(y >= threshold)
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
          className="liquid-glass-light flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-primary)] shadow-elevated transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            position: 'fixed',
            right: 'max(1rem, calc(var(--safe-right) + 1rem))',
            bottom: 'max(5.25rem, calc(var(--safe-bottom) + 5.25rem))',
            zIndex: 99,
          }}
          aria-label={t('backToTop.aria')}
          title={t('backToTop.aria')}
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
