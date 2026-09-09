import { motion } from 'framer-motion'
import { FiDownload, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { personalInfo, education } from '../data/portfolioData'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function About() {
  return (
    <div className="relative z-10 pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="About Me"
            title="Who I Am"
            subtitle="Passionate developer crafting digital experiences"
          />

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Profile card — floating with glow pulse */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                {/* Glow behind card */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/25 to-secondary/25 blur-3xl"
                />

                {/* Card itself — floating */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-full rounded-3xl glass border border-primary/20 flex items-center justify-center overflow-hidden glow-pulse"
                >
                  {/* Inner mesh gradient */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 30%, rgba(108,99,255,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,212,255,0.2) 0%, transparent 60%)',
                    }}
                  />
                  <div className="text-center p-8 relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-9xl mb-4 select-none"
                    >
                      👨‍💻
                    </motion.div>
                    <h3 className="text-2xl font-bold gradient-text">{personalInfo.name}</h3>
                    <p className="text-gray-400 mt-2">Full Stack Developer</p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-sm">
                      <FiMapPin className="text-primary" /> {personalInfo.location}
                    </div>
                  </div>
                </motion.div>

                {/* Rotating dashed frame */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-5 rounded-3xl border border-dashed border-primary/12"
                />
              </div>
            </motion.div>

            {/* Right text content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold mb-2">
                <span className="gradient-text">Full Stack Developer</span> who loves to build for the web
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6" />
              <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
                <p>{personalInfo.bio}</p>
                <p>{personalInfo.longBio.split('\n\n')[1]}</p>
              </div>

              {/* Info cards — staggered entrance with hover lift */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {[
                  { label: 'Name', value: personalInfo.name },
                  { label: 'Email', value: personalInfo.email, icon: <FiMail /> },
                  { label: 'Phone', value: personalInfo.phone, icon: <FiPhone /> },
                  { label: 'Location', value: personalInfo.location, icon: <FiMapPin /> },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariant}
                    whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(108,99,255,0.15)' }}
                    className="glass rounded-xl p-3.5 border border-white/5 hover:border-primary/25 transition-all cursor-default"
                  >
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm text-white flex items-center gap-1.5 truncate">
                      {item.icon && <span className="text-primary shrink-0">{item.icon}</span>}
                      <span className="truncate">{item.value}</span>
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.a
                href="https://drive.google.com/file/d/1Z_BTMgBt8LwoBFfIFMiSsA3cq1BAtwK_/view?usp=sharing"
                download
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary inline-flex items-center gap-2 magnetic-btn"
              >
                <span className="flex items-center gap-2"><FiDownload /> Download Resume</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Education Timeline */}
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-12 text-center"
            >
              <span className="gradient-text">Education</span> Journey
            </motion.h3>

            <div className="relative">
              {/* Animated vertical line */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
                className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 timeline-line hidden md:block"
              />

              <div className="space-y-10">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`md:w-5/12 ${i % 2 === 0 ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'} relative`}
                  >
                    {/* Timeline dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 400 }}
                      className="hidden md:block absolute top-6 w-4 h-4 rounded-full border-2"
                      style={{
                        borderColor: edu.color,
                        background: edu.color + '33',
                        [i % 2 === 0 ? 'right' : 'left']: '-2rem',
                        transform: 'translateX(50%)',
                        boxShadow: `0 0 10px ${edu.color}66`,
                      }}
                    />

                    <motion.div
                      whileHover={{ y: -6, boxShadow: `0 16px 40px ${edu.color}22` }}
                      className="glass rounded-2xl p-6 border transition-all duration-300"
                      style={{ borderColor: edu.color + '33' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white">{edu.degree}</h4>
                          <p className="text-sm font-medium mt-0.5" style={{ color: edu.color }}>
                            {edu.institution}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-2 mt-0.5">{edu.period}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{edu.description}</p>
                      <span
                        className="inline-block mt-4 text-xs px-3 py-1 rounded-full font-semibold"
                        style={{ background: edu.color + '22', color: edu.color }}
                      >
                        {edu.grade}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
