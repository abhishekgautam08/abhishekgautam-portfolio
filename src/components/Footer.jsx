import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiHeart, FiMail, FiMapPin } from 'react-icons/fi'
import { personalInfo } from '../data/portfolioData'

const quickLinks = ['Home', 'About', 'Skills', 
  // 'Projects',
   'Services', 'Blog', 'Contact']

const socialLinks = [
  { icon: <FiGithub size={16} />, href: personalInfo.github, label: 'GitHub' },
  { icon: <FiLinkedin size={16} />, href: personalInfo.linkedin, label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-dark-400/80 backdrop-blur-xl">
      {/* Subtle gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-lg neon-glow"
              >
                AG
              </motion.div>
              <span className="font-bold text-lg gradient-text">Abhishek Gautam</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Full Stack Developer building scalable digital products with modern technologies.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-secondary" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link}>
                  <Link
                    to={`/${link === 'Home' ? '' : link.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-all duration-200 text-sm flex items-center gap-2 group w-fit"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-secondary to-accent" />
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors shrink-0">
                  <FiMail size={14} />
                </span>
                <span className="truncate">{personalInfo.email}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-accent shrink-0">
                  <FiMapPin size={14} />
                </span>
                <span>{personalInfo.location}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Abhishek Gautam. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Crafted with
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
            >
              <FiHeart className="text-accent" size={13} />
            </motion.span>
            by Abhishek Gautam
          </p>
        </div>
      </div>
    </footer>
  )
}
