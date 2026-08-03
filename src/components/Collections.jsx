import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useDragControls,
  animate,
} from 'framer-motion'
import { whatsappRequestUrl, MAPS_DIR_URL } from '@/constants/contact'
import BlurText from '@/components/BlurText'

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
  const bg = PLACEHOLDER[line][index % PLACEHOLDER[line].length]
  const key = `${line}-${id}`

  useEffect(() => {
    setMainFailed(false)
  }, [key])

  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden bg-white ${className}`}>
      {mainFailed ? (
        <div className="absolute inset-0" style={{ background: bg }} aria-hidden />
      ) : (
        <img
          key={`${key}-main`}
          src={photoSrc(line, id)}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          draggable={false}
          onError={() => setMainFailed(true)}
        />
      )}
    </div>
  )
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

  const lineLabel = line === 'women' ? t('categories.women') : t('categories.men')
  const title = t(`categories.${id}Title`)
  const sub = t(`categories.${id}Sub`)
  const desc = t(`categories.${id}Desc`)
  const waUrl = whatsappRequestUrl(`${lineLabel}: ${title}`)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // iOS/Android: overflow:hidden alone still scrolls the page behind modals.
    // Lock with position:fixed + restore scrollY on close.
    const scrollY = window.scrollY || window.pageYOffset || 0
    const html = document.documentElement
    const body = document.body
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    }
    const scrollbarGap = window.innerWidth - html.clientWidth

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`
    body.dataset.modalScrollY = String(scrollY)
    // Hide floating nav / chrome while category sheet is open
    body.classList.add('karya-modal-open')

    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    // Block touch-driven scroll on the page (backdrop / empty areas)
    const onTouchMove = (e) => {
      const target = e.target
      if (!(target instanceof Element)) return
      // Allow scrolling only inside the dialog panel content
      if (target.closest('[data-modal-scroll]')) return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.left = prev.bodyLeft
      body.style.right = prev.bodyRight
      body.style.width = prev.bodyWidth
      body.style.paddingRight = prev.bodyPaddingRight
      delete body.dataset.modalScrollY
      body.classList.remove('karya-modal-open')
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [onClose])

  const closeWithSwipe = () => {
    // Slide out then close
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

  /** Start sheet drag: handle always; content only when scrolled to top */
  const startDragIfAllowed = (e) => {
    if (!isMobile) return
    const scroller = scrollRef.current
    const fromHandle = e.target instanceof Element && e.target.closest('[data-drag-handle]')
    if (fromHandle || !scroller || scroller.scrollTop <= 2) {
      dragControls.start(e)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-stretch justify-center overscroll-none p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop — desktop only; mobile is full-screen sheet */}
      <button
        type="button"
        className="absolute inset-0 hidden touch-none bg-[#1A1817]/55 backdrop-blur-[2px] sm:block"
        aria-label={t('categories.close')}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative z-10 flex w-full flex-col bg-white overscroll-contain touch-pan-y',
          // Mobile: full viewport, one continuous scroll
          'h-[100dvh] max-h-[100dvh] rounded-none',
          // Desktop: floating panel, photo | text
          'sm:h-auto sm:max-h-[min(92dvh,920px)] sm:max-w-3xl sm:flex-row sm:overflow-hidden sm:rounded-[12px] sm:shadow-2xl sm:touch-auto',
        ].join(' ')}
        style={isMobile ? { y, opacity: sheetOpacity } : undefined}
        initial={isMobile ? { opacity: 1, y: 40 } : { opacity: 0, y: 24 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        exit={isMobile ? { opacity: 1, y: 80 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.55 }}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        {/* Drag handle — mobile only */}
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

        {/*
          Mobile: single scroll column (photo → text → CTAs).
          Desktop: row; text column scrolls if needed.
        */}
        <div
          ref={scrollRef}
          data-modal-scroll
          className={[
            'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain',
            'sm:flex-row sm:overflow-hidden',
          ].join(' ')}
          onPointerDown={startDragIfAllowed}
        >
          {/* Photo */}
          <div className="relative w-full shrink-0 bg-white sm:w-[46%] sm:self-stretch sm:border-r sm:border-[var(--border-color)] sm:overflow-y-auto">
            {/* Close — floats over photo on mobile */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={[
                // Match pill-nav hamburger: square, 8px corners
                'absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-[8px]',
                'border border-[var(--border-color)] bg-white/90 text-[var(--text-primary)] backdrop-blur-sm',
                'transition-colors active:bg-white sm:right-4 sm:top-4',
              ].join(' ')}
              aria-label={t('categories.close')}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            </button>
            <CategoryPhoto line={line} id={id} index={index} alt={title} />
          </div>

          {/* Text + actions */}
          <div
            className={[
              'flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5',
              'sm:min-h-0 sm:overflow-y-auto sm:overscroll-contain sm:p-7',
            ].join(' ')}
          >
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {lineLabel}
              </p>
              <h3
                id={titleId}
                className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
              >
                {title}
              </h3>
              {sub ? (
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{sub}</p>
              ) : null}
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)] sm:mt-5 sm:text-[15px]">
              {desc}
            </p>

            <p className="mt-3 text-xs text-[var(--text-muted)]">{t('categories.note')}</p>

            <div className="mt-8 flex flex-col gap-2.5 pb-2 sm:mt-auto sm:pt-8">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                {t('categories.request')}
              </a>
              <a
                href={MAPS_DIR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full"
                onClick={onClose}
              >
                {t('categories.visit')}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
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
      className="section-pad relative z-10 rounded-t-[8px] bg-white pt-16 sm:pt-20"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <BlurText
            as="h2"
            text={t('categories.heading')}
            animateBy="letters"
            direction="top"
            delay={80}
            stepDuration={0.32}
            threshold={0.2}
            rootMargin="0px 0px -8% 0px"
            className="h2-editorial justify-center text-[clamp(2rem,7vw,3.75rem)] uppercase tracking-[0.06em] sm:tracking-[0.08em]"
          />
        </div>

        <div className="relative z-20 mt-8 flex justify-center sm:mt-10">
          <div
            className="inline-flex rounded-[8px] border border-[var(--border-color)] bg-[#FAFAFA] p-1"
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
                    'relative z-20 min-h-11 min-w-[7.5rem] touch-manipulation rounded-[6px] px-6 text-[11px] font-display font-bold uppercase tracking-[0.14em] transition-all sm:min-w-[9rem] sm:px-8',
                    on
                      ? 'bg-[#1A1817] text-[#F8F7F4]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {key === 'women' ? t('categories.women') : t('categories.men')}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div
              ref={scrollerRef}
              className={[
                'flex gap-4 overflow-x-auto overscroll-x-contain pb-3',
                'snap-x snap-mandatory touch-pan-x',
                'scroll-pl-[max(1rem,var(--safe-left))] scroll-pr-[max(1rem,var(--safe-right))]',
                'px-[max(1rem,var(--safe-left))]',
                '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                'md:container-wide md:grid md:w-full md:grid-cols-5 md:gap-x-8 md:gap-y-12',
                'md:overflow-visible md:px-[max(2rem,var(--safe-left))] md:pb-0 md:snap-none',
                'lg:gap-x-10 lg:gap-y-14 xl:gap-x-12',
              ].join(' ')}
            >
              {CATEGORY_IDS.map((id, idx) => {
                const title = t(`categories.${id}Title`)
                return (
                  <button
                    key={`${line}-${id}`}
                    type="button"
                    onClick={() => setOpenId(id)}
                    className={[
                      'group block snap-start text-center outline-none',
                      'w-[calc((100%-1rem)/1.2)] shrink-0 grow-0 basis-[calc((100%-1rem)/1.2)]',
                      'md:w-auto md:basis-auto md:shrink md:snap-align-none',
                      'cursor-pointer rounded-[4px] focus-visible:ring-2 focus-visible:ring-[#1A1817]/30 focus-visible:ring-offset-2',
                    ].join(' ')}
                  >
                    <div className="overflow-hidden bg-white">
                      <CategoryPhoto line={line} id={id} index={idx} alt={title} />
                    </div>
                    <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors group-hover:text-[#8C5E3C] sm:mt-4 sm:text-sm">
                      {title}
                    </p>
                  </button>
                )
              })}
              <div
                className="w-[max(0.5rem,var(--safe-right))] shrink-0 grow-0 basis-[max(0.5rem,var(--safe-right))] md:hidden"
                aria-hidden
              />
            </div>
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
