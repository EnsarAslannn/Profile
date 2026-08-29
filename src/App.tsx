import { Navigate, Route, Routes } from 'react-router-dom'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import PageBackdrop from './components/PageBackdrop'
import ScrollToHash from './components/ScrollToHash'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export default function App() {
  return (
    <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
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
  )
}
