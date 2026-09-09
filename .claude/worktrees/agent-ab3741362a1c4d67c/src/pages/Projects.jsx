import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { projects } from '../data/portfolioData'

const categories = ['All', 'Full Stack', 'Blockchain', 'AI']

// 3D tilt card hook
function use3DTilt() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}

function ProjectCard({ project, index, onClick }) {
  const tilt = use3DTilt()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -10 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{ perspective: 1000 }}
      onClick={onClick}
    >
      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.handleMouseMove}
        onMouseLeave={tilt.handleMouseLeave}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        className="glass rounded-2xl overflow-hidden border border-white/5 group cursor-pointer gradient-border-animated"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/30 to-transparent" />
          {/* Color overlay on hover */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.18 }}
            transition={{ duration: 0.3 }}
            style={{ background: project.color }}
          />
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: project.color + '33', color: project.color, border: `1px solid ${project.color}55` }}
          >
            {project.category}
          </div>
          {/* View details hover overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-white font-semibold glass-dark px-4 py-2 rounded-xl border border-white/20">
              View Details
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-1 py-2 rounded-lg glass text-center text-xs text-gray-400 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-1"
            >
              <FiGithub /> Code
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-1 py-2 rounded-lg btn-primary text-center text-xs flex items-center justify-center gap-1"
            >
              <span className="flex items-center gap-1"><FiExternalLink /> Live</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="My Work"
            title="Featured Projects"
            subtitle="A collection of projects showcasing my expertise across different domains"
          />

          {/* Filter tabs with layoutId */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => {
              const isActive = filter === cat
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 relative ${
                    isActive ? 'text-white' : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-primary/30'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="filterTabBg"
                      className="absolute inset-0 rounded-xl neon-glow"
                      style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              )
            })}
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelected(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="glass-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary/25"
              style={{ boxShadow: `0 32px 80px ${selected.color}22` }}
            >
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent" />
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl glass border border-white/20 flex items-center justify-center text-white hover:text-primary transition-colors"
                >
                  <FiX />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{selected.title}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-semibold shrink-0 ml-3"
                    style={{ background: selected.color + '33', color: selected.color }}
                  >
                    {selected.category}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">{selected.description}</p>
                <div className="mb-5">
                  <h4 className="font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {selected.features.map(f => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-gray-400 text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selected.color }} />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.tech.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg glass border border-primary/20 text-sm text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl glass text-center text-gray-300 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <FiGithub /> View Code
                  </a>
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl btn-primary text-center flex items-center justify-center gap-2"
                  >
                    <span className="flex items-center gap-2"><FiExternalLink /> Live Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
