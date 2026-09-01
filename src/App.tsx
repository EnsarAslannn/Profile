import { Navigate, Route, Routes } from 'react-router-dom'
import LanguageProvider from './i18n/LanguageProvider'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import PageBackdrop from './components/PageBackdrop'
import ScrollToHash from './components/ScrollToHash'
import SkipLink from './components/SkipLink'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export default function App() {
  return (
    // LanguageProvider wraps everything and sits INSIDE the router, because it
    // reads the ?lang= param off the location and writes it back with navigate.
    // It is above <Routes> so a language change re-renders every route and the
    // chrome together - the navbar and the contact block are outside <Routes>
    // and would otherwise keep the old language.
    <LanguageProvider>
      <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
        {/* Before everything, so it is the first thing a Tab reaches. */}
        <SkipLink />
        <PageBackdrop />
        <ScrollToHash />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hakkimda" element={<AboutPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Contact is the site's ending on every route, which is why it lives
            here rather than in HomePage - a project detail page finishes the
            same way the home page does. It owns the `iletisim` anchor, so
            NAV_LINKS' last entry resolves from any route. */}
        <Contact />
      </div>
    </LanguageProvider>
  )
}
