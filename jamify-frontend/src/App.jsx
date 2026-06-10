import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BrowseJams from './pages/BrowseJams'
import CreateJam from './pages/CreateJam'
import JamRoom from './pages/JamRoom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseJams />} />
        <Route path="/create" element={<CreateJam />} />
        <Route path="/jam/:id" element={<JamRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App