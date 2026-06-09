require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const jamRoutes = require('./routes/jams')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jams', jamRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Jamify backend is running 🎵' })
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅')
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`))
  })
  .catch(err => console.log('MongoDB connection error:', err))