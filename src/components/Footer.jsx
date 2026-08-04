import { useTranslation } from 'react-i18next'
import { NAV } from '@/constants/nav'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact'
import { BrandMark } from '@/components/BrandMark'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-[var(--border-color)] bg-white text-[var(--text-primary)]"
      style={{
        paddingTop: 'clamp(2.5rem, 5vw, 3.5rem)',
        paddingBottom: 'max(2rem, calc(var(--safe-bottom) + 1.25rem))',
      }}
    >
      <div className="container-wide">
        {/* Main grid */}
        <div className="grid gap-10 border-b border-[var(--border-color)] pb-10 sm:gap-12 sm:pb-12 lg:grid-cols-12 lg:items-start lg:gap-10 lg:pb-14">
          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-5">
            <a
              href="#top"
              className="inline-block outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#1A1817]/25 focus-visible:ring-offset-2"
            >
              <BrandMark size="lg" />
            </a>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[var(--text-secondary)] sm:mt-5 sm:text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <nav
            className="lg:col-span-4"
            aria-label="Footer navigation"
          >
            <p className="mb-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-left">
              {t('footer.navLabel')}
            </p>
            <ul className="mx-auto grid max-w-xs grid-cols-2 gap-x-4 gap-y-1 sm:mx-0 sm:max-w-none sm:gap-x-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center justify-center rounded-[8px] px-2 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:bg-[#F5F5F5] hover:text-[var(--text-primary)] active:bg-[#EFEFEF] sm:justify-start sm:px-0 sm:hover:bg-transparent"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left lg:col-span-3 lg:items-end lg:text-right">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {t('footer.contactLabel')}
            </p>
            <a
              href={PHONE_TEL}
              className="min-h-11 text-base font-semibold leading-[2.75rem] text-[var(--text-primary)] transition-colors hover:text-[#8C5E3C] active:text-[#8C5E3C] sm:min-h-0 sm:leading-snug sm:text-lg"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href="#location"
              className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[#8C5E3C]"
            >
              {t('footer.toContacts')}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-2 pt-6 text-center sm:flex-row sm:justify-between sm:gap-4 sm:pt-8 sm:text-left">
          <p className="text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-xs">
            © {year} KARYA. {t('footer.rights')}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {t('footer.city')}
          </p>
        </div>
      </div>
    </footer>
  )
}
