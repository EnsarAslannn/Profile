import { Navigate, Route, Routes } from 'react-router-dom'
import LanguageProvider from './i18n/LanguageProvider'
import { withLanguage } from './i18n/localizedPath'
import Contact from './components/Contact'
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
  return (
    <LanguageProvider>
      <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
        <SkipLink />
        <PageBackdrop />
        <ScrollToHash />
        <Navbar />
        <Routes>
          <Route path="/">{pageRoutes()}</Route>
          <Route path={ENGLISH_HOME}>{pageRoutes()}</Route>
          <Route path={`${ENGLISH_HOME}/*`} element={<Navigate to={ENGLISH_HOME} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Contact />
      </div>
    </LanguageProvider>
  )
}
