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
    <LanguageProvider>
      <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
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
        <Contact />
      </div>
    </LanguageProvider>
  )
}
