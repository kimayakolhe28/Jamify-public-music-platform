import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../services/api'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    getProfile()
      .then(data => {
        // handles both res.data and direct data
        const payload = data?.data ? data.data : data
        setProfile(payload)
      })
      .catch(err => {
        console.error(err)
        // on auth error, redirect to login
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black text-2xl font-bold">
            {profile?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile?.user?.name}</h2>
            <p className="text-gray-400 text-sm">{profile?.user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{profile?.stats?.totalJams || 0}</p>
            <p className="text-gray-400 text-sm mt-1">Total Jams</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{profile?.stats?.activeJams || 0}</p>
            <p className="text-gray-400 text-sm mt-1">Active Jams</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-400">{profile?.stats?.endedJams || 0}</p>
            <p className="text-gray-400 text-sm mt-1">Ended Jams</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">🎵 Your Jams</h3>
        {profile?.jams?.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-400">You haven't created any jams yet.</p>
            <button
              onClick={() => navigate('/create')}
              className="mt-4 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full"
            >
              Create your first jam
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {profile?.jams?.map(jam => (
              <div key={jam._id} className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{jam.title}</h4>
                  <p className="text-gray-400 text-sm">Genre: {jam.genre}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Created: {new Date(jam.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${jam.isActive ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                    {jam.isActive ? 'Active' : 'Ended'}
                  </span>
                  {jam.isActive && (
                    <button
                      onClick={() => navigate(`/jam/${jam._id}`)}
                      className="bg-green-500 hover:bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-full"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile