import { motion } from 'framer-motion'

export default function SectionHeader({ label, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary/30 bg-primary/10 text-primary">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary" />
        <div className="w-3 h-3 rounded-full bg-primary" />
        <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary" />
      </div>
    </motion.div>
  )
}
