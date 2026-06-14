const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Resilient import for User model (handles CommonJS or transpiled default exports)
let _User = null
try {
  _User = require('../models/User')
} catch (err) {
  console.error('Error requiring User model:', err)
}
const User = (_User && _User.default) ? _User.default : _User

if (!User) {
  console.error('User model could not be loaded. Check models/User.js export.')
}

// Add Jam model and protect middleware
const Jam = require('../models/Jam')
const protect = require('../middleware/authMiddleware')

// GET /api/auth/profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    // Find user excluding password
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Find jams hosted by this user, most recent first
    const jams = await Jam.find({ host: req.user.id }).sort({ createdAt: -1 })

    const stats = {
      totalJams: jams.length,
      activeJams: jams.filter(j => j.isActive).length,
      endedJams: jams.filter(j => !j.isActive).length
    }

    return res.json({ user, jams, stats })
  } catch (err) {
    console.error('Profile error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hashed })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' })

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router