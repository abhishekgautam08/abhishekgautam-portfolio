import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiAlertTriangle, FiCheck } from 'react-icons/fi'

export default function AdminRegister() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [adminAlreadyExists, setAdminAlreadyExists] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    // 1. Check if token already exists
    const token = localStorage.getItem('ag_admin_token')
    if (token) {
      navigate('/admin/dashboard')
      return
    }

    // 2. Check if an admin is already registered in MongoDB
    async function checkStatus() {
      try {
        const res = await fetch('/api/admin-auth?check=status')
        const data = await res.json()
        if (data.hasAdmin) {
          setAdminAlreadyExists(true)
        }
      } catch (err) {
        console.error('Failed to verify admin status:', err)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkStatus()
  }, [navigate])

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username,
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed')
      }

      // Save token and navigate to dashboard
      localStorage.setItem('ag_admin_token', data.token)
      localStorage.setItem('ag_admin_user', JSON.stringify(data.user))

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
          {adminAlreadyExists ? (
            /* Admin Already Registered View */
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 text-2xl">
                <FiAlertTriangle />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Registration Closed</h1>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                An administrator account is already configured. For security, only <span className="text-primary font-semibold">one admin</span> is permitted on this portfolio.
              </p>
              <Link
                to="/admin/login"
                className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                Go to Admin Login
              </Link>
            </div>
          ) : (
            /* Registration Form View */
            <>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-2xl mb-4 neon-glow">
                  <FiShield className="text-white text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Registration</h1>
                <p className="text-gray-400 text-xs mt-1.5">
                  Initial Setup · Only one admin account can be created
                </p>
              </div>

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
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Admin Name / Username
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Abhishek Gautam"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-3 text-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiCheck size={16} /> Complete Setup &amp; Enter Dashboard
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/admin/login"
                  className="text-xs text-gray-400 hover:text-primary transition-colors"
                >
                  Already have an account? <span className="text-secondary font-medium">Log In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
