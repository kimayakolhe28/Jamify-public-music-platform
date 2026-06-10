import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await loginUser({ email, password })
      const data = res?.data ? res.data : res
      if (data?.token) {
        localStorage.setItem('token', data.token)
        navigate('/browse')
      } else {
        setError(data?.message || 'Login failed')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign in to Jamify</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-3 rounded bg-gray-700" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="p-3 rounded bg-gray-700" />
          <button type="submit" className="bg-green-500 py-3 rounded text-black font-semibold">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}

export default Login