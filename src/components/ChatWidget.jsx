import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiUser, FiCpu, FiBookOpen, FiUserCheck } from 'react-icons/fi'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm Abhishek's AI representative 👋 Ask me anything about his fintech & healthtech platforms, AI & RAG pipelines, multi-tenant MongoDB designs, Vite Module Federation architecture, AWS cost optimizations, skills, or experience!",
}

const SUGGESTED_PROMPTS = [
  'Tell me about your AI & RAG pipeline implementation',
  'How did you cut AWS cloud costs by 20%?',
  'Explain your multi-tenant MongoDB design',
  'Tell me about your Vite micro-frontend setup',
  'What did you build at Vigorus Healthtech?',
  'What certifications do you hold?',
]

function getOrCreateSessionId() {
  let id = localStorage.getItem('ag_chat_session_id')
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    localStorage.setItem('ag_chat_session_id', id)
  }
  return id
}

function getClientDetails() {
  const ua = navigator.userAgent || ''
  let os = 'Unknown OS'
  let browser = 'Unknown Browser'
  let device = 'Desktop'

  if (/Mobile|Android|iPhone|iPod|BlackBerry/i.test(ua)) device = 'Mobile'
  else if (/iPad|Tablet/i.test(ua)) device = 'Tablet'

  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad/i.test(ua)) os = 'iOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/Chrome\//i.test(ua)) browser = 'Chrome'
  else if (/Safari\//i.test(ua)) browser = 'Safari'
  else if (/Firefox\//i.test(ua)) browser = 'Firefox'

  return {
    os,
    browser,
    device,
    screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: navigator.language || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    referrer: document.referrer || 'Direct'
  }
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
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
            ? 'bg-secondary/20 border border-secondary/30'
            : 'bg-primary/20 border border-primary/30'
          }`}
      >
        {isUser
          ? <FiUser className="text-secondary text-xs" />
          : <FiCpu className="text-primary text-xs" />
        }
      </div>
      <div className="max-w-[85%] flex flex-col gap-1.5">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser
              ? 'bg-primary/80 text-white rounded-br-sm'
              : 'glass-dark border border-white/10 text-gray-200 dark:text-gray-200 rounded-bl-sm'
            }`}
        >
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            <span className="text-[10px] text-gray-500 flex items-center gap-1"><FiBookOpen size={10} /> Verified Sources:</span>
            {msg.sources.map((s, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showIdentityForm, setShowIdentityForm] = useState(false)
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('ag_visitor_name') || '')
  const [visitorEmail, setVisitorEmail] = useState(() => localStorage.getItem('ag_visitor_email') || '')
  const [identitySaved, setIdentitySaved] = useState(() => !!localStorage.getItem('ag_visitor_name'))

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  function handleSaveIdentity(e) {
    e.preventDefault()
    if (visitorName.trim()) localStorage.setItem('ag_visitor_name', visitorName.trim())
    if (visitorEmail.trim()) localStorage.setItem('ag_visitor_email', visitorEmail.trim())
    setIdentitySaved(true)
    setShowIdentityForm(false)
  }

  async function sendMessage(textToSend) {
    const text = (typeof textToSend === 'string' ? textToSend : input).trim()
    if (!text || isLoading) return

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    const sessionId = getOrCreateSessionId()
    const clientInfo = {
      ...getClientDetails(),
      name: visitorName || localStorage.getItem('ag_visitor_name') || undefined,
      email: visitorEmail || localStorage.getItem('ag_visitor_email') || undefined
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.role !== 'system'),
          stream: true,
          sessionId,
          clientInfo
        }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('text/event-stream') && res.body) {
        setIsLoading(false)
        const assistantMsg = { role: 'assistant', content: '' }
        setMessages((prev) => [...prev, assistantMsg])

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
              try {
                const json = JSON.parse(line.slice(6))
                const delta = json.choices?.[0]?.delta?.content || ''
                if (delta) {
                  accumulated += delta
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      content: accumulated,
                    }
                    return updated
                  })
                }
              } catch {
                // partial line or parsing error - ignore
              }
            }
          }
        }

        if (!accumulated.trim()) {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: "I'm temporarily experiencing connectivity issues. Abhishek is a Full Stack Developer (MERN, AWS). Please reach him directly at gautamabhishek0810@gmail.com!",
            }
            return updated
          })
        }
        return
      }

      // Fallback JSON handling
      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, sources: data.sources }])
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
            style={{ maxHeight: '520px', background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/20 to-secondary/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <FiCpu className="text-primary text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold leading-none truncate">Abhishek's AI Agent</p>
                  <p className="text-primary text-[11px] mt-0.5 font-medium truncate">Meta LLaMA & RAG · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowIdentityForm(!showIdentityForm)}
                  title={identitySaved ? `Identified as: ${visitorName || visitorEmail}` : "Leave your name or email for Abhishek"}
                  className={`p-1.5 rounded-lg border transition-all ${
                    identitySaved
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-white/10 text-gray-400 hover:text-white hover:border-primary/40'
                  }`}
                >
                  <FiUserCheck size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Optional Identity Sub-panel */}
            <AnimatePresence>
              {showIdentityForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSaveIdentity}
                  className="px-4 py-2.5 bg-dark-300/80 border-b border-white/10 flex flex-col gap-2 overflow-hidden text-xs"
                >
                  <p className="text-gray-300 font-medium">Recruiter / Visitor Info (Optional):</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-primary outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowIdentityForm(false)}
                      className="text-gray-400 hover:text-white px-2 py-1"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-primary text-white font-medium hover:bg-primary/90"
                    >
                      Save Info
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

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
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary/90 hover:bg-primary/15 hover:border-primary/50 transition-all text-left"
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
                placeholder="Ask about my architecture, skills, AWS savings..."
                rows={1}
                className="flex-1 px-3 py-2 rounded-xl glass border border-white/10 text-white placeholder-gray-500 text-sm bg-transparent resize-none input-focus-glow transition-all duration-300 leading-relaxed"
                style={{ maxHeight: '80px', overflowY: 'auto' }}
              />
              <motion.button
                onClick={() => sendMessage()}
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
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-secondary rounded-full border-2 border-dark-400 animate-pulse" />
        )}
      </motion.button>
    </div>
  )
}
