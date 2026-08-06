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
 * Shows after leaving the hero; hides near page end and when modal is open.
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
      // Appear after ~55% of first screen; hide near footer
      setVisible(y > vh * 0.55 && !nearEnd)
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
      <div className="karya-concierge__inner">
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
