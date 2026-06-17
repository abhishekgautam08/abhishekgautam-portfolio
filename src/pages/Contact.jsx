import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import SectionHeader from '../components/SectionHeader'
import { personalInfo } from '../data/portfolioData'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState({ loading: false, success: false, error: false })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: false })
    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      )
      setStatus({ loading: false, success: true, error: false })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({ loading: false, success: false, error: true })
    }
  }

  const contactInfo = [
    { icon: <FiMail className="text-xl" />, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: '#6C63FF' },
    { icon: <FiPhone className="text-xl" />, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}`, color: '#00D4FF' },
    { icon: <FiMapPin className="text-xl" />, label: 'Location', value: personalInfo.location, href: '#', color: '#FF6B9D' },
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

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">
                I'm just a <span className="gradient-text">message away</span>
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Whether you have a project in mind, want to discuss opportunities, or just want to say hi — my inbox is always open. I'll try my best to get back to you!
              </p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: item.color + '22', color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-4">Find me on social media</p>
                <div className="flex gap-3">
                  {[
                    { icon: <FiGithub />, href: personalInfo.github, label: 'GitHub' },
                    { icon: <FiLinkedin />, href: personalInfo.linkedin, label: 'LinkedIn' },
                    { icon: <FiTwitter />, href: personalInfo.twitter, label: 'Twitter' },
                    { icon: <FiMail />, href: `mailto:${personalInfo.email}`, label: 'Email' },
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
                      title={s.label}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 glass rounded-2xl p-6 border border-white/5 h-40 flex items-center justify-center"
              >
                <div className="text-center text-gray-500">
                  <FiMapPin className="text-4xl text-primary mx-auto mb-2" />
                  <p className="text-sm">Jaipur, Rajasthan 🇮🇳</p>
                  <p className="text-xs text-gray-600 mt-1">Available for remote work worldwide</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form ref={formRef} onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5">
                <h3 className="text-xl font-bold mb-6 gradient-text">Send a Message</h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Your Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 text-white placeholder-gray-600 outline-none transition-colors text-sm bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Your Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 text-white placeholder-gray-600 outline-none transition-colors text-sm bg-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-2">Subject *</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Project Discussion"
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 text-white placeholder-gray-600 outline-none transition-colors text-sm bg-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-gray-400 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 text-white placeholder-gray-600 outline-none transition-colors text-sm bg-transparent resize-none"
                  />
                </div>

                {status.success && (
                  <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                    Message sent successfully! I'll get back to you soon. 🎉
                  </div>
                )}
                {status.error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    Something went wrong. Please try again or email me directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="flex items-center gap-2">
                    {status.loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><FiSend /> Send Message</>
                    )}
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
