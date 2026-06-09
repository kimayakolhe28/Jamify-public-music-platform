const dummyJams = [
  { id: 1, title: "Bollywood Night", genre: "Bollywood", host: "Riya", listeners: 12 },
  { id: 2, title: "Taylor Swift Fans", genre: "Pop", host: "Ananya", listeners: 8 },
  { id: 3, title: "Lo-fi Study Vibes", genre: "Lo-fi", host: "Rohan", listeners: 24 },
]

function BrowseJams() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">🔍 Browse Jams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyJams.map(jam => (
          <div key={jam.id} className="bg-gray-800 rounded-2xl p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold">{jam.title}</h3>
            <p className="text-gray-400 text-sm">Genre: {jam.genre}</p>
            <p className="text-gray-400 text-sm">Host: {jam.host}</p>
            <p className="text-green-400 text-sm">🎧 {jam.listeners} listening</p>
            <a href={`/jam/${jam.id}`} className="mt-2 bg-green-500 hover:bg-green-400 text-black font-semibold text-center py-2 rounded-full">Join</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrowseJams