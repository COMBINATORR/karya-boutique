import { useTranslation } from 'react-i18next'
import { NAV } from '@/constants/nav'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '@/constants/contact'
import { BrandMark } from '@/components/BrandMark'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      className="border-t border-[var(--border-color)] bg-white py-10 text-[var(--text-primary)] sm:py-14"
      style={{ paddingBottom: 'max(2.5rem, calc(var(--safe-bottom) + 1.5rem))' }}
    >
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-[var(--border-color)] pb-8 sm:pb-10 md:flex-row md:items-center">
          <div className="min-w-0">
            <a href="#top" className="mb-3 inline-block">
              <BrandMark size="lg" />
            </a>
            <p className="max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
              {t('footer.tagline')}
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-8"
            aria-label="Footer navigation"
          >
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="text-sm">
            <a
              href={PHONE_TEL}
              className="mb-1 block min-h-11 font-semibold leading-[2.75rem] active:text-[#8C5E3C] sm:leading-normal sm:min-h-0"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-wider text-[#8C5E3C] underline-offset-2 active:underline sm:min-h-0"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-xs text-[var(--text-muted)] font-mono sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
          <p>
            © {new Date().getFullYear()} KARYA. {t('footer.rights')}
          </p>
          <p className="text-[10px] uppercase tracking-widest">{t('footer.city')}</p>
        </div>
      </div>
    </footer>
  )
}
