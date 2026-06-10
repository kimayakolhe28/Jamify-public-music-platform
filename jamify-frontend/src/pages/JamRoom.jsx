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
  const [onlineUsers, setOnlineUsers] = useState(1)
  const messagesEndRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest"}')

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jams/${id}`)
      .then(res => setJam(res.data))
      .catch((err) => {
        console.error('JAM FETCH ERROR:', err.message)
        setJam({ title: 'Jam Room' })
      })

    socket.emit('join_room', { roomId: id, username: user.name })

    socket.on('user_joined', (data) => {
      setMessages(prev => [...prev, { type: 'system', message: data.message }])
      setOnlineUsers(prev => prev + 1)
    })

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, { type: 'chat', ...data }])
    })

    socket.on('user_left', (data) => {
      setOnlineUsers(prev => Math.max(1, prev - 1))
    })

    return () => {
      socket.off('user_joined')
      socket.off('receive_message')
      socket.off('user_left')
    }
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🎵 {jam ? jam.title : 'Loading...'}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {jam ? `Genre: ${jam.genre}` : ''}
          </p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-full">
          <span className="text-green-400 font-semibold">🎧 {onlineUsers} listening</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            You joined the jam! Say hello 👋
          </p>
        )}
        {messages.map((msg, i) => (
          msg.type === 'system' ? (
            <div key={i} className="text-center text-gray-500 text-sm">
              {msg.message}
            </div>
          ) : (
            <div key={i} className={`flex flex-col ${msg.username === user.name ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-500 mb-1">{msg.username} · {msg.time}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.username === user.name ? 'bg-green-500 text-black' : 'bg-gray-700 text-white'}`}>
                {msg.message}
              </div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

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