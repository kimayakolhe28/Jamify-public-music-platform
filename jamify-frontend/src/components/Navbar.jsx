import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-500">🎵 Jamify</Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-green-400">Home</Link>
          <Link to="/browse" className="hover:text-green-400">Browse</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:text-green-400">Create</Link>
              <span className="text-gray-400 text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white text-sm px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-400">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-full">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar