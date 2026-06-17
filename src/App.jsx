import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollToTop from './components/ScrollToTop'
import LoadingScreen from './components/LoadingScreen'
import ParticleBackground from './components/ParticleBackground'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Services from './pages/Services'
import Experience from './pages/Experience'
import Certifications from './pages/Certifications'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import './index.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Persist preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  if (loading) return <LoadingScreen />

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'bg-dark-400' : 'bg-gray-50'} transition-colors duration-300`}>
        <ParticleBackground />
        <CustomCursor />
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/services" element={<Services />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  )
}

export default App
