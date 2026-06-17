import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { certifications } from '../data/portfolioData'

const stats = [
  { label: 'Total Certifications', value: certifications.length, icon: '🏆' },
  { label: 'Cloud Certifications', value: 3, icon: '☁️' },
  { label: 'Blockchain Certs', value: 2, icon: '⛓️' },
  { label: 'Dev Certifications', value: 3, icon: '💻' },
]

export default function Certifications() {
  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Credentials"
            title="Certifications"
            subtitle="Professional certifications validating my expertise"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -8, boxShadow: `0 20px 48px ${cert.color}22` }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-white/15 group relative overflow-hidden transition-all duration-300"
              >
                {/* Top gradient accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }}
                />

                {/* Background color bloom on hover */}
                <motion.div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none"
                  style={{ background: cert.color }}
                  initial={{ opacity: 0.04 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-4xl mb-4 inline-block"
                >
                  {cert.icon}
                </motion.div>

                <h3 className="font-bold text-white text-sm mb-2 leading-snug">{cert.title}</h3>
                <p className="text-xs mb-3 font-bold" style={{ color: cert.color }}>{cert.issuer}</p>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{cert.description}</p>

                <div className="border-t border-white/5 pt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Issued</span>
                    <span className="text-xs text-gray-300">{cert.date}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">ID</span>
                    <span className="text-xs font-mono text-gray-400 truncate">{cert.credentialId}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-400"
                  />
                  <span className="text-xs text-green-400 font-medium">Verified</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -6, boxShadow: '0 14px 36px rgba(108,99,255,0.15)' }}
                className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-primary/20 transition-all duration-300 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-3xl mb-3 inline-block"
                >
                  {s.icon}
                </motion.div>
                <div className="text-3xl font-black gradient-text mb-1">{s.value}+</div>
                <p className="text-gray-400 text-xs leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
