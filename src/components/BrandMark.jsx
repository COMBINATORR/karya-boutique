import { useLayoutEffect, useRef, useState } from 'react'
import ShinyText from '@/components/ShinyText'

const SINCE = 'SINCE 1980'
const GAPS = SINCE.length - 1

/**
 * KARYA + SINCE 1980 edge-to-edge.
 * shiny: continuous gradient on the whole phrase (one ShinyText).
 *
 * IMPORTANT: title must be width:max-content — if it stretches to the since line,
 * letter-spacing feedback loops (was ~36000px, only "S" visible).
 */
export function BrandMark({ size = 'md', shiny = false, className = '' }) {
  const titleRef = useRef(null)
  const [titleWidth, setTitleWidth] = useState(0)
  const [letterSpacing, setLetterSpacing] = useState(0)

  const titleClass =
    size === 'lg'
      ? 'text-3xl'
      : size === 'sm'
        ? 'text-base sm:text-lg'
        : 'text-[1.35rem] min-[400px]:text-2xl sm:text-3xl'

  const sinceClass =
    size === 'lg'
      ? 'text-[9px]'
      : size === 'sm'
        ? 'text-[6px] sm:text-[7px]'
        : 'text-[7px] min-[400px]:text-[8px] sm:text-[9px]'

  const sinceChars = Array.from(SINCE)

  useLayoutEffect(() => {
    const title = titleRef.current
    if (!title) return

    const fit = () => {
      // Natural width of KARYA only (must not stretch)
      const tw = title.getBoundingClientRect().width
      if (tw <= 0) return
      setTitleWidth(tw)

      if (!shiny || GAPS <= 0) return

      const probe = document.createElement('span')
      probe.className = `font-display font-medium uppercase ${sinceClass}`
      probe.style.cssText =
        'position:absolute;left:-99999px;top:0;white-space:nowrap;letter-spacing:0;visibility:hidden;pointer-events:none'
      probe.textContent = SINCE
      document.body.appendChild(probe)
      const mw = probe.getBoundingClientRect().width
      document.body.removeChild(probe)

      if (mw <= 0) return
      const ls = (tw - mw) / GAPS
      // Guard against runaway values from bad measures
      setLetterSpacing(Number.isFinite(ls) ? Math.min(Math.max(0, ls), 12) : 0)
    }

    fit()
    const t1 = requestAnimationFrame(fit)
    const t2 = window.setTimeout(fit, 80)
    const t3 = window.setTimeout(fit, 300)
    document.fonts?.ready?.then(fit)

    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(title)
    window.addEventListener('resize', fit)

    return () => {
      cancelAnimationFrame(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      ro?.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [shiny, size, sinceClass])

  return (
    <span
      className={`brand-mark inline-flex flex-col items-start leading-none ${className}`.trim()}
      style={titleWidth > 0 ? { width: titleWidth } : undefined}
    >
      <span
        ref={titleRef}
        className={`brand-mark-title font-display ${titleClass} font-black tracking-[-0.03em] uppercase leading-none`}
      >
        <span className="text-[var(--text-primary)]">KAR</span>
        <span className="text-[#C8102E]">YA</span>
      </span>

      {shiny ? (
        <span className="brand-mark-since-phrase" aria-label="Since 1980">
          <ShinyText
            text={SINCE}
            speed={2.8}
            delay={1.5}
            color="#8C5E3C"
            shineColor="#f5ebe3"
            spread={100}
            direction="left"
            className={`font-display font-medium uppercase leading-none ${sinceClass}`}
            style={{
              letterSpacing: `${letterSpacing}px`,
              whiteSpace: 'nowrap',
              display: 'block',
              width: '100%',
              textAlign: 'left',
            }}
          />
        </span>
      ) : (
        <span
          className={`brand-mark-since font-display font-medium ${sinceClass} uppercase text-[#8C5E3C] leading-none`}
          aria-label="Since 1980"
        >
          {sinceChars.map((ch, i) => (
            <span key={i} className="brand-mark-since-ch">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
