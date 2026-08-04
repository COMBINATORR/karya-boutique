import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Hand, MessageSquare, Sparkles } from 'lucide-react'
import { fadeUp } from '@/lib/motion'

const STEPS = [
  { icon: Hand, labelKey: 'about.l1', titleKey: 'about.v1Title', descKey: 'about.v1Desc' },
  { icon: MessageSquare, labelKey: 'about.l2', titleKey: 'about.v2Title', descKey: 'about.v2Desc' },
  { icon: Sparkles, labelKey: 'about.l3', titleKey: 'about.v3Title', descKey: 'about.v3Desc' },
]

export function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="section-pad section-sheet surface-white">
      <div className="container-wide">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Left — visit pitch */}
          <motion.div className="lg:col-span-5" {...fadeUp(0)}>
            <span className="eyebrow mb-2 block text-[10px] tracking-[0.18em] sm:mb-3 sm:text-xs sm:tracking-[0.2em]">
              {t('about.eyebrow')}
            </span>
            <h2 className="h2-editorial mb-5 text-[clamp(1.85rem,5.5vw,3.25rem)] tracking-tight sm:mb-6">
              {t('about.titleBefore')}{' '}
              <em className="font-serif-italic font-normal text-[var(--accent-cognac)]">
                {t('about.titleAccent')}
              </em>
              {t('about.titleAfter') ? (
                <>
                  {' '}
                  {t('about.titleAfter')}
                </>
              ) : null}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              {t('about.lead')}
            </p>

            <div className="mt-8 sm:mt-10">
              <a href="#location" className="btn-secondary-dark">
                {t('about.ctaContacts')}
              </a>
            </div>

            <p className="mt-5 text-xs text-[var(--text-muted)] sm:mt-6">
              {t('about.placeLine')}
            </p>
          </motion.div>

          {/* Right — visit steps */}
          <div className="grid gap-3 sm:gap-4 lg:col-span-7">
            {STEPS.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.titleKey}
                  className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-muted)] p-4 min-[400px]:gap-5 min-[400px]:p-5 sm:p-6"
                  {...fadeUp(0.06 * (idx + 1))}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-white text-[var(--accent-cognac)] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--accent-cognac)]">
                      {t(item.labelKey)}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
                      {t(item.titleKey)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                      {t(item.descKey)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
