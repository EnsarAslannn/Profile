import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import PageBackdrop from './components/PageBackdrop'
import ScrollToHash from './components/ScrollToHash'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export default function App() {
  return (
    <div className="relative isolate min-h-screen bg-surface-base text-ink-body">
      <PageBackdrop />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 xl:px-12">
        <Footer />
      </div>
    </div>
  )
}
