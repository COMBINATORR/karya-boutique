import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CHAPTERS } from '@/constants/chapters'

/**
 * Top progress line + chapter dots (click to jump).
 * Dots map to section ids; active chapter follows scroll.
 */
export function ScrollProgressBar({ progress = 0 }) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState(CHAPTERS[0]?.id ?? 'top')
  const [positions, setPositions] = useState(() =>
    CHAPTERS.map((c) => ({ id: c.id, ratio: 0 })),
  )

  const measure = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max <= 0) return

    const next = CHAPTERS.map((ch) => {
      const el = document.querySelector(ch.selector)
      if (!el) return { id: ch.id, ratio: 0 }
      const top = el.getBoundingClientRect().top + window.scrollY
      return { id: ch.id, ratio: Math.min(1, Math.max(0, top / max)) }
    })
    setPositions(next)

    // Active = last chapter whose top is above ~28% viewport
    const marker = window.scrollY + window.innerHeight * 0.28
    let current = CHAPTERS[0]?.id ?? 'top'
    for (const ch of CHAPTERS) {
      const el = document.querySelector(ch.selector)
      if (!el) continue
      const top = el.getBoundingClientRect().top + window.scrollY
      if (top <= marker) current = ch.id
    }
    setActiveId(current)
  }, [])

  useEffect(() => {
    measure()
    const onScroll = () => measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    // remeasure after layout/images
    const t1 = window.setTimeout(measure, 400)
    const t2 = window.setTimeout(measure, 1200)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [measure])

  const jump = (selector) => {
    const el = document.querySelector(selector)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="scroll-progress-wrap" aria-hidden="false">
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <nav className="scroll-chapters" aria-label={t('chapter.navLabel')}>
        {CHAPTERS.map((ch) => {
          const pos = positions.find((p) => p.id === ch.id)
          const left = `${(pos?.ratio ?? 0) * 100}%`
          const isActive = activeId === ch.id
          return (
            <button
              key={ch.id}
              type="button"
              className={['scroll-chapter-dot', isActive ? 'is-active' : ''].join(' ')}
              style={{ left }}
              title={t(ch.labelKey)}
              aria-label={t(ch.labelKey)}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => jump(ch.selector)}
            >
              <span className="scroll-chapter-dot__core" />
              <span className="scroll-chapter-dot__tip">{t(ch.shortKey)}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
