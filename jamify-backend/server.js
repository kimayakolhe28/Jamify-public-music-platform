require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Test route
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