function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">🎵 Welcome to Jamify</h1>
      <p className="text-xl text-gray-300 mb-8">Stream music with your friends in real-time</p>
      <div className="flex gap-4">
        <a href="/browse" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full">Browse Jams</a>
        <a href="/create" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3 rounded-full">Create Jam</a>
      </div>
    </div>
  )
}

export default Home