import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJam } from '../services/api'

function CreateJam() {
  const [form, setForm] = useState({ title: '', genre: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title || !form.genre) {
      setError('Please fill in all fields')
      return
    }
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await createJam(form)
      navigate(`/jam/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create jam')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-5">
        <h2 className="text-2xl font-bold">🎙 Create a Jam</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          name="title"
          type="text"
          placeholder="Jam name (e.g. Bollywood Night)"
          value={form.title}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre (e.g. Pop, Lo-fi)"
          value={form.genre}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-full disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Jam'}
        </button>
        <p className="text-gray-400 text-sm text-center">
          <a href="/browse" className="text-green-400 hover:underline">← Back to Browse</a>
        </p>
      </div>
    </div>
  )
}

export default CreateJam