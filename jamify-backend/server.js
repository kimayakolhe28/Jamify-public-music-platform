require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const axios = require('axios')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth')
const jamRoutes = require('./routes/jams')
const spotifyRoutes = require('./routes/spotify')
const musicRoutes = require('./routes/music')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jams', jamRoutes)
app.use('/api/auth/spotify', spotifyRoutes)
app.use('/api/music', musicRoutes)
app.use("/api", require("./routes/recommendations"))

app.get('/', (req, res) => {
  res.json({ message: 'Jamify backend is running 🎵' })
})

function decodeHtmlEntities(str) {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#38;/g, '&')
}

function cleanSongTitle(rawTitle) {
  let cleaned = decodeHtmlEntities(rawTitle)
  if (cleaned.includes('|')) {
    cleaned = cleaned.split('|')[0]
  }
  cleaned = cleaned
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/official video|full video song|video song|lyrical|lyrics|audio|HD|4K/gi, '')
    .trim()
  return cleaned
}

function parseArtistAndTitle(rawTitle) {
  const cleaned = cleanSongTitle(rawTitle)
  const parts = cleaned.split(' - ')
  if (parts.length === 2) {
    return { artist: parts[0].trim(), title: parts[1].trim() }
  }
  return { artist: '', title: cleaned }
}

const roomUsers = {}
const roomSongs = {}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // FIX 1: async + restore recommendations on join
  socket.on('join_room', async (data) => {
    socket.join(data.roomId)
    socket.username = data.username
    socket.roomId = data.roomId

    if (!roomUsers[data.roomId]) roomUsers[data.roomId] = new Set()
    const isNewUser = !roomUsers[data.roomId].has(socket.id)
    roomUsers[data.roomId].add(socket.id)

    io.to(data.roomId).emit('room_users', {
      count: roomUsers[data.roomId].size,
      message: isNewUser ? `${data.username} joined the jam 🎵` : null
    })

    if (roomSongs[data.roomId]) {
      socket.emit('song_changed', roomSongs[data.roomId])

      // Restore recommendations only for the joining user
      try {
        const { artist, title } = parseArtistAndTitle(roomSongs[data.roomId].title)
        const response = await axios.post('http://localhost:8001/recommend', { title, artist })
        socket.emit('recommendations_updated', response.data.recommendations)
      } catch (err) {
        console.error('Recommendation fetch on join failed:', err.message)
      }
    }
  })

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', {
      username: data.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    })
  })

  socket.on('play_song', async (data) => {
    roomSongs[data.roomId] = {
      videoId: data.videoId,
      title: data.title,
      artist: data.artist,
      thumbnail: data.thumbnail
    }
    io.to(data.roomId).emit('song_changed', roomSongs[data.roomId])

    try {
      const { artist, title } = parseArtistAndTitle(data.title)
      console.log('Fetching recs for:', { title, artist })
      const response = await axios.post('http://localhost:8001/recommend', { title, artist })
      console.log('Recs received:', response.data.recommendations.map(r => r.track_name))
      io.to(data.roomId).emit('recommendations_updated', response.data.recommendations)
    } catch (err) {
      // FIX 3: better error logging
      console.error('Recommendation fetch failed:', err.message)
      console.error('Full error:', err.response?.data || err.code)
    }
  })

  socket.on('pause_song', (data) => {
    io.to(data.roomId).emit('song_paused')
  })

  socket.on('resume_song', (data) => {
    io.to(data.roomId).emit('song_resumed')
  })

  socket.on('jam_ended', (data) => {
    io.to(data.roomId).emit('jam_ended')
  })

  // FIX 2: clear room state when last person leaves
  socket.on('disconnect', () => {
    if (socket.roomId && roomUsers[socket.roomId]) {
      roomUsers[socket.roomId].delete(socket.id)

      if (roomUsers[socket.roomId].size === 0) {
        delete roomSongs[socket.roomId]
        delete roomUsers[socket.roomId]
        console.log(`Room ${socket.roomId} cleared — no listeners remaining`)
      } else {
        io.to(socket.roomId).emit('room_users', {
          count: roomUsers[socket.roomId].size,
          message: `${socket.username} left the jam`
        })
      }
    }
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅')
    server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`))
  })
  .catch(err => console.log('MongoDB connection error:', err))