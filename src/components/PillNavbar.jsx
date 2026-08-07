import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV } from '@/constants/nav'
import {
  PHONE_TEL,
  PHONE_DISPLAY,
  whatsappRequestUrl,
  INSTAGRAM_URL,
} from '@/constants/contact'
import { BrandMark } from '@/components/BrandMark'
import { InstagramIcon } from '@/components/InstagramIcon'

/** Shared control size in the top bar (desktop) */
const BAR_CTRL =
  'inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-[0.12em]'

/** Ignore tiny scroll noise (touch bounce / trackpad) */
const SCROLL_DELTA = 6
/** Always show nav while near the top of the page */
const TOP_REVEAL = 48
/** Start auto-hide only after leaving the hero zone a bit */
const HIDE_AFTER = 80

/**
 * Floating navbar — mobile: logo + hamburger only.
 * Lang + Phone + WA + Instagram live inside liquid-glass mobile panel and desktop bar.
 * Hides on scroll-down, reappears on scroll-up (classic luxury chrome).
 */
export function PillNavbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lang = i18n.language?.startsWith('kk') ? 'kk' : 'ru'

  useEffect(() => {
    let lastY = window.scrollY || 0
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY || 0
      setScrolled(y > 24)

      // Menu open → keep bar visible so panel stays reachable
      if (open) {
        setHidden(false)
        lastY = y
        return
      }

      const delta = y - lastY

      if (y <= TOP_REVEAL) {
        setHidden(false)
      } else if (delta > SCROLL_DELTA && y > HIDE_AFTER) {
        setHidden(true)
      } else if (delta < -SCROLL_DELTA) {
        setHidden(false)
      }

      lastY = y
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

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
      className={cn(
        'karya-pill-nav pointer-events-none fixed left-1/2 z-[50] w-[min(100%-1.5rem,1600px)] sm:w-[min(100%-2rem,1600px)]',
        hidden && !open && 'karya-pill-nav--hidden',
      )}
      style={{ top: 'max(0.75rem, calc(var(--safe-top) + 0.5rem))' }}
    >
      <div
        className={cn(
          'pointer-events-auto liquid-glass-light flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2 transition-all duration-300 sm:gap-3 sm:px-4 sm:py-2.5',
          scrolled ? 'shadow-elevated' : 'shadow-soft',
        )}
      >
        <a href="#top" onClick={close} className="relative z-[1] min-w-0 shrink pl-1">
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

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Desktop quick action buttons */}
          <div className="hidden items-center gap-1.5 md:flex">
            <div className="lang-switch !h-9 !p-0.5">
              {['ru', 'kk'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={cn(
                    '!h-8 !min-h-0 !px-2.5 !text-[10px]',
                    lang === code && 'is-on',
                  )}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quick Call */}
            <a
              href={PHONE_TEL}
              className={cn(
                BAR_CTRL,
                'h-9 w-9 bg-[var(--bg-dark)] text-[var(--text-light)] transition-colors hover:bg-[var(--accent-cognac)]',
              )}
              aria-label="Позвонить в бутик"
              title={PHONE_DISPLAY}
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>

            {/* WhatsApp — icon only, brand green on hover */}
            <a
              href={whatsappRequestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                BAR_CTRL,
                'h-9 w-9 bg-[var(--bg-dark)] text-[var(--text-light)] transition-colors hover:bg-[#25D366] hover:text-white',
              )}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>

            {/* Instagram — icon only, brand pink on hover */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                BAR_CTRL,
                'h-9 w-9 bg-[var(--bg-dark)] text-[var(--text-light)] transition-colors hover:bg-[#E4405F] hover:text-white',
              )}
              aria-label="Instagram"
            >
              <InstagramIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          </div>

          <button
            type="button"
            className={cn(
              BAR_CTRL,
              'h-9 w-9 border border-[var(--border-color)] bg-white/80 p-0 md:hidden',
            )}
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

      {/* Mobile dropdown panel — in signature liquid-glass style */}
      <div
        className={cn(
          'liquid-glass-light overflow-hidden transition-all duration-300 md:hidden',
          'rounded-[var(--radius-sm)] shadow-elevated',
          open
            ? 'pointer-events-auto mt-2 max-h-[min(80dvh,32rem)] opacity-100'
            : 'pointer-events-none mt-0 max-h-0 opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav className="relative z-[1] flex min-w-0 flex-col p-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] transition-colors hover:bg-white/60 active:bg-white/80"
            >
              {t(item.key)}
            </a>
          ))}

          <div className="my-1.5 border-t border-[var(--border-color)]" />

          {/* Mobile action bar */}
          <div className="space-y-1.5 p-1">
            <div className="grid grid-cols-2 gap-1.5">
              {['ru', 'kk'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-colors',
                    lang === code
                      ? 'bg-[var(--bg-dark)] text-[var(--text-light)] shadow-sm'
                      : 'border border-[var(--border-color)] bg-white/50 text-[var(--text-primary)] hover:bg-white/80',
                  )}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <a
                href={PHONE_TEL}
                onClick={close}
                className="flex h-11 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-dark)] text-xs font-bold uppercase tracking-wider text-[var(--text-light)] transition-colors hover:bg-[var(--accent-cognac)] active:scale-95 shadow-sm"
                aria-label="Позвонить"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span>Звонок</span>
              </a>
              <a
                href={whatsappRequestUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex h-11 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-dark)] text-xs font-bold uppercase tracking-wider text-[var(--text-light)] transition-colors hover:bg-[#25D366] active:scale-95 shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span>WA</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex h-11 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-dark)] text-xs font-bold uppercase tracking-wider text-[var(--text-light)] transition-colors hover:bg-[#E4405F] active:scale-95 shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span>IG</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
