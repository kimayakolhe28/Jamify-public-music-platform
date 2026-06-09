const express = require('express')
const router = express.Router()
const Jam = require('../models/Jam')
const protect = require('../middleware/authMiddleware')

// Get all active jams
router.get('/', async (req, res) => {
  try {
    const jams = await Jam.find({ isActive: true }).populate('host', 'name email')
    res.json(jams)
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
    }

    res.json(jam)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router