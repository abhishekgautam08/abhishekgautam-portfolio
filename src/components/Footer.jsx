import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiHeart } from 'react-icons/fi'
import { personalInfo } from '../data/portfolioData'

const quickLinks = ['Home', 'About', 'Skills', 'Projects', 'Services', 'Blog', 'Contact']
const services = ['Full Stack Dev', 'React Development', 'Node.js Dev', 'API Development', 'Blockchain Dev', 'AI Integration']

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-dark-400/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white">
                AG
              </div>
              <span className="font-bold text-lg text-white">Abhishek Gautam</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Full Stack Developer building scalable digital products with modern technologies.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FiGithub />, href: personalInfo.github },
                { icon: <FiLinkedin />, href: personalInfo.linkedin },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-colors"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link}>
                  <Link
                    to={`/${link === 'Home' ? '' : link.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map(s => (
                <li key={s} className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-secondary" />
                  {s}
                </li>
              ))}
            </ul>
          </div> */}

          <div>
            {/* <h4 className="font-semibold text-white mb-4">Newsletter</h4> */}
            {/* <p className="text-gray-400 text-sm mb-4">Subscribe for latest articles and updates.</p> */}
            {/* <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg glass border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 bg-transparent"
              />
              <button className="btn-primary px-4 py-2 text-sm">
                <span>Go</span>
              </button>
            </div> */}
            <div className="mt-6 p-3 rounded-lg glass border border-white/5">
              <p className="text-gray-400 text-xs">{personalInfo.email}</p>
              <p className="text-gray-400 text-xs mt-1">{personalInfo.location}</p>
              {/* <p className="text-gray-400 text-xs mt-1">Available: {personalInfo.availability}</p> */}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Abhishek Gautam. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <FiHeart className="text-accent" /> by Abhishek Gautam
          </p>
        </div>
      </div>
    </footer>
  )
}
