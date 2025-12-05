import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../services/auth'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-14 w-full max-w-md border border-gold/30"
      >
        <h1 className="text-5xl font-display text-dusty-rose mb-3 text-center tracking-wide">Admin Login</h1>
        <p className="text-dusty-rose/60 font-body text-center mb-10 text-lg">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-dusty-rose font-body font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-xl border border-gold/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body transition-all duration-300"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-body">{error}</div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/90 text-white rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginPage

