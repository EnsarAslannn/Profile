import Contact from './components/Contact'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Resume from './components/Resume'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6">
        <Hero />
        <Resume />
        <Projects />
        <Contact />
      </main>
      <div className="mx-auto max-w-5xl px-6">
        <Footer />
      </div>
    </div>
  )
}
