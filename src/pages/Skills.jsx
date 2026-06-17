import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { skills } from '../data/portfolioData'

const categories = [
  { key: 'frontend', label: 'Frontend', emoji: '🎨' },
  { key: 'backend', label: 'Backend', emoji: '⚙️' },
  { key: 'database', label: 'Database', emoji: '🗄️' },
  { key: 'cloud', label: 'Cloud & DevOps', emoji: '☁️' },
  { key: 'ai', label: 'AI & Scripting', emoji: '🤖' },
  { key: 'tools', label: 'Tools', emoji: '🛠️' },
]

export default function Skills() {
  const [activeTab, setActiveTab] = useState('frontend')

  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="My Expertise"
            title="Technical Skills"
            subtitle="Technologies and tools I use to bring ideas to life"
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <motion.button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === cat.key
                    ? 'bg-gradient-to-r from-primary to-secondary text-white neon-glow'
                    : 'glass border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Skills Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-4 mb-20"
          >
            {skills[activeTab].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5 border border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: skill.color + '22' }}>
                      <span style={{ color: skill.color }}>◆</span>
                    </div>
                    <span className="font-semibold text-white">{skill.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.2, ease: 'easeOut' }}
                    className="h-full rounded-full progress-bar"
                    style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* All Skills Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Complete <span className="gradient-text">Tech Stack</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, ci) => (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.1 }}
                  className="glass rounded-2xl p-4 border border-white/5"
                >
                  <div className="text-2xl mb-2">{cat.emoji}</div>
                  <h4 className="text-sm font-bold text-white mb-3">{cat.label}</h4>
                  <div className="space-y-1.5">
                    {skills[cat.key].slice(0, 4).map(skill => (
                      <div key={skill.name} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: skill.color }} />
                        <span className="text-xs text-gray-400">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
