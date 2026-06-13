import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { projects } from '../data/portfolioData'

const categories = ['All', 'Full Stack', 'Blockchain', 'AI']

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

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-primary to-secondary text-white neon-glow'
                    : 'glass border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl overflow-hidden border border-white/5 group cursor-pointer card-hover"
                  onClick={() => setSelected(project)}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/40 to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ background: project.color + '33', color: project.color, border: `1px solid ${project.color}44` }}>
                      {project.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-semibold bg-dark-400/80 px-4 py-2 rounded-xl">View Details</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 4).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        className="flex-1 py-2 rounded-lg glass text-center text-xs text-gray-400 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-1">
                        <FiGithub /> Code
                      </a>
                      <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        className="flex-1 py-2 rounded-lg btn-primary text-center text-xs flex items-center justify-center gap-1">
                        <span className="flex items-center gap-1"><FiExternalLink /> Live</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary/20"
            >
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl glass flex items-center justify-center text-white hover:text-primary"
                >
                  <FiX />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{selected.title}</h3>
                  <span className="px-3 py-1 rounded-full text-sm" style={{ background: selected.color + '33', color: selected.color }}>
                    {selected.category}
                  </span>
                </div>
                <p className="text-gray-300 mb-6">{selected.description}</p>
                <div className="mb-5">
                  <h4 className="font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {selected.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-gray-400 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: selected.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.tech.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg glass border border-primary/20 text-sm text-primary">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={selected.github} target="_blank" rel="noreferrer"
                    className="flex-1 py-3 rounded-xl glass text-center text-gray-300 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                    <FiGithub /> View Code
                  </a>
                  <a href={selected.live} target="_blank" rel="noreferrer"
                    className="flex-1 py-3 rounded-xl btn-primary text-center flex items-center justify-center gap-2">
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
