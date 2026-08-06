import { useRef, useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion'
import ShinyText from '@/components/ShinyText'
import { DecodeText } from '@/components/DecodeText'

/** Scrub-optimized encodes (dense keyframes, no B-frames) */
const HERO_VIDEO_DESKTOP = '/videos/Hero_BG_scroll_scrub.mp4'
const HERO_VIDEO_MOBILE = '/videos/Hero_BG_scroll_mobile.mp4'
const HERO_VIDEO_FALLBACK = '/videos/Hero_BG_scroll.mp4'

/**
 * Scroll map (of hero track progress 0→1):
 *  0    – 0.78  video scrubs 0→1 (backpack flies + lands)
 *  0.62 – 0.74  brand + stats decode in (landing beat)
 *  0.78 – 1.00  hold on landed frame before next section
 */
const VIDEO_END = 0.78
const LAND_IN = 0.6
const LAND_FULL = 0.72
const LEAVE_START = 0.9

function pickHeroVideo() {
  if (typeof window === 'undefined') return HERO_VIDEO_DESKTOP
  const coarse =
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 768px)').matches
  return coarse ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP
}

export function Hero() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)
  const seekTimeoutRef = useRef(null)
  const rafRef = useRef(null)
  const unlockedRef = useRef(false)
  const readyRef = useRef(false)
  const [videoSrc, setVideoSrc] = useState(() => pickHeroVideo())
  const [landed, setLanded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Video finishes before track ends → remaining scroll = hold on landed pose
  const videoProgress = useTransform(scrollYProgress, [0, VIDEO_END], [0, 1], {
    clamp: true,
  })

  // Brand / stats: appear at landing, fade only when leaving hero
  const brandRaw = useTransform(
    scrollYProgress,
    [LAND_IN, LAND_FULL, LEAVE_START, 1],
    [0, 1, 1, 0],
  )
  const brandOpacity = useSpring(brandRaw, { stiffness: 120, damping: 28, mass: 0.6 })
  const brandY = useTransform(brandRaw, [0, 1], [28, 0])
  const brandScale = useTransform(brandRaw, [0, 1], [0.96, 1])

  // Soft dark veil only after land (readable type) then stronger on leave
  const veilOpacity = useTransform(
    scrollYProgress,
    [LAND_IN, LAND_FULL, LEAVE_START, 1],
    [0, 0.22, 0.35, 0.55],
  )

  useMotionValueEvent(brandRaw, 'change', (v) => {
    setLanded(v > 0.45)
  })

  const clearSeekLock = useCallback(() => {
    seekingRef.current = false
    if (seekTimeoutRef.current != null) {
      window.clearTimeout(seekTimeoutRef.current)
      seekTimeoutRef.current = null
    }
  }, [])

  const flushSeek = useCallback(() => {
    const video = videoRef.current
    if (!video || !readyRef.current || !durationRef.current) return
    if (!unlockedRef.current) return

    const duration = durationRef.current
    const target = Math.max(0, Math.min(targetTimeRef.current, Math.max(0, duration - 0.05)))
    const delta = Math.abs((video.currentTime || 0) - target)
    if (delta < 0.03) return
    if (seekingRef.current) return

    seekingRef.current = true
    if (seekTimeoutRef.current != null) window.clearTimeout(seekTimeoutRef.current)
    seekTimeoutRef.current = window.setTimeout(() => {
      seekingRef.current = false
      seekTimeoutRef.current = null
    }, 220)

    try {
      video.currentTime = target
    } catch {
      clearSeekLock()
    }
  }, [clearSeekLock])

  const scheduleSeek = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      flushSeek()
    })
  }, [flushSeek])

  const unlockVideo = useCallback(async () => {
    const video = videoRef.current
    if (!video || unlockedRef.current) return true

    try {
      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')

      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        await playPromise
      }
      video.pause()
      unlockedRef.current = true
      if (durationRef.current) {
        targetTimeRef.current = videoProgress.get() * durationRef.current
      }
      clearSeekLock()
      scheduleSeek()
      return true
    } catch {
      unlockedRef.current = false
      return false
    }
  }, [clearSeekLock, scheduleSeek, videoProgress])

  useMotionValueEvent(videoProgress, 'change', (progress) => {
    if (!durationRef.current) return
    targetTimeRef.current = progress * durationRef.current
    if (!unlockedRef.current) {
      void unlockVideo()
      return
    }
    if (!seekingRef.current) scheduleSeek()
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const onReady = () => {
      if (cancelled) return
      const d = video.duration
      if (!d || Number.isNaN(d) || !Number.isFinite(d)) return
      durationRef.current = d
      readyRef.current = true
      targetTimeRef.current = videoProgress.get() * d
      void unlockVideo()
    }

    const onSeeked = () => {
      clearSeekLock()
      const duration = durationRef.current
      if (!duration || !video) return
      const target = Math.max(0, Math.min(targetTimeRef.current, duration - 0.05))
      if (Math.abs(video.currentTime - target) > 0.04) {
        scheduleSeek()
      }
    }

    const onError = () => {
      if (videoSrc === HERO_VIDEO_FALLBACK) return
      if (videoSrc === HERO_VIDEO_MOBILE || videoSrc === HERO_VIDEO_DESKTOP) {
        setVideoSrc((prev) =>
          prev === HERO_VIDEO_MOBILE ? HERO_VIDEO_DESKTOP : HERO_VIDEO_FALLBACK,
        )
      }
    }

    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('canplay', onReady)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)

    try {
      video.load()
    } catch {
      /* ignore */
    }
    if (video.readyState >= 1) onReady()

    const gestureEvents = ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll']
    const onGesture = () => {
      void unlockVideo()
    }
    gestureEvents.forEach((ev) =>
      window.addEventListener(ev, onGesture, { passive: true, once: false, capture: true }),
    )

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('canplay', onReady)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      gestureEvents.forEach((ev) => window.removeEventListener(ev, onGesture, true))
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (seekTimeoutRef.current != null) window.clearTimeout(seekTimeoutRef.current)
      unlockedRef.current = false
      readyRef.current = false
    }
  }, [clearSeekLock, scheduleSeek, unlockVideo, videoProgress, videoSrc])

  const stats = [
    { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
    { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
    { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
  ]

  return (
    <div
      ref={containerRef}
      id="top"
      /* Taller track: more scroll before next section; video ends at ~78% of track */
      className="relative mb-[-1.75rem] h-[220vh] w-full bg-[var(--bg-dark)] min-[400px]:h-[240vh] sm:mb-[-2.25rem] sm:h-[260vh] lg:mb-[-2.75rem] lg:h-[300vh]"
    >
      <div className="hero-pin sticky top-0 z-0 h-screen-safe w-full overflow-hidden bg-[var(--bg-dark)]">
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <video
            ref={(node) => {
              videoRef.current = node
              if (node) {
                node.muted = true
                node.defaultMuted = true
                node.setAttribute('muted', '')
                node.setAttribute('playsinline', '')
                node.setAttribute('webkit-playsinline', 'true')
                node.setAttribute('x-webkit-airplay', 'deny')
              }
            }}
            key={videoSrc}
            muted
            playsInline
            autoPlay
            preload="auto"
            disableRemotePlayback
            controls={false}
            className="h-full w-full object-cover object-center"
            style={{ backgroundColor: 'var(--bg-dark)' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[var(--bg-dark)]/90 via-[var(--bg-dark)]/40 to-[var(--bg-dark)]/45" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,24,23,0.35)_70%,rgba(26,24,23,0.65)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)]/45 to-transparent sm:h-48 md:h-56" />
          <div className="hero-film-grain" aria-hidden />
          <motion.div
            className="pointer-events-none absolute inset-0 z-[15] bg-[var(--bg-dark)]"
            style={{ opacity: veilOpacity }}
            aria-hidden
          />
        </div>

        {/* Brand + stats — only after backpack lands */}
        <motion.div
          className="container-wide relative z-20 flex h-full flex-col text-center will-change-transform"
          style={{
            opacity: brandOpacity,
            y: brandY,
            scale: brandScale,
            paddingTop: 'calc(4.5rem + var(--safe-top))',
            paddingBottom: 'max(0.35rem, calc(var(--safe-bottom) + 0.35rem))',
            pointerEvents: landed ? 'auto' : 'none',
          }}
          aria-hidden={!landed}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="flex w-full max-w-3xl flex-col items-center">
              <p className="mb-4 flex items-center justify-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.28em] min-[400px]:mb-5 min-[400px]:text-[11px] sm:tracking-[0.32em] sm:text-xs">
                <span className="inline-block h-px w-6 bg-[var(--accent-cognac)] sm:w-8" aria-hidden />
                <ShinyText
                  text={t('hero.overtitle')}
                  speed={2.5}
                  delay={0.2}
                  color="#c4b5a5"
                  shineColor="#ffffff"
                  spread={100}
                  direction="left"
                  className="uppercase tracking-[0.28em] sm:tracking-[0.32em]"
                />
                <span className="inline-block h-px w-6 bg-[var(--accent-cognac)] sm:w-8" aria-hidden />
              </p>

              <h1 className="font-display font-bold leading-[0.96] tracking-[-0.035em] text-[var(--text-light)] text-[clamp(2.75rem,12vw,6rem)]">
                <ShinyText
                  text={t('hero.titleAccent')}
                  speed={3}
                  delay={0.35}
                  color="#e8e0d6"
                  shineColor="#ffffff"
                  spread={110}
                  direction="left"
                  className="font-display font-bold text-[clamp(2.75rem,12vw,6rem)] tracking-[-0.035em]"
                />
              </h1>

              <div
                className="mt-5 h-px w-12 bg-[var(--accent-cognac)]/90 sm:mt-6 sm:w-16"
                aria-hidden
              />
            </div>
          </div>

          <div className="w-full shrink-0 pt-2 sm:pt-3">
            <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-2 border-t border-[var(--text-light)]/15 pt-4 min-[400px]:gap-4 min-[400px]:pt-5 sm:gap-8 sm:pt-6">
              {stats.map((stat, i) => (
                <div key={stat.label} className="min-w-0 text-center">
                  <p className="font-display text-lg font-bold tracking-tight text-[var(--text-light)] min-[400px]:text-xl sm:text-3xl tabular-nums">
                    <DecodeText
                      text={stat.value}
                      active={landed}
                      durationMs={680 + i * 140}
                    />
                  </p>
                  <p
                    className={[
                      'mx-auto mt-0.5 max-w-[9rem] text-[8px] font-medium uppercase leading-snug tracking-[0.12em] min-[400px]:text-[9px] sm:mt-1 sm:text-[10px]',
                      'text-[var(--text-light)]/50 transition-opacity duration-500',
                      landed ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                    style={{ transitionDelay: landed ? `${200 + i * 80}ms` : '0ms' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
