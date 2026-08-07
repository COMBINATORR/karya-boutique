import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { whatsappRequestUrl } from '@/constants/contact'

const INTENTS = [
  { id: 'self', key: 'concierge.intentSelf' },
  { id: 'gift', key: 'concierge.intentGift' },
  { id: 'travel', key: 'concierge.intentTravel' },
]

/**
 * Fixed bottom concierge — calm prompt + intent chips → WhatsApp.
 * Appears when user scrolls to the Assortment/Categories section (#categories);
 * Hides near page end (footer) and when modal is open.
 * Styled in signature liquid-glass-light chrome.
 */
export function ConciergeBar() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [intent, setIntent] = useState(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      const vh = window.innerHeight || 800
      const doc = document.documentElement
      const max = doc.scrollHeight - vh
      const nearEnd = max > 0 && y > max - 280

      // Appear when user reaches the #categories section (assortment)
      const categoriesEl = document.querySelector('#categories')
      let threshold = vh * 0.8
      if (categoriesEl) {
        const rect = categoriesEl.getBoundingClientRect()
        const categoriesTop = y + rect.top
        // Start showing when user is near/at #categories
        threshold = Math.max(100, categoriesTop - 150)
      }

      setVisible(y >= threshold && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const syncModal = () => {
      setModalOpen(document.body.classList.contains('karya-modal-open'))
    }
    syncModal()
    const obs = new MutationObserver(syncModal)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    syncModal()
    return () => obs.disconnect()
  }, [])

  const show = visible && !modalOpen

  const waHref = intent
    ? whatsappRequestUrl(t(`concierge.waPrefill.${intent}`))
    : whatsappRequestUrl()

  return (
    <div
      className={['karya-concierge', show ? 'karya-concierge--show' : ''].join(' ')}
      role="region"
      aria-label={t('concierge.aria')}
      aria-hidden={!show}
    >
      <div className="karya-concierge__inner liquid-glass-light shadow-elevated">
        <div className="karya-concierge__copy">
          <p className="karya-concierge__title">{t('concierge.title')}</p>
          <div className="karya-concierge__chips" role="group" aria-label={t('concierge.intentsLabel')}>
            {INTENTS.map((item) => {
              const active = intent === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'karya-concierge__chip',
                    active ? 'karya-concierge__chip--active' : '',
                  ].join(' ')}
                  aria-pressed={active}
                  onClick={() => setIntent(active ? null : item.id)}
                  tabIndex={show ? 0 : -1}
                >
                  {t(item.key)}
                </button>
              )
            })}
          </div>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="karya-concierge__cta"
          tabIndex={show ? 0 : -1}
        >
          <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
          <span>{t('concierge.cta')}</span>
        </a>
      </div>
    </div>
  )
}
