import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import BrowseJams from './pages/BrowseJams'
import CreateJam from './pages/CreateJam'
import JamRoom from './pages/JamRoom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseJams />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreateJam />
          </ProtectedRoute>
        } />
        <Route path="/jam/:id" element={
          <ProtectedRoute>
            <JamRoom />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App