import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV } from '@/constants/nav'
import { whatsappRequestUrl } from '@/constants/contact'
import { BrandMark } from '@/components/BrandMark'

/**
 * Floating pill navbar (Drift-inspired, KARYA palette).
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

  return (
    <div
      className="fixed left-1/2 z-[50] w-[min(100%-1.5rem,1600px)] -translate-x-1/2 sm:w-[min(100%-2rem,1600px)]"
      style={{ top: 'max(0.75rem, calc(var(--safe-top) + 0.5rem))' }}
    >
      {/* Pill */}
      <div
        className={cn(
          'liquid-glass-light flex items-center justify-between gap-2 rounded-[8px] px-3 py-2 transition-all duration-300 sm:gap-3 sm:px-4 sm:py-2.5',
          scrolled ? 'shadow-lg' : 'shadow-md',
        )}
      >
        <a href="#top" onClick={close} className="relative z-[1] shrink-0 pl-1">
          {/* Width edge-to-edge + shine sweep on SINCE 1980 */}
          <BrandMark size="sm" shiny />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[8px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:bg-[#1A1817]/5 hover:text-[var(--text-primary)] lg:px-3.5 lg:text-[11px]"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden overflow-hidden rounded-[8px] border border-[var(--border-color)] sm:inline-flex">
            {['ru', 'kk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-bold tracking-wider transition-colors',
                  lang === code
                    ? 'bg-[#1A1817] text-[#F8F7F4]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                )}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={whatsappRequestUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-[8px] bg-[#1A1817] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F8F7F4] transition-colors hover:bg-[#8C5E3C] sm:inline-flex lg:px-4"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="hidden lg:inline">{t('nav.whatsapp')}</span>
            <span className="lg:hidden">WA</span>
          </a>

          {/* Animated hamburger → X */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--border-color)] bg-white/80 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  'absolute left-0 top-0 block h-0.5 w-4 bg-[var(--text-primary)] transition-transform duration-300',
                  open && 'top-1.5 rotate-45',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
              />
              <span
                className={cn(
                  'absolute left-0 top-[6px] block h-0.5 w-4 bg-[var(--text-primary)] transition-transform duration-300',
                  open && 'top-1.5 -rotate-45',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown under pill */}
      <div
        className={cn(
          'mt-2 overflow-hidden rounded-[8px] border border-[var(--border-color)] bg-white/98 shadow-xl backdrop-blur-md transition-all duration-300 md:hidden',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
        )}
      >
        <nav className="flex flex-col p-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-[8px] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] transition-colors active:bg-[#1A1817]/5"
            >
              {t(item.key)}
            </a>
          ))}
          <div className="my-1 border-t border-[var(--border-color)]" />
          <div className="flex items-center gap-2 p-2">
            {['ru', 'kk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  'min-h-10 flex-1 rounded-[8px] text-xs font-bold',
                  lang === code
                    ? 'bg-[#1A1817] text-[#F8F7F4]'
                    : 'border border-[var(--border-color)] text-[var(--text-muted)]',
                )}
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
            className="m-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-[#1A1817] px-4 text-xs font-semibold uppercase tracking-wider text-[#F8F7F4]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            {t('nav.whatsapp')}
          </a>
        </nav>
      </div>
    </div>
  )
}
