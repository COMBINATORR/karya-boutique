import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    id: 'founding',
    yearKey: 'journey.s1Year',
    labelKey: 'journey.s1Label',
    dateKey: 'journey.s1Date',
    titleKey: 'journey.s1Title',
    descKey: 'journey.s1Desc',
    image: '/images/journey/01-founding.jpg',
  },
  {
    id: 'modernization',
    yearKey: 'journey.s2Year',
    labelKey: 'journey.s2Label',
    dateKey: 'journey.s2Date',
    titleKey: 'journey.s2Title',
    descKey: 'journey.s2Desc',
    image: '/images/journey/02-modernization.jpg',
  },
  {
    id: 'expansion',
    yearKey: 'journey.s3Year',
    labelKey: 'journey.s3Label',
    dateKey: 'journey.s3Date',
    titleKey: 'journey.s3Title',
    descKey: 'journey.s3Desc',
    image: '/images/journey/03-expansion.jpg',
  },
  {
    id: 'materials',
    yearKey: 'journey.s4Year',
    labelKey: 'journey.s4Label',
    dateKey: 'journey.s4Date',
    titleKey: 'journey.s4Title',
    descKey: 'journey.s4Desc',
    image: '/images/journey/04-materials.jpg',
  },
  {
    id: 'modern',
    yearKey: 'journey.s5Year',
    labelKey: 'journey.s5Label',
    dateKey: 'journey.s5Date',
    titleKey: 'journey.s5Title',
    descKey: 'journey.s5Desc',
    image: '/images/journey/05-modern.jpg',
  },
  {
    id: 'atyrau',
    yearKey: 'journey.s6Year',
    labelKey: 'journey.s6Label',
    dateKey: 'journey.s6Date',
    titleKey: 'journey.s6Title',
    descKey: 'journey.s6Desc',
    image: '/images/journey/06-boutique.jpg',
  },
]

/**
 * Interactive brand journey — timeline + story card + photo
 * Layout inspired by progressive timeline UI (screenshot reference).
 */
