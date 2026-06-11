const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  spotifyId: {
    type: String,
    default: ''
  },
  spotifyAccessToken: {
    type: String,
    default: ''
  },
  spotifyRefreshToken: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)