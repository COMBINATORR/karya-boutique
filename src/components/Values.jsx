import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

/** Rhode “when skin feels…” style keyword block */
export function Values() {
  const { t } = useTranslation()
  const keys = [t('needs.k1'), t('needs.k2'), t('needs.k3')]

  return (
    <section className="section-pad bg-cream-100">
      <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <motion.div
          className="photo-slot photo-slot--soft aspect-[4/5] w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="photo-slot__label">
            <strong>{t('brand')}</strong>
            <span>{t('needs.slot')}</span>
          </div>
        </motion.div>

        <div>
          <p className="eyebrow mb-4">{t('needs.eyebrow')}</p>
          <h2 className="display-title text-[clamp(2.2rem,4.5vw,3.4rem)] mb-8 max-w-md">
            {t('needs.title')}
          </h2>
          <ul className="space-y-4">
            {keys.map((word, i) => (
              <motion.li
                key={word}
                className="keyword-chip"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {word}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
