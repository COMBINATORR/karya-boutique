import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV } from '@/constants/nav'
import { BrandMark } from '@/components/BrandMark'
import { whatsappRequestUrl } from '@/constants/contact'

export function Header({ scrolled, onOpenMenu }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('kk') ? 'kk' : 'ru'

  const setLang = (next) => {
    i18n.changeLanguage(next)
    localStorage.setItem('karya-lang', next)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--border-color)] bg-white/92 backdrop-blur-md'
          : 'bg-white/75 backdrop-blur-sm',
      )}
      style={{
        paddingTop: 'var(--safe-top)',
      }}
    >
      <div
        className={cn(
          'container-wide flex items-center justify-between gap-3 transition-all duration-300',
          scrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4 lg:py-5',
        )}
      >
        <a href="#top" className="min-w-0 shrink-0">
          <BrandMark />
        </a>

        <nav
          className="hidden md:flex items-center gap-6 lg:gap-9"
          aria-label="Main navigation"
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link whitespace-nowrap">
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="lang-switch" role="group" aria-label="Language selector">
            {['ru', 'kk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={lang === code ? 'is-on' : ''}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={whatsappRequestUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="hidden lg:inline">{t('nav.whatsapp')}</span>
            <span className="lg:hidden">WA</span>
          </a>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 flex-col items-center justify-center border border-[var(--border-color)] bg-white/90 active:bg-white"
            onClick={onOpenMenu}
            aria-label={t('nav.openMenu')}
          >
            <span className="hamburger-bar w-5" />
            <span className="hamburger-bar mt-1.5 w-5" />
            <span className="hamburger-bar mt-1.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
