import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMessageSquare,
  FiMapPin,
  FiGlobe,
  FiUser,
  FiCpu,
  FiClock,
  FiRefreshCw,
  FiLogOut,
  FiSearch,
  FiTrash2,
  FiDownload,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiExternalLink,
  FiCalendar,
  FiHelpCircle
} from 'react-icons/fi'

export default function AdminDashboard() {
  const [conversations, setConversations] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [notification, setNotification] = useState('')

  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const token = localStorage.getItem('ag_admin_token')

  const fetchConversationsAndStats = useCallback(async () => {
    if (!token) return
    try {
      // 1. Fetch conversations
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : ''
      const resConvs = await fetch(`/api/admin-conversations${queryParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (resConvs.status === 401) {
        localStorage.removeItem('ag_admin_token')
        navigate('/admin')
        return
      }

      const dataConvs = await resConvs.json()
      if (dataConvs.conversations) {
        setConversations(dataConvs.conversations)

        // Auto select first conversation if none selected
        if (!selectedSessionId && dataConvs.conversations.length > 0) {
          setSelectedSessionId(dataConvs.conversations[0].sessionId)
        }
      }

      // 2. Fetch stats
      const resStats = await fetch('/api/admin-conversations?stats=true', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const dataStats = await resStats.json()
      if (dataStats.stats) {
        setStats(dataStats.stats)
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [token, search, navigate, selectedSessionId])

  // Initial load & Auth verification
  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }

    const savedUser = localStorage.getItem('ag_admin_user')
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser))
      } catch {
        // ignore
      }
    }

    fetchConversationsAndStats()
  }, [token, navigate, fetchConversationsAndStats])

  // Auto-refresh interval (every 15s)
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchConversationsAndStats()
    }, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh, fetchConversationsAndStats])

  // Fetch full conversation details when selectedSessionId changes
  useEffect(() => {
    if (!selectedSessionId || !token) return

    let isMounted = true
    async function fetchDetail() {
      setIsDetailLoading(true)
      try {
        const res = await fetch(`/api/admin-conversations?sessionId=${selectedSessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (isMounted && data.conversation) {
          setSelectedConversation(data.conversation)
        }
      } catch (err) {
        console.error('Failed to fetch conversation details:', err)
      } finally {
        if (isMounted) setIsDetailLoading(false)
      }
    }

    fetchDetail()
    return () => { isMounted = false }
  }, [selectedSessionId, token])

  // Scroll to bottom of message view
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation])

  function handleLogout() {
    localStorage.removeItem('ag_admin_token')
    localStorage.removeItem('ag_admin_user')
    navigate('/admin')
  }

  async function handleDelete(sessionId) {
    if (!window.confirm('Are you sure you want to delete this chat session?')) return

    try {
      const res = await fetch(`/api/admin-conversations?sessionId=${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setNotification('Conversation removed.')
        setTimeout(() => setNotification(''), 3000)
        setConversations(prev => prev.filter(c => c.sessionId !== sessionId))
        if (selectedSessionId === sessionId) {
          const remaining = conversations.filter(c => c.sessionId !== sessionId)
          setSelectedSessionId(remaining[0]?.sessionId || null)
          setSelectedConversation(null)
        }
      }
    } catch (err) {
      alert('Failed to delete conversation: ' + err.message)
    }
  }

  function handleExportJSON() {
    if (!selectedConversation) return
    const blob = new Blob([JSON.stringify(selectedConversation, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat_${selectedConversation.sessionId}_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function formatDate(iso) {
    if (!iso) return 'Unknown'
    const date = new Date(iso)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getDeviceIcon(device) {
    if (device === 'Mobile') return <FiSmartphone className="text-secondary" />
    if (device === 'Tablet') return <FiTablet className="text-primary" />
    return <FiMonitor className="text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-dark-400 text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="glass-dark border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-base neon-glow">
            AG
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">Visitor &amp; Chat Intelligence</h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Live
              </span>
            </div>
            <p className="text-xs text-gray-400">Monitoring real-time queries &amp; geolocation logs</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Auto-refresh every 15 seconds"
          >
            <FiRefreshCw className={autoRefresh ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} size={12} />
            Auto-sync {autoRefresh ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={fetchConversationsAndStats}
            className="p-2 rounded-lg glass border border-white/10 text-gray-300 hover:text-white hover:border-primary/40 transition-colors"
            title="Manual Refresh"
          >
            <FiRefreshCw size={14} />
          </button>

          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 text-xs text-gray-300 hover:text-white transition-colors"
          >
            <FiExternalLink size={12} /> View Portfolio
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-gray-400 font-mono">
              {adminUser?.email || 'admin@abhishek.dev'}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Logout"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-primary/90 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-medium border border-primary"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats Bar */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-dark-300/40 border-b border-white/5">
        <div className="glass-dark border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl">
            <FiMessageSquare />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Conversations</p>
            <h3 className="text-xl font-bold text-white">{stats ? stats.totalConversations : '...'}</h3>
          </div>
        </div>

        <div className="glass-dark border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary text-xl">
            <FiHelpCircle />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Visitor Queries</p>
            <h3 className="text-xl font-bold text-white">{stats ? stats.totalQueries : '...'}</h3>
          </div>
        </div>

        <div className="glass-dark border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
            <FiCalendar />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Active Today</p>
            <h3 className="text-xl font-bold text-white">{stats ? stats.activeToday : '...'}</h3>
          </div>
        </div>

        <div className="glass-dark border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xl">
            <FiGlobe />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Top Location</p>
            <h3 className="text-sm font-bold text-white truncate">
              {stats?.topCountries?.[0]?.country || 'No traffic yet'}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Split Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversation Sessions List */}
        <div className="w-full md:w-96 lg:w-[420px] flex-shrink-0 border-r border-white/10 flex flex-col bg-dark-400/60">
          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search queries, location, IP, name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:border-primary focus:bg-white/10 outline-none transition-all"
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400 px-1">
              <span>{conversations.length} conversation{conversations.length === 1 ? '' : 's'}</span>
              <span>Sorted by recent activity</span>
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <FiMessageSquare className="mx-auto text-2xl text-gray-600 mb-2" />
                {search ? 'No conversations match your search.' : 'No chat conversations recorded yet.'}
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedSessionId === conv.sessionId
                const visitor = conv.visitor || {}
                const visitorDisplay = visitor.name || visitor.email || `Visitor (${visitor.city || 'Unknown'})`

                return (
                  <div
                    key={conv.sessionId}
                    onClick={() => setSelectedSessionId(conv.sessionId)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/15 border-l-4 border-l-primary'
                        : 'hover:bg-white/5 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xs">
                          {getDeviceIcon(visitor.device)}
                        </div>
                        <span className="font-semibold text-xs text-white truncate">
                          {visitorDisplay}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 flex-shrink-0">
                        <FiClock size={10} />
                        {formatDate(conv.lastActive)}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
                      <FiMapPin className="text-secondary flex-shrink-0" size={11} />
                      <span className="truncate">
                        {visitor.city || 'Unknown City'}, {visitor.country || 'Unknown Country'}
                      </span>
                      {visitor.ip && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-gray-400">
                          {visitor.ip}
                        </span>
                      )}
                    </div>

                    {/* Last query preview */}
                    <div className="text-xs text-gray-300 line-clamp-2 bg-black/20 p-2 rounded-lg border border-white/5 font-sans">
                      <span className="text-primary font-semibold">Q: </span>
                      {conv.lastUserQuery || 'Initial greeting'}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-gray-400">
                      <span>{conv.messageCount || 0} messages ({conv.userQueryCount || 0} queries)</span>
                      <span className="text-secondary font-medium">{visitor.browser || 'Browser'} / {visitor.os || 'OS'}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Conversation Viewer & Geolocation Intel */}
        <div className="flex-1 flex flex-col bg-dark-400 overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Visitor Intelligence Header Card */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-dark-300/40">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/40 flex items-center justify-center font-bold text-primary">
                      <FiUser size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        {selectedConversation.visitor?.name || 'Anonymous Visitor'}
                        {selectedConversation.visitor?.email && (
                          <span className="text-xs font-normal text-secondary font-mono">
                            &lt;{selectedConversation.visitor?.email}&gt;
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">
                        Session ID: {selectedConversation.sessionId}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportJSON}
                      className="px-3 py-1.5 rounded-lg glass border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      title="Download chat log as JSON"
                    >
                      <FiDownload size={13} /> Export JSON
                    </button>
                    <button
                      onClick={() => handleDelete(selectedConversation.sessionId)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-1.5 transition-colors"
                      title="Delete this conversation"
                    >
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                {/* Geolocation & Technical Metadata Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1 mb-1">
                      <FiMapPin className="text-secondary" /> Geolocation
                    </span>
                    <p className="font-semibold text-white truncate">
                      {selectedConversation.visitor?.city || 'Unknown'}, {selectedConversation.visitor?.country || 'Unknown'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      IP: {selectedConversation.visitor?.ip || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1 mb-1">
                      <FiMonitor className="text-primary" /> Device &amp; OS
                    </span>
                    <p className="font-semibold text-white truncate">
                      {selectedConversation.visitor?.os || 'Unknown OS'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {selectedConversation.visitor?.browser || 'Unknown'} ({selectedConversation.visitor?.device || 'Desktop'})
                    </p>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1 mb-1">
                      <FiClock className="text-emerald-400" /> First Seen
                    </span>
                    <p className="font-semibold text-white truncate">
                      {formatDate(selectedConversation.firstActive)}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      Timezone: {selectedConversation.visitor?.timezone || 'UTC'}
                    </p>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold flex items-center gap-1 mb-1">
                      <FiGlobe className="text-accent" /> Origin / Referrer
                    </span>
                    <p className="font-semibold text-white truncate">
                      {selectedConversation.visitor?.referrer || 'Direct'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      Resolution: {selectedConversation.visitor?.screenResolution || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Transcript Timeline */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {isDetailLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  (selectedConversation.messages || []).map((msg, idx) => {
                    const isUser = msg.role === 'user'
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                            isUser
                              ? 'bg-secondary/20 border border-secondary/40 text-secondary'
                              : 'bg-primary/20 border border-primary/40 text-primary'
                          }`}
                        >
                          {isUser ? <FiUser /> : <FiCpu />}
                        </div>

                        {/* Message Box */}
                        <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 px-1">
                            <span className="font-semibold text-gray-300">
                              {isUser ? (selectedConversation.visitor?.name || 'Visitor') : 'Abhishek AI Rep'}
                            </span>
                            <span>•</span>
                            <span>{formatDate(msg.timestamp)}</span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? 'bg-primary text-white rounded-tr-sm shadow-lg'
                                : 'glass-dark border border-white/10 text-gray-200 rounded-tl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>

                          {/* Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 px-1 mt-1">
                              <span className="text-[10px] text-gray-500">RAG Chunks:</span>
                              {msg.sources.map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-primary"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <FiMessageSquare className="text-4xl text-gray-600 mb-3" />
              <h3 className="text-lg font-bold text-white">Select a conversation</h3>
              <p className="text-xs max-w-sm mt-1">
                Choose any session from the left column to view the full chat transcript, queries, and visitor geolocation intelligence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
