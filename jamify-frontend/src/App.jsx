import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BrowseJams from './pages/BrowseJams'
import CreateJam from './pages/CreateJam'
import JamRoom from './pages/JamRoom'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseJams />} />
        <Route path="/create" element={<CreateJam />} />
        <Route path="/jam/:id" element={<JamRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App