import { motion } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { services } from '../data/portfolioData'

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-6 border border-white/5 card-hover group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheck className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <Link to="/contact" className="text-sm flex items-center gap-1 text-primary hover:gap-2 transition-all">
                    Get Started <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-12">
              My <span className="gradient-text">Development Process</span>
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Discovery', desc: 'Understanding requirements, goals, and defining the project scope.', icon: '🔍' },
                { step: '02', title: 'Planning', desc: 'Architecture design, tech stack selection, and timeline planning.', icon: '📐' },
                { step: '03', title: 'Development', desc: 'Clean code implementation with best practices and regular updates.', icon: '💻' },
                { step: '04', title: 'Delivery', desc: 'Testing, deployment, optimization and post-launch support.', icon: '🚀' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-white/5 text-center relative"
                >
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 glass rounded-3xl p-12 text-center border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your <span className="gradient-text">Project</span>?
              </h2>
              <p className="text-gray-400 mb-8">
                Let's discuss your requirements and build something amazing together.
              </p>
              <Link to="/contact" className="btn-primary px-8 py-4 text-lg">
                <span>Start a Project</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
