import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { whatsappRequestUrl } from '@/constants/contact'

/**
 * Photos:
 *   public/images/assortment/{women|men}/c1.jpg          — main
 *   public/images/assortment/{women|men}/c1-hover.jpg    — hover (disabled)
 */
const CATEGORY_IDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10']

/** Cache-bust when catalog images are regenerated */
const PHOTO_V = 12

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
  return `/images/assortment/${line}/${id}.jpg?v=${PHOTO_V}`
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
  const lineLabel = line === 'women' ? t('categories.women') : t('categories.men')
  const title = t(`categories.${id}Title`)
  const sub = t(`categories.${id}Sub`)
  const desc = t(`categories.${id}Desc`)
  const waUrl = whatsappRequestUrl(`${lineLabel}: ${title}`)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-[#1A1817]/55 backdrop-blur-[2px]"
        aria-label={t('categories.close')}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[16px] bg-white shadow-2xl sm:max-w-3xl sm:flex-row sm:rounded-[12px]"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Photo */}
        <div className="relative w-full shrink-0 border-b border-[var(--border-color)] bg-white sm:w-[46%] sm:border-b-0 sm:border-r">
          <CategoryPhoto line={line} id={id} index={index} alt={title} />
        </div>

        {/* Text + actions */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {lineLabel}
              </p>
              <h3
                id={titleId}
                className="mt-1.5 font-display text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
              >
                {title}
              </h3>
              {sub ? (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{sub}</p>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:bg-[#FAFAFA] hover:text-[var(--text-primary)]"
              aria-label={t('categories.close')}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-5 sm:text-[15px] sm:leading-relaxed">
            {desc}
          </p>

          <p className="mt-3 text-xs text-[var(--text-muted)]">{t('categories.note')}</p>

          <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:pt-8">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              {t('categories.request')}
            </a>
            <a href="#location" className="btn-outline w-full" onClick={onClose}>
              {t('categories.visit')}
            </a>
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
          <h2 className="h2-editorial text-[clamp(2rem,7vw,3.75rem)] tracking-tight">
            {t('categories.heading')}
          </h2>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
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
                    'min-h-11 min-w-[7.5rem] rounded-[6px] px-6 text-[11px] font-display font-bold uppercase tracking-[0.14em] transition-all sm:min-w-[9rem] sm:px-8',
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
                    <div className="overflow-hidden rounded-[4px] border border-[var(--border-color)]/60 bg-white transition-shadow duration-300 group-hover:shadow-[0_12px_40px_-18px_rgba(26,24,23,0.35)]">
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
