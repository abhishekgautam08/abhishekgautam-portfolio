import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiDownload, FiArrowRight } from 'react-icons/fi'
import TypeWriter from '../components/TypeWriter'
import { personalInfo, typingTexts, projects, skills } from '../data/portfolioData'

// Shared animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// 3D tilt card hook
function useTilt() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}

// Individual 3D project card
function ProjectCard({ project, delay }) {
  const tilt = useTilt()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.handleMouseMove}
        onMouseLeave={tilt.handleMouseLeave}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
        className="glass rounded-2xl overflow-hidden border border-white/5 group gradient-border-animated cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/20 to-transparent" />
          {/* Color overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ background: project.color }}
          />
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: project.color + '33', color: project.color, border: `1px solid ${project.color}44` }}
          >
            {project.category}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map(t => (
              <span key={t} className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 rounded-lg glass text-center text-sm text-gray-400 hover:text-white border border-white/10 hover:border-primary/30 transition-all flex items-center justify-center gap-1"
            >
              <FiGithub /> Code
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 rounded-lg btn-primary text-center text-sm flex items-center justify-center gap-1"
            >
              <span className="flex items-center gap-1">Live <FiArrowRight /></span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Orbiting tech badge
function OrbitBadge({ tech, index, total }) {
  const angle = (index / total) * 2 * Math.PI
  const radius = 50
  const x = 50 + radius * Math.cos(angle)
  const y = 50 + radius * Math.sin(angle)

  return (
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      style={{ left: `${x}%`, top: `${y}%`, animation: 'orbit-glow-pulse 3s ease-in-out infinite' }}
      className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full glass-dark border border-primary/40 text-xs font-semibold text-primary whitespace-nowrap"
    >
      {tech}
    </motion.div>
  )
}

export default function Home() {
  const orbitTechs = ['React', 'Node.js', 'AWS', 'AI']

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 section-padding bg-mesh relative overflow-hidden">
        {/* Animated dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(108,99,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gradient mesh blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={fadeUpVariant}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
              >
                Hi, I'm{' '}
                <span className="shimmer-text block">Abhishek</span>
                <span className="text-white">Gautam</span>
              </motion.h1>

              <motion.div
                variants={fadeUpVariant}
                className="text-2xl md:text-3xl font-bold text-gray-300 mb-6 h-10"
              >
                <TypeWriter texts={typingTexts} />
              </motion.div>

              <motion.p
                variants={fadeUpVariant}
                className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                {personalInfo.bio}
              </motion.p>

              <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 mb-8">
                <motion.a
                  href="https://drive.google.com/file/d/1Z_BTMgBt8LwoBFfIFMiSsA3cq1BAtwK_/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary flex items-center gap-2 magnetic-btn"
                >
                  <FiDownload /> Download Resume
                </motion.a>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex items-center gap-4">
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
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right profile circle */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Outer glow */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-6 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl"
                />

                {/* Profile circle */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/30 glow-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-dark-200 via-dark-300 to-dark-400 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-8xl mb-2"
                      >
                        👨‍💻
                      </motion.div>
                      <p className="text-gray-400 text-sm font-medium">Full Stack Developer</p>
                    </div>
                  </div>
                </div>

                {/* Rotating dashed ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-primary/20"
                />
                {/* Second counter-rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-full border border-dashed border-secondary/10"
                />

                {/* Orbiting tech badges */}
                {orbitTechs.map((tech, i) => {
                  const angle = (i / orbitTechs.length) * 2 * Math.PI
                  const r = 50
                  const x = 50 + r * Math.cos(angle)
                  const y = 50 + r * Math.sin(angle)
                  return (
                    <motion.div
                      key={tech}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animation: `orbit-glow-pulse 3s ease-in-out infinite`,
                        animationDelay: `${i * 0.7}s`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full glass-dark border border-primary/40 text-xs font-bold text-primary whitespace-nowrap backdrop-blur-md"
                    >
                      {tech}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      {/* <section className="section-padding">
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
            <motion.div whileHover={{ x: 4 }}>
              <Link to="/projects" className="btn-secondary text-sm flex items-center gap-2">
                View All <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section> */}

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
            <p className="text-gray-400">My technical stack across frontend, backend, cloud, and AI</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[...skills.frontend, ...skills.backend, ...skills.ai].map((skill, i) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.75, y: 10 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, delay: i * 0.025 } },
                }}
                whileHover={{
                  scale: 1.12,
                  y: -4,
                  boxShadow: `0 0 16px ${skill.color}44`,
                  borderColor: skill.color + '66',
                }}
                className="px-4 py-2 rounded-xl glass border border-white/10 transition-colors cursor-default"
              >
                <span className="text-sm font-semibold" style={{ color: skill.color }}>{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link to="/skills" className="btn-secondary inline-flex items-center gap-2">
              View All Skills <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
