import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ExternalLink, MapPin, MessageCircle } from 'lucide-react'
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  MAPS_URL,
  MAPS_DIR_URL,
  TWOGIS_URL,
} from '@/constants/contact'
import { InstagramIcon } from '@/components/InstagramIcon'
import { BoutiqueMap } from '@/components/BoutiqueMap'
import { ChapterTitle } from '@/components/ChapterTitle'

const SLIDES = [
  '/images/contact/01.webp',
  '/images/contact/02.webp',
  '/images/contact/03.webp',
  '/images/contact/04.webp',
  '/images/contact/05.webp',
  '/images/contact/06.webp',
]

/** Bump when gallery assets change */
const SLIDE_V = 2

const SLIDE_MS = 5500

function PhotoCarousel() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const n = SLIDES.length

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [n])

  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-muted)] shadow-soft sm:min-h-[360px] lg:min-h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={SLIDES[index]}
          src={`${SLIDES[index]}?v=${SLIDE_V}`}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </AnimatePresence>

      {/* Soft gradient for dots readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

      {/* Dots */}
      <div
        className="absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2"
        role="tablist"
        aria-label={t('location.galleryLabel')}
      >
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={[
              'h-1.5 rounded-full transition-all duration-300',
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75',
            ].join(' ')}
            aria-label={`${i + 1} / ${n}`}
          />
        ))}
      </div>
    </div>
  )
}

export function Contact() {
  const { t } = useTranslation()

  return (
    <>
      {/* —— Contact + photo —— */}
      <section id="location" className="section-pad section-sheet surface-white">
        <ChapterTitle titleKey="chapter.location" />
        <div className="container-wide">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Left */}
            <div className="flex flex-col lg:col-span-5">
              <span className="eyebrow mb-2 block text-[10px] tracking-[0.18em] sm:mb-3 sm:text-xs sm:tracking-[0.2em]">
                {t('location.eyebrow')}
              </span>
              <h2 className="h2-editorial mb-4 text-[clamp(1.85rem,5.5vw,3.35rem)] leading-[1.08] tracking-tight sm:mb-5">
                {t('location.titleLine1')}
                <br className="hidden min-[400px]:block" />{' '}
                {t('location.titleLine2')}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                {t('location.lead')}
              </p>

              {/* Address + phone once */}
              <div className="mt-10 grid gap-8 border-t border-[var(--border-color)] pt-8 sm:mt-12 sm:grid-cols-2 sm:gap-6 sm:pt-10">
                <div>
                  <p className="mb-2 text-[10px] font-display font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {t('location.addressLabel')}
                  </p>
                  <p className="text-[15px] font-medium leading-snug text-[var(--text-primary)] sm:text-base">
                    {t('location.addressValue')}
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                    {t('location.addressExtra')}
                  </p>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {t('location.hoursValue')}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-display font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {t('location.phoneLabel')}
                  </p>
                  <a
                    href={PHONE_TEL}
                    className="text-[15px] font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cognac)] sm:text-base"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  <p className="mt-4 mb-2 text-[10px] font-display font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Instagram
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cognac)] sm:text-base"
                  >
                    <InstagramIcon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                    {INSTAGRAM_HANDLE}
                  </a>
                </div>
              </div>

              {/* Square 8px CTAs — match site utility language */}
              <div className="mt-10 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:pt-10">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-dark btn-block sm:flex-1"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.7} />
                  {t('location.ctaVisit')}
                </a>
                <a href="#map" className="btn-outline btn-block sm:flex-1">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.7} />
                  {t('location.ctaMap')}
                </a>
              </div>
            </div>

            {/* Right — rotating photos */}
            <div className="min-h-[300px] lg:col-span-7 lg:min-h-[480px]">
              <PhotoCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* —— Map separate block —— */}
      <section id="map" className="surface-muted pb-16 pt-4 sm:pb-20 sm:pt-6 lg:pb-24">
        <div className="container-wide">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow mb-2 block">{t('location.mapBadge')}</span>
              <h3 className="h2-editorial text-2xl sm:text-3xl">{t('location.mapTitle')}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {t('location.mapSubtitle')}
              </p>
            </div>
            <a
              href={MAPS_DIR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-dark shrink-0"
            >
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} />
              {t('location.routeBtn')}
            </a>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-white shadow-soft">
            {/* Explicit height required — Leaflet cannot size with min-height alone */}
            <div className="relative h-[300px] w-full sm:h-[380px] lg:h-[440px]">
              <BoutiqueMap title="KARYA" />
            </div>
            <div className="flex flex-col gap-2 border-t border-[var(--border-color)] p-3 sm:flex-row sm:gap-3 sm:p-3.5">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-block flex-1"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                Google Maps
              </a>
              <a
                href={TWOGIS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-block flex-1"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                2GIS
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
