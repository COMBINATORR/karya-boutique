import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

export function Craft() {
  const { t } = useTranslation()

  const detailsList = [
    { stepKey: 'details.l1', titleKey: 'details.d1Title', descKey: 'details.d1Desc' },
    { stepKey: 'details.l2', titleKey: 'details.d2Title', descKey: 'details.d2Desc' },
    { stepKey: 'details.l3', titleKey: 'details.d3Title', descKey: 'details.d3Desc' },
  ]

  return (
    <section
      id="details"
      className="bg-[#1A1817] py-16 text-[#F8F7F4] sm:py-28 lg:py-36 2xl:py-44"
    >
      <div className="container-wide">
        <motion.div className="mb-12 max-w-4xl sm:mb-16 lg:mb-24" {...fadeUp(0)}>
          <span className="mb-3 block font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E6B4C] sm:mb-4 sm:text-xs sm:tracking-[0.2em]">
            {t('details.eyebrow')}
          </span>
          <h2 className="mb-5 font-display text-[clamp(1.85rem,6vw,4.5rem)] font-bold tracking-tight text-[#F8F7F4] sm:mb-8">
            {t('details.title')}
          </h2>
          <p className="text-base leading-relaxed text-[#F8F7F4]/75 sm:text-lg lg:text-xl">
            {t('details.subtitle')}
          </p>
        </motion.div>

        <div className="mb-12 grid gap-8 border-t border-[#F8F7F4]/10 pt-10 sm:mb-16 sm:gap-10 sm:pt-14 md:mb-24 md:grid-cols-3 md:gap-12 md:pt-16">
          {detailsList.map((item, idx) => (
            <motion.div
              key={item.titleKey}
              className="flex flex-col justify-between"
              {...fadeUp(0.1 * idx)}
            >
              <div>
                <span className="mb-3 block font-mono text-[10px] font-bold tracking-widest text-[#9E6B4C] sm:mb-5 sm:text-xs">
                  {t(item.stepKey)}
                </span>
                <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-tight text-[#F8F7F4] sm:mb-4 sm:text-2xl lg:text-3xl">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-[#F8F7F4]/75 sm:text-base">
                  {t(item.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl border-t border-[#F8F7F4]/15 pt-10 sm:pt-14 lg:pt-16">
          <blockquote className="mb-4 font-display text-lg font-normal italic leading-snug text-[#F8F7F4] min-[400px]:text-xl sm:mb-6 sm:text-2xl lg:text-3xl xl:text-4xl lg:leading-relaxed">
            {t('details.quote')}
          </blockquote>
          <cite className="text-[10px] font-mono font-bold not-italic uppercase tracking-widest text-[#9E6B4C] sm:text-xs">
            — {t('details.author')}
          </cite>
        </div>
      </div>
    </section>
  )
}
