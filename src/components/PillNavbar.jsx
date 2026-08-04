import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV } from '@/constants/nav'
import { whatsappRequestUrl } from '@/constants/contact'
import { BrandMark } from '@/components/BrandMark'

/**
 * Floating pill navbar — uses KARYA tokens (radius-sm, ink, cognac).
 */
export function PillNavbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lang = i18n.language?.startsWith('kk') ? 'kk' : 'ru'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const setLang = (next) => {
    i18n.changeLanguage(next)
    localStorage.setItem('karya-lang', next)
  }

  const close = () => setOpen(false)

  useEffect(() => {
    const sync = () => {
      if (document.body.classList.contains('karya-modal-open')) setOpen(false)
    }
    const obs = new MutationObserver(sync)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    sync()
    return () => obs.disconnect()
  }, [])

  return (
    <div
      className="karya-pill-nav pointer-events-none fixed left-1/2 z-[50] w-[min(100%-1.5rem,1600px)] -translate-x-1/2 transition-[opacity,visibility] duration-200 sm:w-[min(100%-2rem,1600px)]"
      style={{ top: 'max(0.75rem, calc(var(--safe-top) + 0.5rem))' }}
    >
      <div
        className={cn(
          'pointer-events-auto liquid-glass-light flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2 transition-all duration-300 sm:gap-3 sm:px-4 sm:py-2.5',
          scrolled ? 'shadow-elevated' : 'shadow-soft',
        )}
      >
        <a href="#top" onClick={close} className="relative z-[1] shrink-0 pl-1">
          <BrandMark size="sm" shiny />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link rounded-[var(--radius-sm)] px-3 py-1.5 text-[10px] lg:px-3.5 lg:text-[11px]"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="lang-switch hidden sm:inline-flex">
            {['ru', 'kk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(lang === code && 'is-on')}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={whatsappRequestUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-dark hidden !min-h-9 !px-3 !py-2 !text-[10px] sm:inline-flex lg:!px-4"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="hidden lg:inline">{t('nav.whatsapp')}</span>
            <span className="lg:hidden">WA</span>
          </a>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-white/80 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            <span className="flex w-4 flex-col items-center justify-center gap-[5px]" aria-hidden>
              <span
                className={cn(
                  'block h-0.5 w-4 origin-center bg-[var(--text-primary)] transition-transform duration-300',
                  open && 'translate-y-[3.5px] rotate-45',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
              />
              <span
                className={cn(
                  'block h-0.5 w-4 origin-center bg-[var(--text-primary)] transition-transform duration-300',
                  open && '-translate-y-[3.5px] -rotate-45',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border bg-white/98 shadow-elevated backdrop-blur-md transition-all duration-300 md:hidden',
          'rounded-[var(--radius-sm)]',
          open
            ? 'pointer-events-auto mt-2 max-h-[min(80dvh,32rem)] border-[var(--border-color)] opacity-100'
            : 'pointer-events-none mt-0 max-h-0 border-transparent opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col p-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-[var(--radius-sm)] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] transition-colors active:bg-[var(--bg-muted)]"
            >
              {t(item.key)}
            </a>
          ))}
          <div className="my-1 border-t border-[var(--border-color)]" />
          <div className="lang-switch m-2 w-auto">
            {['ru', 'kk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn('min-h-10 flex-1', lang === code && 'is-on')}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href={whatsappRequestUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="btn-secondary-dark btn-block m-2"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            {t('nav.whatsapp')}
          </a>
        </nav>
      </div>
    </div>
  )
}
