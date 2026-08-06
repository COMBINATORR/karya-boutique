import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { WHATSAPP_URL } from '@/constants/contact'

const FAQ_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export function Faq() {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState('q1')

  return (
    <section id="faq" className="section-pad surface-white">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="h2-editorial text-[clamp(1.85rem,5vw,3rem)] tracking-tight">
            {t('faq.title')}
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">
            {t('faq.lead')}{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent-cognac)] underline-offset-2 transition-colors hover:underline"
            >
              {t('faq.talk')}
            </a>
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-2.5 sm:mt-12 sm:space-y-3">
          {FAQ_IDS.map((id) => {
            const isOpen = openId === id
            return (
              <div
                key={id}
                className={[
                  'overflow-hidden rounded-[var(--radius-sm)] transition-colors duration-200',
                  isOpen
                    ? 'border border-[var(--border-color)] bg-white shadow-soft'
                    : 'bg-[var(--bg-muted)]',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-[1.125rem]"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-semibold tracking-tight text-[var(--text-primary)] sm:text-[15px]">
                    {t(`faq.${id}`)}
                  </span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-lg font-light leading-none text-[var(--text-muted)]"
                    aria-hidden
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:px-5 sm:pb-5 sm:text-[15px]">
                        {t(`faq.${id}a`)}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
