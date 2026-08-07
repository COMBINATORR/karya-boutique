import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
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
 * Features — scroll-driven sticky section.
 * Integrated header + interactive feature stage pinned inside 100dvh.
 */
export function Features() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false)
  const pinTrackRef = useRef(null)
  const programmatic = useRef(false)
  const activeRef = useRef(0)
  const n = FEATURES.length
  const feature = FEATURES[active]

  useEffect(() => {
    activeRef.current = active
  }, [active])

  /* Detect prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  /* Auto-play timer — only when reduced-motion (fallback) */
  useEffect(() => {
    if (!reduced || paused) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [n, reduced, paused])

  const setStep = useCallback(
    (index) => {
      const next = Math.max(0, Math.min(n - 1, index))
      if (next === activeRef.current) return
      setActive(next)
    },
    [n],
  )

  /** Scroll page so pin-track progress matches step index */
  const scrollToStep = useCallback(
    (index) => {
      const track = pinTrackRef.current
      if (!track || reduced) {
        setStep(index)
        return
      }
      const next = Math.max(0, Math.min(n - 1, index))
      const rect = track.getBoundingClientRect()
      const trackTop = window.scrollY + rect.top
      const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight)
      const p = n <= 1 ? 0 : next / (n - 1)
      programmatic.current = true
      setStep(next)
      window.scrollTo({ top: trackTop + p * maxScroll, behavior: 'smooth' })
      window.setTimeout(() => {
        programmatic.current = false
      }, 700)
    },
    [n, reduced, setStep],
  )

  /* Scroll-driven step switching */
  const { scrollYProgress } = useScroll({
    target: pinTrackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduced || programmatic.current) return
    if (n <= 1) return
    const raw = p * (n - 1)
    const idx = Math.round(raw)
    const clamped = Math.max(0, Math.min(n - 1, idx))
    if (clamped !== activeRef.current) {
      setStep(clamped)
    }
  })

  const goTo = useCallback(
    (i) => {
      if (reduced) {
        setActive(((i % n) + n) % n)
      } else {
        scrollToStep(i)
      }
    },
    [n, reduced, scrollToStep],
  )

  const sectionHeader = (
    <header className="mb-4 sm:mb-6 max-w-2xl">
      <ChapterTitle titleKey="chapter.features" />
      <span className="eyebrow mb-1 block">{t('features.eyebrow')}</span>
      <h2 className="h2-editorial mb-2 text-[clamp(1.65rem,4.5vw,3rem)] tracking-tight">
        {t('features.title')}
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        {t('features.lead')}
      </p>
    </header>
  )

  const contentBlock = (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        {/* Left: tab list */}
        <div className="lg:col-span-5">
          <ul className="space-y-1 sm:space-y-1.5" role="tablist" aria-label={t('features.listLabel')}>
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
                      'relative flex w-full items-center rounded-[var(--radius-sm)] px-3.5 py-2.5 sm:px-4 sm:py-3 text-left transition-all duration-300',
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

        {/* Right: image + glass card */}
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/3] max-h-[220px] sm:max-h-none overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-muted)] shadow-soft sm:aspect-[5/4] lg:min-h-[380px] lg:aspect-auto lg:h-[min(480px,52vh)]">
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

            {/* Soft vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 sm:bg-gradient-to-tr sm:from-black/20 sm:via-transparent sm:to-black/8" />

            {/* Glass card overlay */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-auto sm:left-6 sm:right-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-[min(100%-3rem,320px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="karya-feature-glass p-3.5 sm:p-5"
                >
                  <p className="karya-feature-glass__title mb-2.5 font-display text-sm font-bold tracking-tight sm:mb-3 sm:text-base">
                    {t(feature.cardTitleKey)}
                  </p>

                  <ul className="space-y-2 sm:space-y-2.5">
                    {feature.points.map((pk, idx) => (
                      <li key={pk} className="flex items-start justify-between gap-3">
                        <span className="karya-feature-glass__point text-[12.5px] leading-snug sm:text-sm">
                          {t(pk)}
                        </span>
                        {feature.tags[idx] ? (
                          <span
                            className={[
                              'karya-feature-glass__tag shrink-0 rounded-[var(--radius-sm)] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide',
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

                  <p className="karya-feature-glass__desc mt-2.5 border-t pt-2 text-[11px] leading-relaxed sm:mt-3 sm:pt-2.5 sm:text-xs">
                    {t(feature.descKey)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
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

      {/* Scroll hint — only when scroll-driven */}
      {!reduced ? (
        <p className="mt-4 text-center font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]/40 sm:mt-6">
          {t('features.scrollHint')}
        </p>
      ) : null}
    </>
  )

  return (
    <section
      id="features"
      className="section-sheet surface-white"
      onMouseEnter={reduced ? () => setPaused(true) : undefined}
      onMouseLeave={reduced ? () => setPaused(false) : undefined}
    >
      {/* Scroll-driven layout (or auto-play fallback) */}
      {reduced ? (
        <div className="container-wide section-pad">
          {sectionHeader}
          {contentBlock}
        </div>
      ) : (
        <div
          ref={pinTrackRef}
          className="relative"
          style={{ height: `${Math.max(250, 80 + n * 55)}vh` }}
        >
          <div
            className="sticky top-0 flex min-h-[100dvh] flex-col justify-center bg-[var(--bg-primary)] py-5 sm:py-7 lg:py-8"
            style={{
              paddingTop: 'max(1.25rem, var(--safe-top))',
              paddingBottom: 'max(1.25rem, var(--safe-bottom))',
            }}
          >
            <div className="container-wide">
              {sectionHeader}
              {contentBlock}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
