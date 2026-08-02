import { useEffect, useState } from 'react'

export function useScroll(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setScrolled(y > threshold)

      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, y / max) : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { scrolled, progress }
}
