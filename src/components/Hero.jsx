import { useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import ShinyText from '@/components/ShinyText'

export function Hero() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const currentTimeRef = useRef(0)

  const heroVideoUrl = '/videos/Hero_BG_scroll.mp4'

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const textOpacity = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -32])

  const scrubVideo = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration || isNaN(video.duration)) {
      rafRef.current = requestAnimationFrame(scrubVideo)
      return
    }

    const scrollProgress = scrollYProgress.get()
    const targetTime = scrollProgress * video.duration
    const diff = targetTime - currentTimeRef.current

    if (Math.abs(diff) > 0.01) {
      currentTimeRef.current += diff * 0.15
    } else {
      currentTimeRef.current = targetTime
    }

    const clampedTime = Math.max(0, Math.min(currentTimeRef.current, video.duration - 0.01))
    video.currentTime = clampedTime
    rafRef.current = requestAnimationFrame(scrubVideo)
  }, [scrollYProgress])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
      currentTimeRef.current = 0
    }
    rafRef.current = requestAnimationFrame(scrubVideo)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrubVideo])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }, [])

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
      <div className="sticky top-0 h-screen-safe w-full overflow-hidden bg-[#1A1817]">
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            className="h-full w-full object-cover object-center"
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
          {/* Even vignette — content is centered */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#1A1817]/90 via-[#1A1817]/40 to-[#1A1817]/45" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,24,23,0.35)_70%,rgba(26,24,23,0.65)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#1A1817] via-[#1A1817]/45 to-transparent sm:h-48 md:h-56" />
        </div>

        <motion.div
          className="container-wide relative z-20 flex h-full flex-col items-center justify-center text-center"
          style={{
            opacity: textOpacity,
            y: textY,
            paddingTop: 'calc(4.5rem + var(--safe-top))',
            paddingBottom: 'max(1.5rem, calc(var(--safe-bottom) + 1.5rem))',
          }}
        >
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

            <h1 className="animate-fade-up-delay-1 font-display font-bold leading-[0.96] tracking-[-0.035em] text-[#F8F7F4] text-[clamp(2.5rem,11vw,5.75rem)]">
              {t('hero.titleLead')}{' '}
              <ShinyText
                text={t('hero.titleAccent')}
                speed={3}
                delay={1.5}
                color="#e8e0d6"
                shineColor="#ffffff"
                spread={110}
                direction="left"
                className="font-serif-italic font-normal text-[clamp(2.5rem,11vw,5.75rem)]"
              />
            </h1>

            <div
              className="animate-fade-up-delay-2 mt-5 h-px w-12 bg-[#8C5E3C]/90 sm:mt-6 sm:w-16"
              aria-hidden
            />

            <div className="animate-fade-up-delay-3 mt-8 grid w-full max-w-xl grid-cols-3 gap-3 border-t border-[#F8F7F4]/12 pt-6 min-[400px]:mt-10 min-[400px]:gap-6 sm:mt-12 sm:gap-8 sm:pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 text-center">
                  <p className="font-display text-xl font-bold tracking-tight text-[#F8F7F4] min-[400px]:text-2xl sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mx-auto mt-1 max-w-[9rem] text-[8px] font-medium uppercase leading-snug tracking-[0.12em] text-[#F8F7F4]/50 min-[400px]:text-[9px] sm:text-[10px]">
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
