import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, MessageCircle } from 'lucide-react'
import { NAV } from '@/constants/nav'
import { whatsappRequestUrl } from '@/constants/contact'
import { cn } from '@/lib/utils'

export function MobileMenu({ open, onClose }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] flex flex-col bg-[#1A1817]/96 backdrop-blur-md transition-all duration-500 md:hidden',
        open ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
      )}
      style={{
        paddingTop: 'var(--safe-top)',
        paddingBottom: 'var(--safe-bottom)',
        paddingLeft: 'var(--safe-left)',
        paddingRight: 'var(--safe-right)',
      }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-4 py-4 min-[400px]:px-6 sm:px-8 sm:py-5">
        <a href="#top" onClick={onClose} className="inline-flex flex-col leading-none">
          <span className="font-display text-xl font-black tracking-[-0.03em] uppercase min-[400px]:text-2xl">
            <span className="text-[#F8F7F4]">KAR</span>
            <span className="text-[#C8102E]">YA</span>
          </span>
          <span className="mt-px text-[8px] font-medium uppercase tracking-[0.2em] text-[#9E6B4C]">
            since 1980
          </span>
        </a>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 w-12 items-center justify-center border border-[#F8F7F4]/25 text-[#F8F7F4] transition-colors active:bg-[#F8F7F4]/10"
          aria-label={t('nav.closeMenu')}
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-stretch justify-center gap-0.5 overflow-y-auto overscroll-contain px-4 min-[400px]:px-6 sm:px-10">
        {NAV.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'py-2.5 font-display text-[clamp(1.75rem,8vw,3rem)] font-bold uppercase tracking-tight text-[#F8F7F4] transition-all duration-500 active:text-[#C8102E]',
              open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
            )}
            style={{ transitionDelay: open ? `${i * 80 + 100}ms` : '0ms' }}
          >
            {t(item.key)}
          </a>
        ))}

        <a
          href={whatsappRequestUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={cn(
            'mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2.5 border border-[#F8F7F4]/35 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F7F4] transition-all duration-500 active:bg-[#F8F7F4]/10',
            open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
          )}
          style={{ transitionDelay: open ? `${NAV.length * 80 + 100}ms` : '0ms' }}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
          <span>{t('nav.whatsapp')}</span>
        </a>
      </nav>

      <div
        className={cn(
          'px-4 pb-6 text-xs text-[#F8F7F4]/40 transition-all duration-500 min-[400px]:px-6 sm:px-10',
          open ? 'opacity-100' : 'opacity-0',
        )}
        style={{ transitionDelay: open ? '450ms' : '0ms' }}
      >
        <p className="font-medium leading-snug text-[#F8F7F4]/70">{t('location.addressValue')}</p>
        <p className="mt-1">{t('location.hoursValue')}</p>
      </div>
    </div>
  )
}
