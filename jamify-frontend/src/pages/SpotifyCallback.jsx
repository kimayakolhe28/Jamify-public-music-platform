import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SpotifyCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const name = params.get('name')
    const id = params.get('id')

    if (token && name && id) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ name, id }))
      navigate('/browse')
    } else {
      navigate('/login?error=spotify_failed')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🎵</div>
        <p className="text-gray-400">Connecting with Spotify...</p>
      </div>
    </div>
  )
}

export default SpotifyCallback