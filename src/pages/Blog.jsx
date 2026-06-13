import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiArrowRight, FiTag } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { blogs } from '../data/portfolioData'

const categories = ['All', 'Frontend', 'Full Stack', 'Blockchain', 'Cloud', 'Backend', 'AI']

export default function Blog() {
  const [filter, setFilter] = useState('All')

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
                    <span>{blog.date}</span>
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
                  <button className="text-sm flex items-center gap-1 text-primary hover:gap-2 transition-all font-medium">
                    Read More <FiArrowRight />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="btn-secondary px-8 py-3 flex items-center gap-2 mx-auto">
              View All Articles <FiArrowRight />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
