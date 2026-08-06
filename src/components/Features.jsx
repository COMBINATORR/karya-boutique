import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChapterTitle } from '@/components/ChapterTitle'

const INTERVAL_MS = 5500

const FEATURES = [
  {
    id: 'floater',
    titleKey: 'features.f1Title',
    descKey: 'features.f1Desc',
    cardTitleKey: 'features.f1CardTitle',
    points: ['features.f1p1', 'features.f1p2', 'features.f1p3'],
    tags: [
      { key: 'features.f1t1', tone: 'ok' },
      { key: 'features.f1t2', tone: 'soft' },
    ],
    image: '/images/features/01-floater.jpg',
  },
  {
    id: 'patent',
    titleKey: 'features.f2Title',
    descKey: 'features.f2Desc',
    cardTitleKey: 'features.f2CardTitle',
    points: ['features.f2p1', 'features.f2p2', 'features.f2p3'],
    tags: [
      { key: 'features.f2t1', tone: 'soft' },
      { key: 'features.f2t2', tone: 'ok' },
    ],
    image: '/images/features/02-patent.jpg',
  },
  {
    id: 'palette',
    titleKey: 'features.f3Title',
    descKey: 'features.f3Desc',
    cardTitleKey: 'features.f3CardTitle',
    points: ['features.f3p1', 'features.f3p2', 'features.f3p3'],
    tags: [
      { key: 'features.f3t1', tone: 'soft' },
      { key: 'features.f3t2', tone: 'ok' },
    ],
    image: '/images/features/03-palette.jpg',
  },
  {
    id: 'craft',
    titleKey: 'features.f4Title',
    descKey: 'features.f4Desc',
    cardTitleKey: 'features.f4CardTitle',
    points: ['features.f4p1', 'features.f4p2', 'features.f4p3'],
    tags: [
      { key: 'features.f4t1', tone: 'ok' },
      { key: 'features.f4t2', tone: 'soft' },
    ],
    image: '/images/features/04-hardware.jpg',
  },
]

/**
 * Features — two-column: interactive list + auto carousel with glass overlay.
 */
export function Features() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = FEATURES.length
  const feature = FEATURES[active]

  const goTo = useCallback(
    (i) => {
      setActive(((i % n) + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (paused) return undefined
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [n, paused])

  return (
    <section
      id="features"
      className="section-pad section-sheet surface-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ChapterTitle titleKey="chapter.features" />
      <div className="container-wide">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-3 block">{t('features.eyebrow')}</span>
            <h2 className="h2-editorial mb-4 text-[clamp(1.85rem,5vw,3.25rem)] tracking-tight">
              {t('features.title')}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              {t('features.lead')}
            </p>

            <ul className="mt-8 space-y-1.5 sm:mt-10" role="tablist" aria-label={t('features.listLabel')}>
              {FEATURES.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => goTo(i)}
                      className={[
                        'relative flex w-full items-center rounded-[var(--radius-sm)] px-4 py-3.5 text-left transition-all duration-300',
                        on
                          ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] shadow-soft'
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]/60 hover:text-[var(--text-primary)]',
                      ].join(' ')}
                    >
                      {on ? (
                        <motion.span
                          layoutId="features-glass-pill"
                          className="absolute inset-0 rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-white/70 shadow-soft backdrop-blur-md"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      <span className="relative z-[1] font-display text-sm font-semibold tracking-tight sm:text-[15px]">
                        {t(item.titleKey)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-muted)] shadow-soft sm:aspect-[5/4] lg:min-h-[420px] lg:aspect-auto lg:h-[min(520px,58vh)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={feature.image}
                  src={`${feature.image}?v=2`}
                  alt=""
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Soft vignette only — keep photo bright under glass plaque */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 sm:bg-gradient-to-tr sm:from-black/20 sm:via-transparent sm:to-black/8" />

              <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-auto sm:left-6 sm:right-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-[min(100%-3rem,320px)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="karya-feature-glass p-4 sm:p-6"
                  >
                    <p className="karya-feature-glass__title mb-3 font-display text-sm font-bold tracking-tight sm:mb-4 sm:text-base">
                      {t(feature.cardTitleKey)}
                    </p>

                    <ul className="space-y-2.5 sm:space-y-3">
                      {feature.points.map((pk, idx) => (
                        <li key={pk} className="flex items-start justify-between gap-3">
                          <span className="karya-feature-glass__point text-[13px] leading-snug sm:text-sm">
                            {t(pk)}
                          </span>
                          {feature.tags[idx] ? (
                            <span
                              className={[
                                'karya-feature-glass__tag shrink-0 rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                feature.tags[idx].tone === 'ok'
                                  ? 'karya-feature-glass__tag--accent'
                                  : '',
                              ].join(' ')}
                            >
                              {t(feature.tags[idx].key)}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    <p className="karya-feature-glass__desc mt-3 border-t pt-2.5 text-[11px] leading-relaxed sm:mt-4 sm:pt-3 sm:text-xs">
                      {t(feature.descKey)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute right-4 top-4 z-[1] flex gap-1.5 sm:right-5 sm:top-5">
                {FEATURES.map((f, i) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300',
                      i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70',
                    ].join(' ')}
                    aria-label={t(f.titleKey)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
