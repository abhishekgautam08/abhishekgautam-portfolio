import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import { certifications } from '../data/portfolioData'

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
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/5 card-hover relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent"
                  style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }} />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{ background: cert.color }} />

                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2 leading-snug">{cert.title}</h3>
                <p className="text-xs mb-3 font-semibold" style={{ color: cert.color }}>{cert.issuer}</p>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{cert.description}</p>

                <div className="border-t border-white/5 pt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Issued</span>
                    <span className="text-xs text-gray-300">{cert.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ID</span>
                    <span className="text-xs font-mono text-gray-400 truncate ml-2">{cert.credentialId}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Verified</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total Certifications', value: certifications.length, icon: '🏆' },
              { label: 'Cloud Certifications', value: 3, icon: '☁️' },
              { label: 'Blockchain Certs', value: 2, icon: '⛓️' },
              { label: 'Dev Certifications', value: 3, icon: '💻' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-white/5"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-black gradient-text mb-1">{s.value}+</div>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
