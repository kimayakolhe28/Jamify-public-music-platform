import { useEffect, useState } from 'react'
import { fetchJams } from '../services/api'

function BrowseJams() {
  const [jams, setJams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJams()
      .then(res => setJams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">🔍 Browse Jams</h2>
      {loading ? (
        <p className="text-gray-400">Loading jams...</p>
      ) : jams.length === 0 ? (
        <p className="text-gray-400">No active jams right now. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jams.map(jam => (
            <div key={jam._id} className="bg-gray-800 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="text-xl font-semibold">{jam.title}</h3>
              <p className="text-gray-400 text-sm">Genre: {jam.genre}</p>
              <p className="text-gray-400 text-sm">Host: {jam.host?.name || 'Unknown'}</p>
              <p className="text-green-400 text-sm">🎧 {jam.participants?.length || 0} listening</p>
              <a href={`/jam/${jam._id}`} className="mt-2 bg-green-500 hover:bg-green-400 text-black font-semibold text-center py-2 rounded-full">Join</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrowseJams