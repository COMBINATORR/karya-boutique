import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'

/**
 * Scramble → settle “decode” for short labels (1980, Стамбул, Ж / М).
 * Runs once when `active` flips true.
 */
export function DecodeText({ text, active = false, className = '', durationMs = 720 }) {
  const [display, setDisplay] = useState(() => (active ? text : ''))
  const ranFor = useRef('')

  useEffect(() => {
    if (!active) {
      setDisplay('')
      ranFor.current = ''
      return undefined
    }
    if (ranFor.current === text) {
      setDisplay(text)
      return undefined
    }
    ranFor.current = text

    const chars = Array.from(text)
    const totalFrames = Math.max(14, Math.ceil(durationMs / 36))
    let frame = 0
    let raf = 0
    let last = 0

    const tick = (now) => {
      if (now - last < 32) {
        raf = requestAnimationFrame(tick)
        return
      }
      last = now
      frame += 1
      const t = Math.min(1, frame / totalFrames)
      // Ease: more scramble early, settle late
      const revealed = Math.floor(t * t * chars.length)

      let out = ''
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i]
        if (ch === ' ' || ch === '/' || ch === '·' || ch === '—' || ch === '-') {
          out += ch
        } else if (i < revealed || t >= 1) {
          out += ch
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
      }
      setDisplay(out)

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, text, durationMs])

  return (
    <span className={className} aria-label={text}>
      {display || '\u00A0'}
    </span>
  )
}
