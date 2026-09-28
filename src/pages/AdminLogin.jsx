import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiUserPlus } from 'react-icons/fi'

export default function AdminLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasAdmin, setHasAdmin] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // 1. If already authenticated, redirect to dashboard
    const token = localStorage.getItem('ag_admin_token')
    if (token) {
      navigate('/admin/dashboard')
      return
    }

    // 2. Check if an admin is registered
    async function checkStatus() {
      try {
        const res = await fetch('/api/admin-auth?check=status')
        const data = await res.json()
        if (data && data.hasAdmin === false) {
          setHasAdmin(false)
        }
      } catch {
        // ignore
      }
    }

    checkStatus()
  }, [navigate])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          emailOrUsername,
          password
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.')
      }

      localStorage.setItem('ag_admin_token', data.token)
      localStorage.setItem('ag_admin_user', JSON.stringify(data.user))

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dark-400 py-12">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white glass px-4 py-2 rounded-xl transition-all border border-white/10"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-dark border border-primary/25 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-2xl mb-4 neon-glow">
              <FiShield className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Terminal</h1>
            <p className="text-gray-400 text-xs mt-1.5">
              Secure Login · Chat Intelligence &amp; Visitor Logs
            </p>
          </div>

          {/* If no admin registered yet, show banner to register */}
          {!hasAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 text-gray-200">
                <FiUserPlus className="text-secondary text-base flex-shrink-0" />
                <span>No admin setup yet</span>
              </div>
              <Link
                to="/admin/register"
                className="px-2.5 py-1 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 transition-colors"
              >
                Register Admin
              </Link>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2"
            >
              <span className="font-semibold">Error:</span> {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Admin Email or Username
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Secure Login'
              )}
            </motion.button>
          </form>

          {/* Registration link if not yet registered */}
          {!hasAdmin && (
            <div className="mt-6 text-center text-xs text-gray-400">
              Need to create the admin account?{' '}
              <Link to="/admin/register" className="text-secondary hover:underline font-semibold">
                Setup Admin
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
