import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { personalInfo } from '../data/portfolioData'

// Floating-label field component (kept for potential future use)
function Field({ label, name, value, onChange, type = 'text', required, placeholder, rows }) {
  const isTextarea = !!rows
  const Tag = isTextarea ? 'textarea' : 'input'

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-400 mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <Tag
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-600 text-sm bg-transparent resize-none input-focus-glow transition-all duration-300"
        style={{ outline: 'none' }}
      />
    </div>
  )
}

export default function Contact() {
  const contactInfo = [
    { icon: <FiMail size={20} />, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: '#6C63FF' },
    { icon: <FiPhone size={20} />, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}`, color: '#00D4FF' },
    { icon: <FiMapPin size={20} />, label: 'Location', value: personalInfo.location, href: '#', color: '#FF6B9D' },
  ]

  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Get In Touch"
            title="Let's Work Together"
            subtitle="Have a project in mind? I'd love to hear about it."
          />

          <div className="max-w-2xl mx-auto">
            {/* ===== Info column ===== */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                I'm just a <span className="gradient-text">message away</span>
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Whether you have a project in mind, want to discuss opportunities, or just want to say hi — my inbox is always open. I'll try my best to get back to you!
              </p>

              {/* Contact cards */}
              <div className="space-y-3 mb-8">
                {contactInfo.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ x: 6, boxShadow: `0 8px 24px ${item.color}22` }}
                    className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: item.color + '1A', color: item.color, boxShadow: `0 0 12px ${item.color}22` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social links — magnetic effect */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">Find me on social media</p>
                <div className="flex gap-3">
                  {[
                    { icon: <FiGithub size={18} />, href: personalInfo.github, label: 'GitHub' },
                    { icon: <FiLinkedin size={18} />, href: personalInfo.linkedin, label: 'LinkedIn' },
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      whileHover={{ scale: 1.15, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Location card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-white/5 h-40 flex items-center justify-center relative overflow-hidden"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
                </motion.div>
                <div className="text-center text-gray-500 relative z-10">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <FiMapPin className="text-4xl text-primary mx-auto mb-2" />
                  </motion.div>
                  <p className="text-sm text-gray-300">Jaipur, Rajasthan</p>
                  <p className="text-xs text-gray-500 mt-1">Available for remote work worldwide</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  )
}
