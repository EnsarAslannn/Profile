import { Analytics } from '@vercel/analytics/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LanguageProvider from './i18n/LanguageProvider'
import { withLanguage } from './i18n/localizedPath'
import AppError from './components/AppError'
import Contact from './components/Contact'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import PageBackdrop from './components/PageBackdrop'
import ScrollToHash from './components/ScrollToHash'
import SkipLink from './components/SkipLink'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

const ENGLISH_HOME = withLanguage('/', 'en')

const pageRoutes = () => [
  <Route key="home" index element={<HomePage />} />,
  <Route key="about" path="hakkimda" element={<AboutPage />} />,
  <Route key="project" path="projects/:slug" element={<ProjectDetailPage />} />,
]

export default function App() {
  const { pathname } = useLocation()

  return (
    <LanguageProvider>
      <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
        <SkipLink />
        <PageBackdrop />
        <ScrollToHash />
        <Navbar />
        <ErrorBoundary key={pathname} fallback={<AppError />}>
          <Routes>
            <Route path="/">{pageRoutes()}</Route>
            <Route path={ENGLISH_HOME}>{pageRoutes()}</Route>
            <Route path={`${ENGLISH_HOME}/*`} element={<Navigate to={ENGLISH_HOME} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
        <Contact />
        <Analytics />
      </div>
    </LanguageProvider>
  )
}
