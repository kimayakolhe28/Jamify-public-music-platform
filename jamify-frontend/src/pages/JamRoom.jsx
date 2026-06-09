import { useParams } from 'react-router-dom'

function JamRoom() {
  const { id } = useParams()
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">🎧 Jam Room #{id}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6">
          <h3 className="text-2xl font-semibold mb-4">Now Playing</h3>
          <div className="bg-gray-700 h-64 rounded-lg flex items-center justify-center text-gray-400">
            Player will go here
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Chat & Listeners</h3>
          <div className="bg-gray-700 h-96 rounded-lg p-4 text-gray-400 overflow-y-auto">
            Listeners and chat will appear here
          </div>
        </div>
      </div>
    </div>
  )
}

export default JamRoom