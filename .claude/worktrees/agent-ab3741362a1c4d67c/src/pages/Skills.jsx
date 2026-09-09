import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
}

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

          {/* Category Tabs — with layoutId shared element transition */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => {
              const isActive = activeTab === cat.key
              return (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center gap-2 relative ${
                    isActive
                      ? 'text-white'
                      : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-primary/30'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="skillTabBg"
                      className="absolute inset-0 rounded-xl neon-glow"
                      style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{cat.emoji}</span>
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Skills Grid — staggered entrance, glow on hover */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20"
            >
              {skills[activeTab].map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariant}
                  whileHover={{
                    y: -5,
                    boxShadow: `0 12px 28px ${skill.color}28`,
                    borderColor: skill.color + '55',
                  }}
                  className="glass rounded-2xl p-4 border border-white/5 transition-all cursor-default group"
                >
                  {/* Icon badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: skill.color + '1A' }}
                  >
                    <span
                      className="text-lg font-black"
                      style={{ color: skill.color }}
                    >
                      {skill.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-white text-sm">{skill.name}</span>
                  {/* Bottom accent line */}
                  <div
                    className="mt-3 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${skill.color}, transparent)` }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* All Skills Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-10">
              Complete <span className="gradient-text">Tech Stack</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, ci) => (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.08, duration: 0.45 }}
                  whileHover={{ y: -6, boxShadow: '0 14px 32px rgba(108,99,255,0.15)' }}
                  className="glass rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-default group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {cat.emoji}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-3 leading-tight">{cat.label}</h4>
                  <div className="space-y-1.5">
                    {skills[cat.key].slice(0, 4).map(skill => (
                      <div key={skill.name} className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: skill.color }}
                        />
                        <span className="text-xs text-gray-400 truncate">{skill.name}</span>
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
