import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Floating glass back-to-top button.
 * Appears when scrolling down past ~450px; smoothly scrolls back to #top.
 */
export function BackToTop() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setShow(y > 450)
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
          className="liquid-glass-light fixed right-4 bottom-20 z-[45] flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-primary)] shadow-elevated transition-transform hover:scale-110 active:scale-95 sm:right-6 sm:bottom-24 sm:h-11 sm:w-11"
          aria-label={t('backToTop.aria')}
          title={t('backToTop.aria')}
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
