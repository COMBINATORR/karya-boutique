import { useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'
import { whatsappRequestUrl } from '@/constants/contact'
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
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])

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
      className="relative mb-[-25px] w-full bg-[#1A1817] h-[160vh] min-[400px]:h-[175vh] sm:h-[190vh] lg:h-[210vh]"
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
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#1A1817]/92 via-[#1A1817]/35 to-[#1A1817]/50" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#1A1817]/55 via-transparent to-transparent" />
          {/* Mindloop-style soft fade into next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#1A1817] via-[#1A1817]/50 to-transparent sm:h-56 md:h-64" />
        </div>

        <motion.div
          className="container-wide relative z-20 flex h-full flex-col justify-end"
          style={{
            opacity: textOpacity,
            y: textY,
            paddingTop: 'calc(5rem + var(--safe-top))',
            paddingBottom: 'max(2rem, calc(var(--safe-bottom) + 2.25rem))',
          }}
        >
          <div className="w-full max-w-xl lg:max-w-2xl">
            <p className="animate-fade-up mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] min-[400px]:mb-4 min-[400px]:text-[11px] sm:tracking-[0.28em] sm:text-xs">
              <span className="inline-block h-px w-5 bg-[#8C5E3C] sm:w-6" aria-hidden />
              <ShinyText
                text={t('hero.overtitle')}
                speed={2.5}
                delay={1.2}
                color="#c4b5a5"
                shineColor="#ffffff"
                spread={100}
                direction="left"
                className="uppercase tracking-[0.22em] sm:tracking-[0.28em]"
              />
            </p>

            <h1 className="animate-fade-up-delay-1 font-display font-bold leading-[0.98] tracking-[-0.035em] text-[#F8F7F4] text-[clamp(2.15rem,9.5vw,5.25rem)]">
              {t('hero.titleLead')}{' '}
              <ShinyText
                text={t('hero.titleAccent')}
                speed={3}
                delay={1.5}
                color="#e8e0d6"
                shineColor="#ffffff"
                spread={110}
                direction="left"
                className="font-serif-italic font-normal text-[clamp(2.15rem,9.5vw,5.25rem)]"
              />
            </h1>

            <div className="animate-fade-up-delay-1 mt-4 h-px w-10 bg-[#8C5E3C] sm:mt-5 sm:w-12" aria-hidden />

            <p className="animate-fade-up-delay-2 mt-4 max-w-md text-[13px] leading-relaxed text-[#F8F7F4]/75 min-[400px]:text-sm sm:mt-5 sm:text-base">
              {t('hero.subtitle')}
            </p>

            {/* Blur CTA bar (Drift-inspired) */}
            <div className="animate-fade-up-delay-3 mt-6 w-full max-w-lg sm:mt-8">
              <div className="liquid-glass flex flex-col gap-2 rounded-[8px] p-1.5 sm:flex-row sm:items-center sm:pl-5 sm:pr-1.5 sm:py-1.5">
                <p className="relative z-[1] hidden flex-1 px-2 text-left text-xs font-medium leading-snug text-white/90 sm:block sm:text-sm">
                  {t('hero.ctaBar')}
                </p>
                <p className="relative z-[1] px-3 pt-2 text-center text-[11px] font-medium text-white/85 sm:hidden">
                  {t('hero.ctaBarMobile')}
                </p>
                <div className="relative z-[1] flex flex-col gap-1.5 sm:flex-row sm:items-center">
                  <motion.a
                    href={whatsappRequestUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1A1817] transition-colors hover:bg-white/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {t('nav.whatsapp')}
                  </motion.a>
                  <a
                    href="#categories"
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white/10"
                  >
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </div>

            <div className="animate-fade-up-delay-3 mt-3 flex flex-wrap gap-2 sm:mt-4">
              <a
                href="#location"
                className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-white/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {t('hero.ctaSecondary')}
              </a>
            </div>

            <div className="animate-fade-up-delay-4 mt-6 grid grid-cols-3 gap-2 border-t border-[#F8F7F4]/15 pt-5 min-[400px]:mt-8 min-[400px]:gap-4 sm:flex sm:flex-wrap sm:gap-10 sm:pt-7">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <p className="font-display text-lg font-bold tracking-tight text-[#F8F7F4] min-[400px]:text-xl sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[8px] font-medium uppercase leading-snug tracking-[0.12em] text-[#F8F7F4]/50 min-[400px]:text-[9px] sm:text-[10px]">
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
