import { useRef, useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import ShinyText from '@/components/ShinyText'

/** Scrub-optimized clip (short GOP, no B-frames) — falls back to original if missing */
const HERO_VIDEO_SCRUB = '/videos/Hero_BG_scroll_scrub.mp4'
const HERO_VIDEO_FALLBACK = '/videos/Hero_BG_scroll.mp4'

export function Hero() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)
  const rafRef = useRef(null)
  const readyRef = useRef(false)
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO_SCRUB)

  // Progress 0 → sticky pin starts; 1 → hero track fully scrolled past.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.38, 0.62, 0.78],
    [1, 1, 0.72, 0.18, 0],
  )
  const textY = useTransform(scrollYProgress, [0, 0.2, 0.55, 0.78], [0, 0, -28, -56])
  const textScale = useTransform(scrollYProgress, [0, 0.35, 0.78], [1, 0.985, 0.96])
  const veilOpacity = useTransform(scrollYProgress, [0.15, 0.55, 0.82], [0, 0.35, 0.72])

  /** Apply pending target time once the decoder is free */
  const flushSeek = useCallback(() => {
    const video = videoRef.current
    if (!video || !readyRef.current || !durationRef.current) return

    const duration = durationRef.current
    // Leave a tiny tail so browsers don't clamp awkwardly at exact duration
    const target = Math.max(0, Math.min(targetTimeRef.current, duration - 0.04))
    const delta = Math.abs(video.currentTime - target)

    // Ignore sub-frame noise (~24fps → ~0.04s)
    if (delta < 0.035) return
    if (seekingRef.current) return

    seekingRef.current = true
    try {
      video.currentTime = target
    } catch {
      seekingRef.current = false
    }
  }, [])

  const scheduleSeek = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      flushSeek()
    })
  }, [flushSeek])

  // Drive scrub from scroll progress (not a free-running lerp loop)
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!durationRef.current) return
    targetTimeRef.current = progress * durationRef.current
    // If idle, seek now; if mid-seek, seeked handler will catch up
    if (!seekingRef.current) scheduleSeek()
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onLoadedMetadata = () => {
      const d = video.duration
      if (!d || Number.isNaN(d)) return
      durationRef.current = d
      readyRef.current = true
      video.pause()
      // Sync to current scroll immediately
      targetTimeRef.current = scrollYProgress.get() * d
      seekingRef.current = false
      flushSeek()
    }

    const onSeeked = () => {
      seekingRef.current = false
      // Apply latest target if scroll moved during the seek
      const duration = durationRef.current
      if (!duration) return
      const target = Math.max(0, Math.min(targetTimeRef.current, duration - 0.04))
      if (Math.abs(video.currentTime - target) > 0.04) {
        scheduleSeek()
      }
    }

    const onSeeking = () => {
      seekingRef.current = true
    }

    const onError = () => {
      // Fall back to original asset if scrub encode missing
      if (videoSrc !== HERO_VIDEO_FALLBACK) {
        setVideoSrc(HERO_VIDEO_FALLBACK)
      }
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('seeking', onSeeking)
    video.addEventListener('error', onError)

    // Already buffered (HMR / cache)
    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('seeking', onSeeking)
      video.removeEventListener('error', onError)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [flushSeek, scheduleSeek, scrollYProgress, videoSrc])

  const stats = [
    { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
    { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
    { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
  ]

  return (
    <div
      ref={containerRef}
      id="top"
      className="relative mb-[-25px] h-[160vh] w-full bg-[#1A1817] min-[400px]:h-[175vh] sm:h-[190vh] lg:h-[210vh]"
    >
      <div className="sticky top-0 z-0 h-screen-safe w-full overflow-hidden bg-[#1A1817]">
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <video
            ref={videoRef}
            key={videoSrc}
            muted
            playsInline
            preload="auto"
            // Helps some mobile browsers keep decode path hot for seeks
            disableRemotePlayback
            className="h-full w-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#1A1817]/90 via-[#1A1817]/40 to-[#1A1817]/45" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,24,23,0.35)_70%,rgba(26,24,23,0.65)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#1A1817] via-[#1A1817]/45 to-transparent sm:h-48 md:h-56" />
          <motion.div
            className="pointer-events-none absolute inset-0 z-[15] bg-[#1A1817]"
            style={{ opacity: veilOpacity }}
            aria-hidden
          />
        </div>

        <motion.div
          className="container-wide relative z-20 flex h-full flex-col text-center will-change-transform"
          style={{
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            paddingTop: 'calc(4.5rem + var(--safe-top))',
            paddingBottom: 'max(0.35rem, calc(var(--safe-bottom) + 0.35rem))',
          }}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="flex w-full max-w-3xl flex-col items-center">
              <p className="animate-fade-up mb-4 flex items-center justify-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.28em] min-[400px]:mb-5 min-[400px]:text-[11px] sm:tracking-[0.32em] sm:text-xs">
                <span className="inline-block h-px w-6 bg-[#8C5E3C] sm:w-8" aria-hidden />
                <ShinyText
                  text={t('hero.overtitle')}
                  speed={2.5}
                  delay={1.2}
                  color="#c4b5a5"
                  shineColor="#ffffff"
                  spread={100}
                  direction="left"
                  className="uppercase tracking-[0.28em] sm:tracking-[0.32em]"
                />
                <span className="inline-block h-px w-6 bg-[#8C5E3C] sm:w-8" aria-hidden />
              </p>

              <h1 className="animate-fade-up-delay-1 font-display font-bold leading-[0.96] tracking-[-0.035em] text-[#F8F7F4] text-[clamp(2.75rem,12vw,6rem)]">
                <ShinyText
                  text={t('hero.titleAccent')}
                  speed={3}
                  delay={1.5}
                  color="#e8e0d6"
                  shineColor="#ffffff"
                  spread={110}
                  direction="left"
                  className="font-display font-bold text-[clamp(2.75rem,12vw,6rem)] tracking-[-0.035em]"
                />
              </h1>

              <div
                className="animate-fade-up-delay-2 mt-5 h-px w-12 bg-[#8C5E3C]/90 sm:mt-6 sm:w-16"
                aria-hidden
              />
            </div>
          </div>

          <div className="animate-fade-up-delay-3 w-full shrink-0 pt-2 sm:pt-3">
            <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-2 border-t border-[#F8F7F4]/15 pt-4 min-[400px]:gap-4 min-[400px]:pt-5 sm:gap-8 sm:pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 text-center">
                  <p className="font-display text-lg font-bold tracking-tight text-[#F8F7F4] min-[400px]:text-xl sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mx-auto mt-0.5 max-w-[9rem] text-[8px] font-medium uppercase leading-snug tracking-[0.12em] text-[#F8F7F4]/50 min-[400px]:text-[9px] sm:mt-1 sm:text-[10px]">
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
