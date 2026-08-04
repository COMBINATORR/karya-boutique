import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useDragControls,
  animate,
} from 'framer-motion'
import { ChevronDown, MessageCircle, MapPin } from 'lucide-react'
import { whatsappRequestUrl, MAPS_DIR_URL } from '@/constants/contact'
import BlurText from '@/components/BlurText'

/** Boutique leather palette chips (visual only — full range in store) */
const PALETTE = [
  { id: 'cognac', hex: '#8C5E3C', labelKey: 'categories.swatchCognac' },
  { id: 'black', hex: '#1A1817', labelKey: 'categories.swatchBlack' },
  { id: 'cream', hex: '#E8DFD4', labelKey: 'categories.swatchCream' },
  { id: 'burgundy', hex: '#5C2E2E', labelKey: 'categories.swatchBurgundy' },
]

const HIGHLIGHT_KEYS = [
  'categories.tagLeather',
  'categories.tagFloater',
  'categories.tagPatent',
  'categories.tagPalette',
  'categories.tagHardware',
  'categories.tagDaily',
]

function ModalAccordion({ items }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="mt-6 border-t border-[var(--border-color)]">
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id} className="border-b border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {item.title}
              </span>
              <ChevronDown
                className={[
                  'h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-250',
                  isOpen ? 'rotate-180' : '',
                ].join(' ')}
                strokeWidth={1.6}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.body}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Photos:
 *   public/images/assortment/{women|men}/c1.webp          — main
 *   public/images/assortment/{women|men}/c1-hover.webp    — hover (disabled)
 */
const CATEGORY_IDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10']

/** Cache-bust when catalog images are regenerated */
const PHOTO_V = 16

const PLACEHOLDER = {
  women: [
    'linear-gradient(145deg, #e8dfd4 0%, #c9b8a4 45%, #a68b72 100%)',
    'linear-gradient(145deg, #f0e8df 0%, #d4c4b0 50%, #b89a7e 100%)',
    'linear-gradient(145deg, #e5dcd0 0%, #c4b09a 48%, #9e8168 100%)',
    'linear-gradient(145deg, #ebe3d8 0%, #d0bfab 50%, #ad9178 100%)',
    'linear-gradient(145deg, #e2d8cc 0%, #bfab96 48%, #96785f 100%)',
    'linear-gradient(145deg, #efe7dc 0%, #d6c6b4 50%, #b0947a 100%)',
    'linear-gradient(145deg, #e6ddd2 0%, #cbb9a5 48%, #a68b70 100%)',
    'linear-gradient(145deg, #f2ebe3 0%, #d8c8b6 50%, #b89a7c 100%)',
    'linear-gradient(145deg, #e4dbcf 0%, #c2ae99 48%, #9a7d64 100%)',
    'linear-gradient(145deg, #ece4d9 0%, #d2c1ad 50%, #ae9278 100%)',
  ],
  men: [
    'linear-gradient(145deg, #2c2825 0%, #4a423c 45%, #6b5e54 100%)',
    'linear-gradient(145deg, #1f1c1a 0%, #3d3732 50%, #5c524a 100%)',
    'linear-gradient(145deg, #332e2a 0%, #4f4640 48%, #6e6258 100%)',
    'linear-gradient(145deg, #282420 0%, #453e38 50%, #64584e 100%)',
    'linear-gradient(145deg, #2a2623 0%, #483f39 48%, #675b50 100%)',
    'linear-gradient(145deg, #241f1c 0%, #3f3833 50%, #5e534a 100%)',
    'linear-gradient(145deg, #2e2925 0%, #4c443e 48%, #6d6056 100%)',
    'linear-gradient(145deg, #221e1b 0%, #3b3530 50%, #5a5048 100%)',
    'linear-gradient(145deg, #312c28 0%, #4e463f 48%, #6c5f55 100%)',
    'linear-gradient(145deg, #26221f 0%, #413a35 50%, #60564d 100%)',
  ],
}

function photoSrc(line, id) {
  return `/images/assortment/${line}/${id}.webp?v=${PHOTO_V}`
}

