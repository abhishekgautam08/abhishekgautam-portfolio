import { motion } from 'framer-motion'
import { FiDownload, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import { personalInfo, education, experience } from '../data/portfolioData'

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

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
                <div className="relative h-full rounded-3xl glass border border-primary/20 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="text-9xl mb-4">👨‍💻</div>
                    <h3 className="text-2xl font-bold gradient-text">Abhishek Gautam</h3>
                    <p className="text-gray-400 mt-2">Full Stack Developer</p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-sm">
                      <FiMapPin className="text-primary" /> {personalInfo.location}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-3xl border border-dashed border-primary/10"
                />
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">
                <span className="gradient-text">Full Stack Developer</span> who loves to build for the web
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6" />
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>{personalInfo.bio}</p>
                <p>{personalInfo.longBio.split('\n\n')[1]}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-8">
                {[
                  { label: 'Name', value: personalInfo.name },
                  { label: 'Email', value: personalInfo.email, icon: <FiMail /> },
                  { label: 'Phone', value: personalInfo.phone, icon: <FiPhone /> },
                  { label: 'Location', value: personalInfo.location, icon: <FiMapPin /> },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      {item.icon && <span className="text-primary">{item.icon}</span>}
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="https://drive.google.com/file/d/1Z_BTMgBt8LwoBFfIFMiSsA3cq1BAtwK_/view?usp=sharing"
                download
                className="btn-primary inline-flex items-center gap-2"
              >
                <span className="flex items-center gap-2"><FiDownload /> Download Resume</span>
              </a>
            </motion.div>
          </div>

          {/* Education */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 text-center">
              <span className="gradient-text">Education</span> Journey
            </h3>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 timeline-line hidden md:block" />
              <div className="space-y-8">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`md:w-5/12 ${i % 2 === 0 ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'}`}
                  >
                    <div className="glass rounded-2xl p-6 border border-white/5 card-hover"
                      style={{ borderColor: edu.color + '33' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white">{edu.degree}</h4>
                          <p className="text-sm" style={{ color: edu.color }}>{edu.institution}</p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">{edu.period}</span>
                      </div>
                      <p className="text-sm text-gray-400">{edu.description}</p>
                      <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full"
                        style={{ background: edu.color + '22', color: edu.color }}>
                        {edu.grade}
                      </span>
                    </div>
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
