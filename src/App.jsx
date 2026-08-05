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
import { SectionDivider } from './components/SectionDivider'
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
    <div className="page-shell">
      <ScrollProgressBar progress={progress} />
      <PillNavbar />

      <main>
        <Hero />
        <Collections />
        <BrandJourney />
        <div className="section-underlap" aria-hidden />
        <Features />
        <div className="bg-white px-6 sm:px-12 lg:px-16">
          <SectionDivider className="max-w-[1920px] mx-auto py-2" />
        </div>
        <About />
        <div className="bg-white px-6 sm:px-12 lg:px-16">
          <SectionDivider className="max-w-[1920px] mx-auto py-2" />
        </div>
        <Faq />
        <div className="bg-white px-6 sm:px-12 lg:px-16">
          <SectionDivider className="max-w-[1920px] mx-auto py-2" />
        </div>
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
