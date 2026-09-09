import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiUser, FiCpu } from 'react-icons/fi'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm Abhishek's AI assistant 👋 Ask me anything about his skills, projects, experience, or how to get in touch!",
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
        <FiCpu className="text-primary text-xs" />
      </div>
      <div className="glass-dark border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-secondary/20 border border-secondary/30'
            : 'bg-primary/20 border border-primary/30'
        }`}
      >
        {isUser
          ? <FiUser className="text-secondary text-xs" />
          : <FiCpu className="text-primary text-xs" />
        }
      </div>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-primary/80 text-white rounded-br-sm'
            : 'glass-dark border border-white/10 text-gray-200 dark:text-gray-200 rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.role !== 'system'),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please check your connection and try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-primary/20 flex flex-col"
            style={{ maxHeight: '480px', background: 'rgba(10,10,26,0.92)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-primary/20 to-secondary/10">
              <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center">
                <FiCpu className="text-primary text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-none">Abhishek's AI Assistant</p>
                <p className="text-primary text-xs mt-0.5">Powered by Claude · Always online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Suggested prompts — show only with initial message */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {['What are your skills?', 'Tell me about your projects', 'Your experience?', 'How to contact you?'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                    className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary/80 hover:bg-primary/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about skills, projects..."
                rows={1}
                className="flex-1 px-3 py-2 rounded-xl glass border border-white/10 text-white placeholder-gray-500 text-sm bg-transparent resize-none input-focus-glow transition-all duration-300 leading-relaxed"
                style={{ maxHeight: '80px', overflowY: 'auto' }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiSend size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-xl neon-glow relative"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <FiX size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <FiMessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-secondary rounded-full border-2 border-dark-400 animate-pulse" />
        )}
      </motion.button>
    </div>
  )
}
