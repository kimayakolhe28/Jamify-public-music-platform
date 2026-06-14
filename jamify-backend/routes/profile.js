const express = require('express')
const router = express.Router()
const Jam = require('../models/Jam')
const User = require('../models/User')
const protect = require('../middleware/authMiddleware')

// Get current user profile + their jams
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    const jams = await Jam.find({ host: req.user.id }).sort({ createdAt: -1 })

    res.json({
      user,
      jams,
      stats: {
        totalJams: jams.length,
        activeJams: jams.filter(j => j.isActive).length,
        endedJams: jams.filter(j => !j.isActive).length
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router