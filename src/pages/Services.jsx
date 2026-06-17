import { motion } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { services } from '../data/portfolioData'

const processSteps = [
  { step: '01', title: 'Discovery', desc: 'Understanding requirements, goals, and defining the project scope.', icon: '🔍' },
  { step: '02', title: 'Planning', desc: 'Architecture design, tech stack selection, and timeline planning.', icon: '📐' },
  { step: '03', title: 'Development', desc: 'Clean code implementation with best practices and regular updates.', icon: '💻' },
  { step: '04', title: 'Delivery', desc: 'Testing, deployment, optimization and post-launch support.', icon: '🚀' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

export default function Services() {
  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="What I Do"
            title="Services I Provide"
            subtitle="Comprehensive development services from concept to deployment"
          />

          {/* Service cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {services.map((service, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: '0 20px 48px rgba(108,99,255,0.18)' }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/25 group relative overflow-hidden transition-all duration-300 gradient-border-animated"
              >
                {/* Top accent line — animated on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Background glow blob */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-8 transition-opacity duration-500 blur-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.4), transparent)' }}
                />

                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-4xl mb-4 inline-block"
                >
                  {service.icon}
                </motion.div>

                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((f, fi) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + fi * 0.04 }}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <span className="shrink-0 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                        <FiCheck size={10} className="text-primary" />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-white/5">
                  <Link
                    to="/contact"
                    className="text-sm flex items-center gap-1.5 text-primary font-semibold group/link"
                  >
                    <span className="group-hover/link:underline">Get Started</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FiArrowRight size={14} />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Process timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-12">
              My <span className="gradient-text">Development Process</span>
            </h3>
            <div className="grid md:grid-cols-4 gap-6 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary via-secondary to-accent opacity-20 pointer-events-none" />

              {processSteps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6, boxShadow: '0 14px 36px rgba(108,99,255,0.14)' }}
                  className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/20 text-center relative transition-all duration-300"
                >
                  {/* Step badge */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-black text-white neon-glow"
                  >
                    {item.step}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-4xl mb-4 inline-block"
                  >
                    {item.icon}
                  </motion.div>
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
