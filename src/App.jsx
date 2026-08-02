import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PillNavbar } from './components/PillNavbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Collections } from './components/Collections'
import { Craft } from './components/Craft'
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
        <Craft />
        <div className="bg-[#1A1817] px-6 sm:px-12 lg:px-16">
          <SectionDivider light className="max-w-[1920px] mx-auto py-6 sm:py-8" />
        </div>
        <About />
        <div className="bg-white px-6 sm:px-12 lg:px-16">
          <SectionDivider className="max-w-[1920px] mx-auto py-2" />
        </div>
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
