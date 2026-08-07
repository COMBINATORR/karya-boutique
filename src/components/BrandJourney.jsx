import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ChapterTitle } from '@/components/ChapterTitle'

const STEPS = [
  {
    id: 'founding',
    yearKey: 'journey.s1Year',
    labelKey: 'journey.s1Label',
    dateKey: 'journey.s1Date',
    titleKey: 'journey.s1Title',
    descKey: 'journey.s1Desc',
    image: '/images/journey/01-founding.webp',
  },
  {
    id: 'modernization',
    yearKey: 'journey.s2Year',
    labelKey: 'journey.s2Label',
    dateKey: 'journey.s2Date',
    titleKey: 'journey.s2Date',
    descKey: 'journey.s2Desc',
    image: '/images/journey/02-modernization.webp',
  },
  {
    id: 'expansion',
    yearKey: 'journey.s3Year',
    labelKey: 'journey.s3Label',
    dateKey: 'journey.s3Date',
    titleKey: 'journey.s3Title',
    descKey: 'journey.s3Desc',
    image: '/images/journey/03-expansion.webp',
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
    image: '/images/journey/05-modern.webp',
  },
  {
    id: 'atyrau',
    yearKey: 'journey.s6Year',
    labelKey: 'journey.s6Label',
    dateKey: 'journey.s6Date',
    titleKey: 'journey.s6Title',
    descKey: 'journey.s6Desc',
    image: '/images/journey/06-boutique.webp',
  },
]

const IMG_V = 21

/**
 * Brand journey — sticky story stage; vertical scroll advances steps.
 * Header + story + timeline pinned seamlessly inside 100dvh.
 */
