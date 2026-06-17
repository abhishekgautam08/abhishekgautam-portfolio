import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiArrowRight, FiTag, FiX, FiCalendar } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { blogs } from '../data/portfolioData'

const categories = ['All', 'Architecture', 'Backend', 'AI', 'Cloud', 'Fintech']

export default function Blog() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? blogs : blogs.filter(b => b.category === filter)

  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="My Blog"
            title="Latest Articles"
            subtitle="Sharing knowledge and insights from my development journey"
          />

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-primary to-secondary text-white neon-glow'
                    : 'glass border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 card-hover group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: blog.color + '33', color: blog.color, border: `1px solid ${blog.color}44` }}>
                    {blog.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><FiCalendar /> {blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FiClock /> {blog.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {blog.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 px-2 py-0.5 rounded bg-white/5">
                        <FiTag className="text-primary" /> {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelected(blog)}
                    className="text-sm flex items-center gap-1 text-primary hover:gap-2 transition-all font-medium"
                  >
                    Read More <FiArrowRight />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-dark-300 rounded-3xl border border-white/10 overflow-hidden my-4"
            >
              {/* Hero image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/40 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <FiX />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: selected.color + '33', color: selected.color, border: `1px solid ${selected.color}44` }}>
                    {selected.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FiCalendar /> {selected.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FiClock /> {selected.readTime}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  {selected.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 rounded bg-white/5 border border-white/10">
                      <FiTag className="text-primary" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none">
                  {selected.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed mb-5 text-sm md:text-base">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                      AG
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Abhishek Gautam</p>
                      <p className="text-gray-500 text-xs">Full Stack Developer</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <FiX /> Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