export function BrandJourney() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const trackRef = useRef(null)
  const dragging = useRef(false)
  const touchStart = useRef({ x: 0, y: 0 })

  const n = STEPS.length
  const step = STEPS[active]
  const progress = n <= 1 ? 0 : active / (n - 1)

  const goTo = useCallback(
    (index) => {
      const next = Math.max(0, Math.min(n - 1, index))
      if (next === active) return
      setDirection(next > active ? 1 : -1)
      setActive(next)
    },
    [active, n],
  )

  const prev = useCallback(() => goTo(active - 1), [active, goTo])
  const next = useCallback(() => goTo(active + 1), [active, goTo])

  // Keyboard when section is in view / focused
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const indexFromClientX = useCallback(
    (clientX) => {
      const el = trackRef.current
      if (!el) return active
      const rect = el.getBoundingClientRect()
      const pad = 12
      const w = Math.max(1, rect.width - pad * 2)
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left - pad) / w))
      return Math.round(ratio * (n - 1))
    },
    [active, n],
  )

  const onPointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    goTo(indexFromClientX(e.clientX))
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    goTo(indexFromClientX(e.clientX))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  // Horizontal swipe on story card
  const onTouchStart = (e) => {
    const t0 = e.touches[0]
    touchStart.current = { x: t0.clientX, y: t0.clientY }
  }
  const onTouchEnd = (e) => {
    const t0 = e.changedTouches[0]
    const dx = t0.clientX - touchStart.current.x
    const dy = t0.clientY - touchStart.current.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx < 0) next()
    else prev()
  }

  const slideVariants = useMemo(
    () => ({
      enter: (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32, filter: 'blur(8px)' }),
      center: { opacity: 1, x: 0, filter: 'blur(0px)' },
      exit: (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32, filter: 'blur(8px)' }),
    }),
    [],
  )

  return (
    <section
      id="details"
      className="section-sheet surface-dark section-pad text-[var(--text-light)]"
      aria-roledescription="carousel"
      aria-label={t('journey.title')}
    >
      <div className="container-wide">
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <span className="eyebrow mb-2 block text-[var(--accent-cognac-soft)]">
            {t('journey.eyebrow')}
          </span>
          <h2 className="font-display text-[clamp(1.75rem,5.5vw,3.25rem)] font-bold tracking-tight text-[var(--text-light)]">
            {t('journey.title')}
          </h2>
        </header>

        {/* Story + photo panel — no outer frame */}
        <div
          className="relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-8">
            <div className="relative flex min-h-[220px] flex-col justify-between sm:min-h-[260px] lg:min-h-[320px] lg:py-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[200px] flex-1 flex-col sm:min-h-[230px]"
                >
                  <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-cognac-soft)] sm:text-sm">
                    {t(step.yearKey)}
                  </p>
                  <div className="mt-auto pt-10 sm:pt-14">
                    <h3 className="font-display text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.05rem]">
                      {t(step.titleKey)}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:mt-4 sm:text-[0.95rem] sm:leading-[1.65]">
                      {t(step.descKey)}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop photo */}
            <div className="relative hidden min-h-[300px] overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-dark-elevated)] lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.image}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={`${step.image}?v=17`}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile photo */}
          <div className="mt-6 lg:hidden">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-dark-elevated)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={step.image}
                  src={`${step.image}?v=17`}
                  alt=""
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          {/* Labels above track (desktop / tablet) */}
          <div className="relative mb-4 hidden px-1 sm:block sm:px-2">
            <div className="flex justify-between">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={[
                    'max-w-[5.2rem] text-left text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 lg:max-w-[6.5rem] lg:text-[11px]',
                    i === active
                      ? 'text-white'
                      : 'text-white/30 hover:text-white/55',
                  ].join(' ')}
                >
                  {t(s.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Track */}
          <div
            ref={trackRef}
            className="relative mx-0 h-10 cursor-pointer touch-none select-none px-3 sm:mx-1 sm:px-2"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={active}
            aria-valuetext={`${t(step.labelKey)} — ${t(step.dateKey)}`}
            aria-label={t('journey.timelineLabel')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'Home') {
                e.preventDefault()
                e.key === 'Home' ? goTo(0) : prev()
              }
              if (e.key === 'ArrowRight' || e.key === 'End') {
                e.preventDefault()
                e.key === 'End' ? goTo(n - 1) : next()
              }
            }}
          >
            {/* Base line */}
            <div className="pointer-events-none absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/15 sm:left-2 sm:right-2" />
            {/* Progress line */}
            <div
              className="pointer-events-none absolute left-3 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white transition-[width] duration-300 ease-out sm:left-2"
              style={{
                width: `calc((100% - 1.5rem) * ${progress})`,
              }}
            />

            {/* Dots */}
            {STEPS.map((s, i) => {
              const left = n <= 1 ? 0 : (i / (n - 1)) * 100
              const on = i === active
              const passed = i <= active
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(i)
                  }}
                  className="absolute top-1/2 z-[1] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${left / 100})` }}
                  aria-label={t(s.labelKey)}
                  aria-current={on ? 'step' : undefined}
                >
                  <span
                    className={[
                      'block rounded-full transition-all duration-300',
                      on
                        ? 'h-3.5 w-3.5 bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.14)]'
                        : passed
                          ? 'h-2.5 w-2.5 bg-white'
                          : 'h-2.5 w-2.5 border-2 border-white/35 bg-[var(--bg-dark)]',
                    ].join(' ')}
                  />
                </button>
              )
            })}

            <div
              className="pointer-events-none absolute top-1/2 z-[2] h-5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-[left] duration-300 ease-out sm:h-[22px] sm:w-9"
              style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${progress})` }}
              aria-hidden
            />

            <div
              className="pointer-events-none absolute top-[calc(50%+18px)] z-[2] -translate-x-1/2 transition-[left] duration-300 ease-out"
              style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${progress})` }}
            >
              <span className="whitespace-nowrap rounded-full border border-white/25 bg-[var(--bg-dark)] px-2.5 py-0.5 text-[10px] font-medium text-white/95">
                {t(step.dateKey)}
              </span>
            </div>
          </div>

          {/* Static date row (desktop) */}
          <div className="mt-9 hidden justify-between px-1 sm:flex sm:px-2">
            {STEPS.map((s, i) => (
              <button
                key={`${s.id}-date`}
                type="button"
                onClick={() => goTo(i)}
                className={[
                  'text-[10px] transition-colors duration-200 lg:text-[11px]',
                  i === active ? 'text-white/75' : 'text-white/25 hover:text-white/45',
                ].join(' ')}
              >
                {t(s.dateKey)}
              </button>
            ))}
          </div>

          {/* Mobile label + nav buttons */}
          <div className="mt-10 flex items-center justify-between gap-3 sm:mt-7">
            <div className="min-w-0 sm:hidden">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-white">
                {t(step.labelKey)}
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">{t(step.dateKey)}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="mr-1 hidden text-[11px] tabular-nums text-white/35 sm:inline">
                {active + 1} / {n}
              </span>
              <button
                type="button"
                onClick={prev}
                disabled={active === 0}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-white/15 text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t('journey.prev')}
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={active === n - 1}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-white/15 text-white transition-colors hover:border-white/35 hover:bg-white/[0.06] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t('journey.next')}
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
