require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth')
const jamRoutes = require('./routes/jams')

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

app.get('/', (req, res) => {
  res.json({ message: 'Jamify backend is running 🎵' })
})

const roomUsers = {}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_room', (data) => {
    socket.join(data.roomId)
    socket.username = data.username
    socket.roomId = data.roomId

    if (!roomUsers[data.roomId]) roomUsers[data.roomId] = new Set()
    roomUsers[data.roomId].add(socket.id)

    io.to(data.roomId).emit('room_users', {
      count: roomUsers[data.roomId].size,
      message: `${data.username} joined the jam 🎵`
    })
  })

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', {
      username: data.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    })
  })

  socket.on('disconnect', () => {
    if (socket.roomId && roomUsers[socket.roomId]) {
      roomUsers[socket.roomId].delete(socket.id)
      io.to(socket.roomId).emit('room_users', {
        count: roomUsers[socket.roomId].size,
        message: `${socket.username} left the jam`
      })
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