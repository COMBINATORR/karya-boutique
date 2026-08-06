import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PillNavbar } from './components/PillNavbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Collections } from './components/Collections'
import { BrandJourney } from './components/BrandJourney'
import { Features } from './components/Features'
import { Faq } from './components/Faq'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollProgressBar } from './components/ScrollProgressBar'
import { ConciergeBar } from './components/ConciergeBar'
import { useScroll } from './hooks/useScroll'

export default function App() {
  const { i18n } = useTranslation()
  const { progress } = useScroll()

  useEffect(() => {
    const lang = i18n.language?.startsWith('kk') ? 'kk' : 'ru'
    document.documentElement.lang = lang
    localStorage.setItem('karya-lang', lang)
  }, [i18n.language])

  return (
    <div className="page-shell page-shell--with-concierge">
      <ScrollProgressBar progress={progress} />
      <PillNavbar />

      <main>
        <Hero />

        {/* Content stack above sticky hero */}
        <div className="relative z-[5] bg-white">
          <Collections />
          <BrandJourney />
          <div className="section-underlap" aria-hidden />
          <Features />
          <About />
          <Faq />
          <Contact />
        </div>
      </main>

      <Footer />
      <ConciergeBar />
    </div>
  )
}
