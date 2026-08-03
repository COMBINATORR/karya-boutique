import { useTranslation } from 'react-i18next'
import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from 'lucide-react'
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  MAPS_URL,
  MAPS_DIR_URL,
  TWOGIS_URL,
} from '@/constants/contact'
import { BoutiqueMap } from '@/components/BoutiqueMap'

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="location" className="section-pad bg-white">
      <div className="container-wide">
        {/* Equal-height columns on lg+ */}
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left — contacts (stretches to map card height) */}
          <div className="flex min-h-0 flex-col lg:col-span-5">
            <div className="min-w-0">
              <span className="eyebrow mb-2 block text-[10px] tracking-[0.18em] sm:mb-3 sm:text-xs sm:tracking-[0.2em]">
                {t('location.eyebrow')}
              </span>
              <h2 className="h2-editorial mb-4 text-[clamp(1.85rem,6vw,3.5rem)] sm:mb-6">
                {t('location.title')}
              </h2>
              <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:mb-8 sm:text-lg">
                {t('location.lead')}
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-8 border-t border-[var(--border-color)] pt-6 sm:pt-8">
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3.5 sm:gap-5">
                  <div className="mt-0.5 shrink-0 rounded-[8px] border border-[var(--border-color)] bg-[#F5F5F5] p-2.5 sm:p-3">
                    <MapPin className="h-5 w-5 text-[#8C5E3C]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-display font-bold uppercase tracking-widest text-[var(--text-muted)] sm:text-xs">
                      {t('location.addressLabel')}
                    </span>
                    <p className="text-base font-semibold leading-snug text-[var(--text-primary)] sm:text-lg">
                      {t('location.addressValue')}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {t('location.addressExtra')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-5">
                  <div className="mt-0.5 shrink-0 rounded-[8px] border border-[var(--border-color)] bg-[#F5F5F5] p-2.5 sm:p-3">
                    <Clock className="h-5 w-5 text-[#8C5E3C]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-display font-bold uppercase tracking-widest text-[var(--text-muted)] sm:text-xs">
                      {t('location.hoursLabel')}
                    </span>
                    <p className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                      {t('location.hoursValue')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-5">
                  <div className="mt-0.5 shrink-0 rounded-[8px] border border-[var(--border-color)] bg-[#F5F5F5] p-2.5 sm:p-3">
                    <Phone className="h-5 w-5 text-[#8C5E3C]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-display font-bold uppercase tracking-widest text-[var(--text-muted)] sm:text-xs">
                      {t('location.phoneLabel')}
                    </span>
                    <a
                      href={PHONE_TEL}
                      className="text-base font-semibold text-[var(--text-primary)] transition-colors active:text-[#8C5E3C] sm:text-lg"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>

              {/* One primary action for the section + one WhatsApp */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <a
                  href={MAPS_DIR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex-1 justify-center"
                >
                  <MapPin className="h-4 w-4" strokeWidth={1.8} />
                  <span>{t('location.routeBtn')}</span>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-dark w-full flex-1 justify-center"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  <span>{t('location.whatsappLabel')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right — clean map + links below */}
          <div className="flex min-h-[320px] flex-col lg:col-span-7 lg:min-h-0">
            <div className="flex h-full min-h-[320px] flex-1 flex-col overflow-hidden rounded-[8px] border border-[var(--border-color)] bg-white lg:min-h-full">
              <div className="relative min-h-[240px] w-full flex-1">
                <BoutiqueMap title="KARYA" />
              </div>

              <div className="flex shrink-0 flex-col gap-2 border-t border-[var(--border-color)] bg-white p-3 sm:flex-row sm:gap-3 sm:p-3.5">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-light relative z-0 inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[8px] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors active:opacity-90"
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Google Maps
                  </span>
                </a>
                <a
                  href={TWOGIS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-light relative z-0 inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[8px] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors active:opacity-90"
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                    2GIS
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
