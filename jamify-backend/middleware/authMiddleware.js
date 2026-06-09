const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found' })

    req.user = { id: user._id, name: user.name, email: user.email }
    next()
  } catch (err) {
    console.error('auth error', err)
    res.status(401).json({ message: 'Token is not valid' })
  }
}

module.exports = protect