export function BrandJourney() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const [reduced, setReduced] = useState(false)
  const pinTrackRef = useRef(null)
  const timelineRef = useRef(null)
  const dragging = useRef(false)
  const programmatic = useRef(false)
  const activeRef = useRef(0)

  const n = STEPS.length
  const step = STEPS[active]
  const progress = n <= 1 ? 0 : active / (n - 1)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  const setStep = useCallback(
    (index, dirHint) => {
      const next = Math.max(0, Math.min(n - 1, index))
      if (next === activeRef.current) return
      setDirection(
        dirHint != null ? dirHint : next > activeRef.current ? 1 : -1,
      )
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

  const prev = useCallback(() => scrollToStep(active - 1), [active, scrollToStep])
  const next = useCallback(() => scrollToStep(active + 1), [active, scrollToStep])

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return
      const track = pinTrackRef.current
      if (track) {
        const r = track.getBoundingClientRect()
        if (r.bottom < 80 || r.top > window.innerHeight - 80) return
      }
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
      const el = timelineRef.current
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
    scrollToStep(indexFromClientX(e.clientX))
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    scrollToStep(indexFromClientX(e.clientX))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  const slideVariants = useMemo(
    () => ({
      enter: (dir) => ({ opacity: 0, x: dir > 0 ? 28 : -28, filter: 'blur(6px)' }),
      center: { opacity: 1, x: 0, filter: 'blur(0px)' },
      exit: (dir) => ({ opacity: 0, x: dir > 0 ? -28 : 28, filter: 'blur(6px)' }),
    }),
    [],
  )

  const sectionHeader = (
    <header className="mb-4 sm:mb-6">
      <ChapterTitle titleKey="chapter.details" tone="dark" />
      <span className="eyebrow mb-1 block text-[var(--accent-cognac-soft)] sm:mb-2">
        {t('journey.eyebrow')}
      </span>
      <h2 className="h2-editorial text-[clamp(1.65rem,4.5vw,3rem)] tracking-tight text-[var(--text-light)]">
        {t('journey.title')}
      </h2>
    </header>
  )

  const storyBlock = (
    <>
      <div className="grid items-start gap-4 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        <div className="lg:col-span-6 lg:pt-1 xl:col-span-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[7rem] flex-col sm:min-h-[8.5rem]"
            >
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-cognac-soft)] sm:text-xs">
                {t(step.yearKey)}
              </p>
              <h3 className="mt-1.5 font-display text-[clamp(1.35rem,3.5vw,1.85rem)] font-bold leading-[1.15] tracking-tight text-[var(--text-light)] sm:mt-2.5">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 max-w-xl text-[13px] leading-[1.55] text-[var(--text-light)]/65 sm:mt-3 sm:text-[14px] sm:leading-[1.65]">
                {t(step.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative hidden min-h-[220px] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-dark-elevated)] lg:col-span-6 lg:block lg:min-h-[280px] xl:min-h-[320px]">
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
                src={`${step.image}?v=${IMG_V}`}
                alt=""
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 lg:hidden sm:mt-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-dark-elevated)]">
          <AnimatePresence mode="wait">
            <motion.img
              key={step.image}
              src={`${step.image}?v=${IMG_V}`}
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

      {/* Timeline */}
      <div className="mt-4 border-t border-white/10 pt-4 sm:mt-6 sm:pt-6">
        <div className="relative mb-3 hidden sm:block">
          <div className="grid grid-cols-6 gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToStep(i)}
                className={[
                  'px-0.5 text-center font-display text-[9px] font-semibold uppercase leading-snug tracking-[0.08em] transition-colors duration-200 lg:text-[10px]',
                  i === active
                    ? 'text-[var(--text-light)]'
                    : 'text-[var(--text-light)]/35 hover:text-[var(--text-light)]/60',
                ].join(' ')}
              >
                {t(s.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={timelineRef}
          className="relative mx-0 h-8 cursor-pointer touch-none select-none px-2 sm:h-9 sm:px-1"
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
              e.key === 'Home' ? scrollToStep(0) : prev()
            }
            if (e.key === 'ArrowRight' || e.key === 'End') {
              e.preventDefault()
              e.key === 'End' ? scrollToStep(n - 1) : next()
            }
          }}
        >
          <div className="pointer-events-none absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-white/20 sm:left-1 sm:right-1" />
          <div
            className="pointer-events-none absolute left-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-white transition-[width] duration-300 ease-out sm:left-1"
            style={{ width: `calc((100% - 1rem) * ${progress})` }}
          />

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
                  scrollToStep(i)
                }}
                className="absolute top-1/2 z-[1] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-9 sm:w-9"
                style={{ left: `calc(0.5rem + (100% - 1rem) * ${left / 100})` }}
                aria-label={t(s.labelKey)}
                aria-current={on ? 'step' : undefined}
              >
                <span
                  className={[
                    'block rounded-full transition-all duration-300',
                    on
                      ? 'h-3 w-3 bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.14)] sm:h-3.5 sm:w-3.5'
                      : passed
                        ? 'h-2 w-2 bg-white sm:h-2.5 sm:w-2.5'
                        : 'h-2 w-2 border-2 border-white/35 bg-[var(--bg-dark)] sm:h-2.5 sm:w-2.5',
                  ].join(' ')}
                />
              </button>
            )
          })}

          <div
            className="pointer-events-none absolute top-1/2 z-[2] h-4 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-[left] duration-300 ease-out sm:h-[20px] sm:w-8"
            style={{ left: `calc(0.5rem + (100% - 1rem) * ${progress})` }}
            aria-hidden
          />
        </div>

        <div className="mt-3 hidden grid-cols-6 gap-1 sm:grid">
          {STEPS.map((s, i) => (
            <button
              key={`${s.id}-date`}
              type="button"
              onClick={() => scrollToStep(i)}
              className={[
                'text-center font-sans text-[10px] tabular-nums tracking-wide transition-colors duration-200 lg:text-[11px]',
                i === active
                  ? 'font-medium text-[var(--text-light)]/80'
                  : 'text-[var(--text-light)]/30 hover:text-[var(--text-light)]/50',
              ].join(' ')}
            >
              {t(s.dateKey)}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
          <div className="min-w-0 sm:hidden">
            <p className="truncate font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-light)]">
              {t(step.labelKey)}
            </p>
            <p className="mt-0.5 text-[11px] tabular-nums text-[var(--text-light)]/40">
              {t(step.dateKey)}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden font-sans text-[11px] tabular-nums tracking-wide text-[var(--text-light)]/40 sm:inline">
              {active + 1}
              <span className="text-[var(--text-light)]/25"> / {n}</span>
            </span>
            <button
              type="button"
              onClick={prev}
              disabled={active === 0}
              className="karya-carousel-nav flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-white/15 text-[var(--text-light)] transition-colors hover:border-white/35 hover:bg-white/[0.06] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
              aria-label={t('journey.prev')}
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={active === n - 1}
              className="karya-carousel-nav flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-white/15 text-[var(--text-light)] transition-colors hover:border-white/35 hover:bg-white/[0.06] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
              aria-label={t('journey.next')}
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {!reduced ? (
          <p className="mt-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-light)]/30 sm:mt-4">
            {t('journey.scrollHint')}
          </p>
        ) : null}
      </div>
    </>
  )

  return (
    <section
      id="details"
      className="section-sheet surface-dark text-[var(--text-light)]"
      aria-roledescription="carousel"
      aria-label={t('journey.title')}
    >
      {reduced ? (
        <div className="container-wide section-pad">
          {sectionHeader}
          {storyBlock}
        </div>
      ) : (
        <div
          ref={pinTrackRef}
          className="relative"
          style={{ height: `${Math.max(260, 80 + n * 55)}vh` }}
        >
          <div
            className="sticky top-0 flex min-h-[100dvh] flex-col justify-center bg-[var(--bg-dark)] py-5 sm:py-7 lg:py-8"
            style={{
              paddingTop: 'max(1.25rem, var(--safe-top))',
              paddingBottom: 'max(1.25rem, var(--safe-bottom))',
            }}
          >
            <div className="container-wide">
              {sectionHeader}
              {storyBlock}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
