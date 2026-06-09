import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-500">🎵 Jamify</Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-green-400">Home</Link>
          <Link to="/browse" className="hover:text-green-400">Browse</Link>
          <Link to="/create" className="hover:text-green-400">Create</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar