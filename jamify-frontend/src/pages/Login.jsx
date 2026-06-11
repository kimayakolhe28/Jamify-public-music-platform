import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/browse')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSpotifyLogin = () => {
    window.location.href = 'http://127.0.0.1:5000/api/auth/spotify/login'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-5">
        <h2 className="text-2xl font-bold">🎵 Welcome back</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSpotifyLogin}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-full flex items-center justify-center gap-2"
        >
          <span>🎧</span> Continue with Spotify
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-full disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-green-400 hover:underline">Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login