function CategoryPhoto({ line, id, index, alt, className = '' }) {
  const [mainFailed, setMainFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const bg = PLACEHOLDER[line][index % PLACEHOLDER[line].length]
  const key = `${line}-${id}`

  useEffect(() => {
    setMainFailed(false)
    setLoaded(false)
  }, [key])

  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden bg-white ${className}`}>
      {mainFailed ? (
        <div className="absolute inset-0" style={{ background: bg }} aria-hidden />
      ) : (
        <motion.img
          key={`${key}-main`}
          src={photoSrc(line, id)}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain will-change-transform"
          loading="lazy"
          draggable={false}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{
            opacity: loaded ? 1 : 0,
            scale: loaded ? 1 : 1.04,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onLoad={() => setLoaded(true)}
          onError={() => setMainFailed(true)}
        />
      )}
    </div>
  )
}

const cardEase = [0.22, 1, 0.36, 1]

const listVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: cardEase },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

function CategoryModal({ line, id, index, onClose }) {
  const { t } = useTranslation()
  const titleId = useId()
  const closeRef = useRef(null)
  const scrollRef = useRef(null)
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const sheetOpacity = useTransform(y, [0, 260], [1, 0.55])
  const [isMobile, setIsMobile] = useState(true)
  const [activeSwatch, setActiveSwatch] = useState(PALETTE[0].id)

  const lineLabel = line === 'women' ? t('categories.women') : t('categories.men')
  const title = t(`categories.${line}.${id}Title`)
  const sub = t(`categories.${line}.${id}Sub`)
  const desc = t(`categories.${line}.${id}Desc`)
  const count = t(`categories.${line}.${id}Count`)
  const waUrl = whatsappRequestUrl(`${lineLabel}: ${title}`)

  const activePalette = PALETTE.find((p) => p.id === activeSwatch) || PALETTE[0]

  const accordionItems = [
    {
      id: 'desc',
      title: t('categories.accDesc'),
      body: desc,
    },
    {
      id: 'details',
      title: t('categories.accDetails'),
      body: `${sub}. ${count}. ${t('categories.accDetailsBody')}`,
    },
    {
      id: 'visit',
      title: t('categories.accVisit'),
      body: t('categories.accVisitBody'),
    },
  ]

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    /*
      Do NOT use position:fixed on body — sticky hero reflows and the page
      appears to jump back to the main screen. Keep scrollY, block overflow +
      gestures, and force-restore if anything tries to move the window.
    */
    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0
    const html = document.documentElement
    const body = document.body
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    }

    body.classList.add('karya-modal-open')
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    body.style.touchAction = 'none'

    const allowInsideModal = (target) =>
      target instanceof Element && !!target.closest('[data-modal-root]')

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const onTouchMove = (e) => {
      if (allowInsideModal(e.target) && e.target.closest('[data-modal-scroll]')) return
      e.preventDefault()
    }
    const onWheel = (e) => {
      if (allowInsideModal(e.target) && e.target.closest('[data-modal-scroll]')) return
      e.preventDefault()
    }
    const onScroll = () => {
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY)
      }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true })
      window.scrollTo(0, scrollY)
    })

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      html.style.overscrollBehavior = prev.htmlOverscroll
      body.style.overscrollBehavior = prev.bodyOverscroll
      body.style.touchAction = prev.bodyTouchAction
      body.classList.remove('karya-modal-open')
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('touchmove', onTouchMove)
      window.scrollTo(0, scrollY)
    }
  }, [onClose])

  const closeWithSwipe = () => {
    animate(y, typeof window !== 'undefined' ? window.innerHeight : 600, {
      type: 'tween',
      duration: 0.22,
      ease: [0.32, 0.72, 0, 1],
    }).then(() => onClose())
  }

  const onDragEnd = (_e, info) => {
    const shouldClose = info.offset.y > 110 || info.velocity.y > 700
    if (shouldClose) {
      closeWithSwipe()
    } else {
      animate(y, 0, { type: 'spring', stiffness: 420, damping: 36 })
    }
  }

  const startDragIfAllowed = (e) => {
    if (!isMobile) return
    const scroller = scrollRef.current
    const fromHandle = e.target instanceof Element && e.target.closest('[data-drag-handle]')
    if (fromHandle || !scroller || scroller.scrollTop <= 2) {
      dragControls.start(e)
    }
  }

  const sheet = (
    <motion.div
      data-modal-root
      className="fixed inset-0 z-[100] flex items-stretch justify-center overscroll-none p-0 sm:items-center sm:p-5 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 hidden touch-none bg-[#1A1817]/50 backdrop-blur-[3px] sm:block"
        aria-label={t('categories.close')}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative z-10 flex w-full flex-col bg-white overscroll-contain touch-pan-y',
          'h-[100dvh] max-h-[100dvh] rounded-none',
          'sm:h-auto sm:max-h-[min(90dvh,860px)] sm:max-w-[920px] sm:flex-row sm:overflow-hidden sm:rounded-[var(--radius-lg)] sm:shadow-elevated sm:touch-auto',
          'lg:max-w-[980px]',
        ].join(' ')}
        style={isMobile ? { y, opacity: sheetOpacity } : undefined}
        initial={isMobile ? { opacity: 1, y: 40 } : { opacity: 0, y: 20, scale: 0.98 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={isMobile ? { opacity: 1, y: 80 } : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.55 }}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        {/* Drag handle — mobile */}
        <div
          data-drag-handle
          className="flex shrink-0 cursor-grab items-center justify-center pb-1 pt-[max(0.5rem,env(safe-area-inset-top))] active:cursor-grabbing sm:hidden"
          onPointerDown={(e) => {
            e.preventDefault()
            dragControls.start(e)
          }}
          aria-hidden
        >
          <span className="h-1 w-10 rounded-full bg-[var(--border-color)]" />
        </div>

        <div
          ref={scrollRef}
          data-modal-scroll
          className={[
            'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain',
            'sm:flex-row sm:overflow-hidden',
          ].join(' ')}
          onPointerDown={startDragIfAllowed}
        >
          {/* —— Photo (left) —— */}
          <div className="relative w-full shrink-0 bg-[var(--bg-muted)] sm:w-[48%] sm:self-stretch sm:p-5 lg:p-6">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={[
                'absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full',
                'border border-[var(--border-color)] bg-white/95 text-[var(--text-primary)] shadow-soft backdrop-blur-sm',
                'transition-colors hover:bg-white active:bg-[var(--bg-secondary)]',
                'sm:right-7 sm:top-7',
              ].join(' ')}
              aria-label={t('categories.close')}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            </button>
            <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-white sm:h-full sm:min-h-[420px] sm:rounded-[var(--radius-md)]">
              <CategoryPhoto
                line={line}
                id={id}
                index={index}
                alt={title}
                className="sm:absolute sm:inset-0 sm:aspect-auto sm:h-full"
              />
            </div>
          </div>

          {/* —— Content (right) —— */}
          <div
            className={[
              'flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5',
              'sm:min-h-0 sm:overflow-y-auto sm:overscroll-contain sm:px-8 sm:py-7 lg:px-10 lg:py-8',
            ].join(' ')}
          >
            <p className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {t('categories.modalEyebrow')} · {lineLabel}
            </p>

            <h3
              id={titleId}
              className="mt-2 font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-[2.15rem] lg:text-[2.35rem]"
            >
              {title}
            </h3>

            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-xs">
              {t('categories.metaLine')}
            </p>

            {/* Palette chips — like color swatches in reference */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2" role="list" aria-label={t('categories.paletteLabel')}>
                {PALETTE.map((sw) => {
                  const on = activeSwatch === sw.id
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      role="listitem"
                      onClick={() => setActiveSwatch(sw.id)}
                      className={[
                        'h-7 w-7 rounded-full border-2 transition-all',
                        on
                          ? 'border-[var(--bg-dark)] scale-110 shadow-soft'
                          : 'border-transparent ring-1 ring-black/10 hover:scale-105',
                      ].join(' ')}
                      style={{ backgroundColor: sw.hex }}
                      aria-label={t(sw.labelKey)}
                      aria-pressed={on}
                    />
                  )
                })}
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {t(activePalette.labelKey)}
                <span className="text-[var(--text-muted)]"> · {t('categories.paletteHint')}</span>
              </span>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-block mt-7"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.7} />
              {t('categories.request')}
            </a>

            <a
              href={MAPS_DIR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="btn-pill-outline btn-block mt-2.5"
            >
              <MapPin className="h-3.5 w-3.5 text-[var(--accent-cognac)]" strokeWidth={1.7} />
              {t('categories.visit')}
            </a>

            <div className="mt-8">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {t('categories.highlights')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {HIGHLIGHT_KEYS.map((key) => (
                  <span
                    key={key}
                    className="rounded-full border border-[var(--border-color)] bg-[var(--bg-muted)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>

            <ModalAccordion items={accordionItems} />

            <p className="mt-5 text-xs leading-relaxed text-[var(--text-muted)]">
              {t('categories.note')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(sheet, document.body)
}

export function Collections() {
  const { t } = useTranslation()
  const [line, setLine] = useState('women')
  const [openId, setOpenId] = useState(null)
  const scrollerRef = useRef(null)

  // Reset horizontal scroll when switching women/men
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTo({ left: 0, behavior: 'instant' in Element.prototype ? 'instant' : 'auto' })
    setOpenId(null)
  }, [line])

  const openIndex = openId ? CATEGORY_IDS.indexOf(openId) : -1

  return (
    <section
      id="categories"
      className="section-pad section-sheet surface-white pt-16 sm:pt-20"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow mb-3 block text-[10px] tracking-[0.18em] sm:mb-4 sm:text-xs sm:tracking-[0.2em]">
            {t('categories.eyebrow')}
          </span>
          <BlurText
            as="h2"
            text={t('categories.heading')}
            animateBy="words"
            direction="top"
            delay={60}
            stepDuration={0.28}
            threshold={0.2}
            rootMargin="0px 0px -8% 0px"
            className="h2-editorial justify-center text-[clamp(1.65rem,5.5vw,3.25rem)] tracking-tight normal-case"
          />
        </div>

        <div className="relative z-20 mt-8 flex justify-center sm:mt-10">
          <div
            className="inline-flex rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-muted)] p-1"
            role="group"
            aria-label={t('categories.filterLabel')}
          >
            {['women', 'men'].map((key) => {
              const on = line === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLine(key)}
                  className={[
                    'relative z-20 min-h-11 min-w-[7.5rem] touch-manipulation rounded-[6px] px-6 text-[11px] font-display font-bold uppercase tracking-[0.14em] transition-colors sm:min-w-[9rem] sm:px-8',
                    on
                      ? 'text-[var(--text-light)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {on ? (
                    <motion.span
                      layoutId="category-line-pill"
                      className="absolute inset-0 z-0 rounded-[6px] bg-[var(--bg-dark)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative z-[1]">
                    {key === 'women' ? t('categories.women') : t('categories.men')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`lead-${line}`}
            className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-6 sm:text-[15px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            {line === 'women' ? t('categories.womenLead') : t('categories.menLead')}
          </motion.p>
        </AnimatePresence>
      </div>

      {/*
        Mobile: horizontal scroll — large cards, ~20% of next card peeks.
        Desktop (md+): 5-column grid.
      */}
      <div className="mt-10 sm:mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={line}
            ref={scrollerRef}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={[
              // touch-pan-x alone blocks vertical page scroll when gesture starts on a card
              'karya-cat-scroller flex gap-4 overflow-x-auto overscroll-x-contain pb-3',
              'snap-x snap-mandatory',
              'scroll-pl-[max(1rem,var(--safe-left))] scroll-pr-[max(1rem,var(--safe-right))]',
              'px-[max(1rem,var(--safe-left))]',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'md:container-wide md:grid md:w-full md:grid-cols-5 md:gap-x-8 md:gap-y-12',
              'md:overflow-visible md:px-[max(2rem,var(--safe-left))] md:pb-0 md:snap-none',
              'lg:gap-x-10 lg:gap-y-14 xl:gap-x-12',
            ].join(' ')}
          >
            {CATEGORY_IDS.map((id, idx) => {
              const title = t(`categories.${line}.${id}Title`)
              return (
                <motion.button
                  key={`${line}-${id}`}
                  type="button"
                  variants={cardVariants}
                  whileTap={{ scale: 0.985 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Capture scroll before React re-render / focus quirks
                    const y =
                      window.scrollY ||
                      document.documentElement.scrollTop ||
                      0
                    setOpenId(id)
                    requestAnimationFrame(() => window.scrollTo(0, y))
                  }}
                  className={[
                    'group block snap-start text-center outline-none',
                    'w-[calc((100%-1rem)/1.2)] shrink-0 grow-0 basis-[calc((100%-1rem)/1.2)]',
                    'md:w-auto md:basis-auto md:shrink md:snap-align-none',
                    'cursor-pointer rounded-[var(--radius-sm)] focus-visible:shadow-[var(--shadow-focus)]',
                  ].join(' ')}
                >
                  <div className="overflow-hidden bg-white">
                    <motion.div
                      className="origin-center"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5, ease: cardEase }}
                    >
                      <CategoryPhoto line={line} id={id} index={idx} alt={title} />
                    </motion.div>
                  </div>
                  <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent-cognac)] sm:mt-4 sm:text-sm">
                    {title}
                  </p>
                </motion.button>
              )
            })}
            <div
              className="w-[max(0.5rem,var(--safe-right))] shrink-0 grow-0 basis-[max(0.5rem,var(--safe-right))] md:hidden"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container-wide">
        <p className="mx-auto mt-8 max-w-md text-center text-xs text-[var(--text-muted)] sm:mt-10 md:mt-12">
          {t('categories.note')}
        </p>
      </div>

      <AnimatePresence>
        {openId && openIndex >= 0 ? (
          <CategoryModal
            key={`${line}-${openId}`}
            line={line}
            id={openId}
            index={openIndex}
            onClose={() => setOpenId(null)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
