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

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join a jam room
  socket.on('join_room', (data) => {
    socket.join(data.roomId)
    console.log(`User ${data.username} joined room ${data.roomId}`)
    io.to(data.roomId).emit('user_joined', {
      message: `${data.username} joined the jam 🎵`
    })
  })

  // Send a message
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', {
      username: data.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    })
  })

  // Leave room
  socket.on('disconnect', () => {
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