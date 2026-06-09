function CreateJam() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">✨ Create a New Jam</h2>
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl">
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Jam Title</label>
            <input
              type="text"
              placeholder="Enter jam title"
              className="w-full bg-gray-700 text-white p-3 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Genre</label>
            <select className="w-full bg-gray-700 text-white p-3 rounded-lg">
              <option>Select Genre</option>
              <option>Bollywood</option>
              <option>Pop</option>
              <option>Lo-fi</option>
              <option>Rock</option>
              <option>Hip-Hop</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-full mt-4"
          >
            Create Jam
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateJam