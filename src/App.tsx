import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-navy-300">
      <ScrollToHash />
      <Navbar />
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
