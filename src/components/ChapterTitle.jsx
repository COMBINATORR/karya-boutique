import { useTranslation } from 'react-i18next'

/**
 * Editorial chapter marker between sections (Brunello-inspired book rhythm).
 * Quiet centered serif line — not a second H2 for the block below.
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
    >
      <div className="chapter-title__inner">
        <span className="chapter-title__rule" aria-hidden />
        <p className="chapter-title__label">{t(titleKey)}</p>
        <span className="chapter-title__rule" aria-hidden />
      </div>
    </div>
  )
}
