import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:5000')

function JamRoom() {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [jam, setJam] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const messagesEndRef = useRef(null)
  const playerRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest"}')

  // Check if current user is the host
  const isHost = jam?.host?._id === user.id || jam?.host === user.id

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jams/${id}`)
      .then(res => setJam(res.data))
      .catch(() => setJam({ title: 'Jam Room' }))

    socket.emit('join_room', { roomId: id, username: user.name })

    socket.on('room_users', (data) => {
      setOnlineUsers(data.count)
      if (data.message) {
        setMessages(prev => [...prev, { type: 'system', message: data.message }])
      }
    })

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, { type: 'chat', ...data }])
    })

    socket.on('song_changed', (data) => {
      setCurrentSong(data)
      setIsPlaying(true)
      setMessages(prev => [...prev, {
        type: 'system',
        message: `🎵 Now playing: ${data.title}`
      }])
    })

    socket.on('song_paused', () => setIsPlaying(false))
    socket.on('song_resumed', () => setIsPlaying(true))

    return () => {
      socket.off('room_users')
      socket.off('receive_message')
      socket.off('song_changed')
      socket.off('song_paused')
      socket.off('song_resumed')
    }
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const searchSongs = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/music/search?query=${searchQuery}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const playSong = (song) => {
    socket.emit('play_song', { roomId: id, ...song })
    setSearchResults([])
    setSearchQuery('')
  }

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('send_message', {
      roomId: id,
      username: user.name,
      message: input
    })
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">🎵 {jam ? jam.title : 'Loading...'}</h2>
          <p className="text-gray-400 text-sm">{jam ? `Genre: ${jam.genre}` : ''}</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-full">
          <span className="text-green-400 font-semibold">🎧 {onlineUsers} listening</span>
        </div>
      </div>

      {/* Music Player */}
      <div className="border-b border-gray-800 p-4">
        {currentSong ? (
          <div className="flex items-center gap-4 mb-3">
            <img src={currentSong.thumbnail} alt={currentSong.title} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{currentSong.title}</p>
              <p className="text-gray-400 text-xs">{currentSong.artist}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${isPlaying ? 'bg-green-500 text-black' : 'bg-gray-700'}`}>
              {isPlaying ? '▶ Playing' : '⏸ Paused'}
            </span>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-3">No song playing — search and select a song</p>
        )}

        {/* YouTube Player */}
        {currentSong && (
          <div className="mb-3">
            <iframe
              ref={playerRef}
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1&enablejsapi=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchSongs()}
            placeholder="🔍 Search songs..."
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={searchSongs}
            disabled={searching}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {searchResults.map((song) => (
              <div
                key={song.videoId}
                onClick={() => playSong(song)}
                className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
              >
                <img src={song.thumbnail} alt={song.title} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
                <span className="text-green-400 text-xs">▶ Play</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-8">You joined the jam! Say hello 👋</p>
        )}
        {messages.map((msg, i) => (
          msg.type === 'system' ? (
            <div key={i} className="text-center text-gray-500 text-sm">{msg.message}</div>
          ) : (
            <div key={i} className={`flex flex-col ${msg.username === user.name ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-500 mb-1">{msg.username} · {msg.time}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.username === user.name ? 'bg-green-500 text-black' : 'bg-gray-700'}`}>
                {msg.message}
              </div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default JamRoom