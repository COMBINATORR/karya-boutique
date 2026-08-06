import { useTranslation } from 'react-i18next'

/**
 * Section chapter marker — lives at the TOP of the section it introduces
 * (not between sections, so sheet-underlap can't orphan it on the previous block).
 */
export function ChapterTitle({ titleKey, tone = 'light' }) {
  const { t } = useTranslation()
  const dark = tone === 'dark'

  return (
    <div
      className={[
        'chapter-title',
        dark ? 'chapter-title--dark' : 'chapter-title--light',
      ].join(' ')}
      aria-hidden="false"
    >
      <div className="chapter-title__inner">
        <span className="chapter-title__rule" aria-hidden />
        <p className="chapter-title__label">{t(titleKey)}</p>
        <span className="chapter-title__rule" aria-hidden />
      </div>
    </div>
  )
}
