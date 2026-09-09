import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { experience, education } from '../data/portfolioData'

const achievements = [
  { icon: '💰', text: 'Managed $2M+ in blockchain transactions' },
  { icon: '👥', text: 'Served 100K+ users across multiple platforms' },
  { icon: '⭐', text: 'Maintained 5-star rating on freelance platforms' },
  { icon: '🚀', text: 'Reduced deployment time by 80% with CI/CD' },
  { icon: '📈', text: 'Improved app performance by 60%' },
  { icon: '🌍', text: 'Delivered projects to 10+ countries' },
]

export default function Experience() {
  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Career Journey"
            title="Experience & Education"
            subtitle="My professional journey and academic background"
          />

          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            {/* ===== Work Experience ===== */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  💼
                </span>
                Work Experience
              </h3>

              <div className="relative">
                {/* Animated timeline line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top' }}
                  className="absolute left-4 top-0 bottom-0 w-0.5 timeline-line"
                />

                <div className="space-y-8">
                  {experience.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.55 }}
                      className="pl-14 relative"
                    >
                      {/* Timeline dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 400 }}
                        className="absolute left-0 top-2 w-9 h-9 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: exp.color,
                          background: exp.color + '22',
                          boxShadow: `0 0 12px ${exp.color}44`,
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: exp.color, boxShadow: `0 0 6px ${exp.color}` }}
                        />
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5, boxShadow: `0 16px 40px ${exp.color}18` }}
                        className="glass rounded-2xl p-5 border transition-all duration-300"
                        style={{ borderColor: exp.color + '28' }}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-bold text-white">{exp.role}</h4>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: exp.color }}>
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-gray-500">{exp.period}</span>
                            <span
                              className="block text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
                              style={{ background: exp.color + '22', color: exp.color }}
                            >
                              {exp.type}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exp.description}</p>

                        {/* Achievements — staggered */}
                        <ul className="space-y-1.5 mb-4">
                          {exp.achievements.map((a, ai) => (
                            <motion.li
                              key={ai}
                              initial={{ opacity: 0, x: -12 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 + ai * 0.04 }}
                              className="flex items-start gap-2 text-xs text-gray-300"
                            >
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: exp.color }}
                              />
                              {a}
                            </motion.li>
                          ))}
                        </ul>

                        {/* Tech badges with hover glow */}
                        <div className="flex flex-wrap gap-1.5">
                          {exp.tech.map(t => (
                            <motion.span
                              key={t}
                              whileHover={{ scale: 1.08, boxShadow: `0 0 10px ${exp.color}44` }}
                              className="px-2 py-0.5 rounded text-xs bg-dark-200 text-gray-300 border border-white/5 cursor-default transition-colors hover:border-white/20"
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Education + Achievements ===== */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                  🎓
                </span>
                Education
              </h3>

              <div className="relative">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top', background: 'linear-gradient(180deg, #00D4FF, #FF6B9D)' }}
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                />

                <div className="space-y-8">
                  {education.map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.55 }}
                      className="pl-14 relative"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 400 }}
                        className="absolute left-0 top-2 w-9 h-9 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: edu.color,
                          background: edu.color + '22',
                          boxShadow: `0 0 12px ${edu.color}44`,
                        }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ background: edu.color }} />
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5, boxShadow: `0 16px 40px ${edu.color}18` }}
                        className="glass rounded-2xl p-5 border border-white/5 transition-all duration-300"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-white text-sm">{edu.degree}</h4>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: edu.color }}>
                              {edu.institution}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">{edu.period}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">{edu.description}</p>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background: edu.color + '22', color: edu.color }}
                        >
                          {edu.grade}
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-12"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                    🏆
                  </span>
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      whileHover={{ x: 6, boxShadow: '0 8px 24px rgba(108,99,255,0.12)' }}
                      className="flex items-center gap-3 glass rounded-xl p-3.5 border border-white/5 hover:border-primary/20 transition-all cursor-default"
                    >
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <span className="text-gray-300 text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
