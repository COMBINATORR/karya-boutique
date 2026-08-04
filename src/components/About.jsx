import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

export function About() {
  const { t } = useTranslation()

  const values = [
    { labelKey: 'about.l1', titleKey: 'about.v1Title', descKey: 'about.v1Desc' },
    { labelKey: 'about.l2', titleKey: 'about.v2Title', descKey: 'about.v2Desc' },
    { labelKey: 'about.l3', titleKey: 'about.v3Title', descKey: 'about.v3Desc' },
  ]

  return (
    <section
      id="about"
      className="section-pad relative z-10 -mt-6 rounded-t-[1.5rem] bg-white sm:-mt-8 sm:rounded-t-[2rem] md:-mt-10 md:rounded-t-[2.5rem]"
    >
      <div className="container-wide">
        <motion.div className="mb-12 max-w-6xl sm:mb-16 lg:mb-20" {...fadeUp(0)}>
          <span className="eyebrow mb-2 block text-[10px] tracking-[0.18em] sm:mb-3 sm:text-xs sm:tracking-[0.2em]">
            {t('about.eyebrow')}
          </span>
          <h2 className="h2-editorial mb-6 text-[clamp(1.85rem,6vw,4.5rem)] tracking-tight sm:mb-10">
            {t('about.titleBefore')}{' '}
            <em className="font-serif-italic font-normal text-[#8C5E3C]">
              {t('about.titleAccent')}
            </em>{' '}
            {t('about.titleAfter')}
          </h2>
          <p className="border-l-2 border-[#8C5E3C] pl-4 text-base font-normal leading-relaxed text-[var(--text-primary)] min-[400px]:pl-6 min-[400px]:text-lg sm:pl-8 sm:text-xl lg:pl-10 lg:text-2xl xl:text-3xl">
            {t('about.lead')}
          </p>
        </motion.div>

        <div className="grid gap-4 border-t border-[var(--border-color)] pt-8 sm:gap-6 sm:pt-10 md:grid-cols-3 md:gap-8 lg:gap-10">
          {values.map((item, idx) => (
            <motion.div
              key={item.titleKey}
              className="liquid-glass-light flex flex-col justify-between rounded-[8px] p-5 min-[400px]:p-6 sm:p-8 lg:p-10"
              {...fadeUp(0.08 * idx)}
            >
              <div className="relative z-[1]">
                <span className="mb-4 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#8C5E3C] sm:mb-5 sm:text-xs">
                  {t(item.labelKey)}
                </span>
                <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] sm:mb-4 sm:text-2xl">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {t(item.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
