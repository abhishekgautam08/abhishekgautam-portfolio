import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiDownload, FiArrowRight } from 'react-icons/fi'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import TypeWriter from '../components/TypeWriter'
import { personalInfo, stats, typingTexts, projects, skills } from '../data/portfolioData'

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function Home() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 section-padding bg-mesh">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300">Available for Work</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
              >
                Hi, I'm{' '}
                <span className="gradient-text text-shadow-glow block">
                  Abhishek
                </span>
                <span className="text-white">Gautam</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-300 mb-6 h-10"
              >
                <TypeWriter texts={typingTexts} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                {personalInfo.bio}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link to="/contact" className="btn-primary flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    Hire Me <FiArrowRight />
                  </span>
                </Link>
                <a
                  href="/resume.pdf"
                  download
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiDownload /> Download CV
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4"
              >
                {[
                  { icon: <FiGithub />, href: personalInfo.github },
                  { icon: <FiLinkedin />, href: personalInfo.linkedin },
                  { icon: <FiTwitter />, href: personalInfo.twitter },
                  { icon: <FiMail />, href: `mailto:${personalInfo.email}` },
                ].map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl animate-pulse-slow" />
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-primary/30 neon-glow">
                  <div className="w-full h-full bg-gradient-to-br from-dark-200 to-dark-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-2">👨‍💻</div>
                      <p className="text-gray-400 text-sm">Full Stack Developer</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                />
                {['React', 'Node.js', 'Web3', 'AI'].map((tech, i) => {
                  const angle = (i * 90 * Math.PI) / 180
                  const x = 50 + 50 * Math.cos(angle)
                  const y = 50 + 50 * Math.sin(angle)
                  return (
                    <motion.div
                      key={tech}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full glass border border-primary/30 text-xs font-semibold text-primary whitespace-nowrap"
                    >
                      {tech}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-6 text-center border border-white/5 card-hover"
              >
                <div className="text-4xl font-black gradient-text mb-2">
                  {inView ? (
                    <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                  ) : '0'}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Featured <span className="gradient-text">Projects</span>
              </h2>
            </div>
            <Link to="/projects" className="btn-secondary text-sm flex items-center gap-2">
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: project.color + '33', color: project.color, border: `1px solid ${project.color}33` }}>
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="flex-1 py-2 rounded-lg glass text-center text-sm text-gray-400 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-1">
                      <FiGithub /> Code
                    </a>
                    <a href={project.live} target="_blank" rel="noreferrer"
                      className="flex-1 py-2 rounded-lg btn-primary text-center text-sm flex items-center justify-center gap-1">
                      <span className="flex items-center gap-1">Live <FiArrowRight /></span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="section-padding bg-dark-200/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Technologies I <span className="gradient-text">Work With</span>
            </h2>
            <p className="text-gray-400">My technical stack across frontend, backend, and blockchain</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {[...skills.frontend, ...skills.backend, ...skills.blockchain].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-4 py-2 rounded-xl glass border border-white/10 hover:border-primary/30 transition-all cursor-default"
                style={{ '--skill-color': skill.color }}
              >
                <span className="text-sm font-medium" style={{ color: skill.color }}>{skill.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/skills" className="btn-secondary inline-flex items-center gap-2">
              View All Skills <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Have a project in mind? I'm available for freelance and full-time positions.
              </p>
              <Link to="/contact" className="btn-primary text-lg px-8 py-4">
                <span>Get In Touch</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
