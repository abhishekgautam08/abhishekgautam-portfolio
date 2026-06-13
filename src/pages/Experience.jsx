import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { experience, education } from '../data/portfolioData'

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
            {/* Work Experience */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">💼</span>
                Work Experience
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 timeline-line" />
                <div className="space-y-8">
                  {experience.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="pl-12 relative"
                    >
                      <div className="absolute left-0 top-1 w-9 h-9 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: exp.color, background: exp.color + '22' }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: exp.color }} />
                      </div>
                      <div className="glass rounded-2xl p-5 border border-white/5 card-hover"
                        style={{ borderColor: exp.color + '22' }}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-bold text-white">{exp.role}</h4>
                            <p className="text-sm" style={{ color: exp.color }}>{exp.company}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">{exp.period}</span>
                            <span className="block text-xs px-2 py-0.5 rounded-full mt-1"
                              style={{ background: exp.color + '22', color: exp.color }}>
                              {exp.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{exp.description}</p>
                        <ul className="space-y-1.5 mb-4">
                          {exp.achievements.map((a, ai) => (
                            <li key={ai} className="flex items-start gap-2 text-xs text-gray-300">
                              <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: exp.color }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.tech.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded text-xs bg-dark-200 text-gray-300 border border-white/5">{t}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">🎓</span>
                Education
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #00D4FF, #FF6B9D)' }} />
                <div className="space-y-8">
                  {education.map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="pl-12 relative"
                    >
                      <div className="absolute left-0 top-1 w-9 h-9 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: edu.color, background: edu.color + '22' }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: edu.color }} />
                      </div>
                      <div className="glass rounded-2xl p-5 border border-white/5 card-hover">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-white text-sm">{edu.degree}</h4>
                            <p className="text-sm" style={{ color: edu.color }}>{edu.institution}</p>
                          </div>
                          <span className="text-xs text-gray-500">{edu.period}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{edu.description}</p>
                        <span className="text-xs px-3 py-1 rounded-full"
                          style={{ background: edu.color + '22', color: edu.color }}>
                          {edu.grade}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">🏆</span>
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '💰', text: 'Managed $2M+ in blockchain transactions' },
                    { icon: '👥', text: 'Served 100K+ users across multiple platforms' },
                    { icon: '⭐', text: 'Maintained 5-star rating on freelance platforms' },
                    { icon: '🚀', text: 'Reduced deployment time by 80% with CI/CD' },
                    { icon: '📈', text: 'Improved app performance by 60%' },
                    { icon: '🌍', text: 'Delivered projects to 10+ countries' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-3 glass rounded-xl p-3 border border-white/5"
                    >
                      <span className="text-xl">{item.icon}</span>
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
