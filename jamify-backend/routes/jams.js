const express = require('express')
const router = express.Router()
const Jam = require('../models/Jam')
const protect = require('../middleware/authMiddleware')
const redis = require('../config/redis')

// Get all active jams
router.get('/', async (req, res) => {
  try {
    // Check Redis cache first
    const cached = await redis.get('active_jams')
    if (cached) {
      console.log('Serving jams from Redis cache ⚡')
      return res.json(JSON.parse(cached))
    }

    // If not in cache, query MongoDB
    const jams = await Jam.find({ isActive: true }).populate('host', 'name email')
    
    // Store in Redis cache for 60 seconds
    await redis.setex('active_jams', 60, JSON.stringify(jams))
    console.log('Serving jams from MongoDB, cached in Redis 💾')
    
    res.json(jams)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single jam by ID
router.get('/:id', async (req, res) => {
  try {
    const cached = await redis.get(`jam:${req.params.id}`)
    if (cached) {
      console.log('Serving jam from Redis cache ⚡')
      return res.json(JSON.parse(cached))
    }

    const jam = await Jam.findById(req.params.id).populate('host', 'name')
    if (!jam) return res.status(404).json({ message: 'Jam not found' })

    await redis.setex(`jam:${req.params.id}`, 120, JSON.stringify(jam))
    res.json(jam)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create a new jam (protected)
router.post('/create', protect, async (req, res) => {
  try {
    const { title, genre } = req.body
    if (!title || !genre) return res.status(400).json({ message: 'Title and genre are required' })

    const jam = new Jam({ title, genre, host: req.user.id, isActive: true })
    await jam.save()

    // Clear cache so new jam appears immediately
    await redis.del('active_jams')
    console.log('Cache cleared after new jam created 🗑️')

    res.status(201).json(jam)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Join a jam (protected)
router.post('/join/:id', protect, async (req, res) => {
  try {
    const jam = await Jam.findById(req.params.id)
    if (!jam) return res.status(404).json({ message: 'Jam not found' })

    const userId = req.user.id
    if (!jam.participants) jam.participants = []

    if (!jam.participants.includes(userId)) {
      jam.participants.push(userId)
      await jam.save()

      // Clear cache for this jam
      await redis.del(`jam:${req.params.id}`)
      await redis.del('active_jams')
    }

    res.json(jam)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router