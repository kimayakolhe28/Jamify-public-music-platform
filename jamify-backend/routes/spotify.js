const express = require('express')
const router = express.Router()
const axios = require('axios')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI
const FRONTEND_URL = process.env.FRONTEND_URL

// Step 1 — Redirect user to Spotify login
router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-read-currently-playing'
  ].join(' ')

  const authURL = `https://accounts.spotify.com/authorize?` +
    `client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`

  res.redirect(authURL)
})

// Step 2 — Spotify redirects back here with a code
router.get('/callback', async (req, res) => {
  const code = req.query.code

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
        }
      }
    )

    const { access_token, refresh_token } = tokenResponse.data

    // Get user profile from Spotify
    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    const spotifyUser = profileResponse.data

    // Find or create user in MongoDB
    let user = await User.findOne({ email: spotifyUser.email })

    if (!user) {
      user = await User.create({
        name: spotifyUser.display_name || spotifyUser.id,
        email: spotifyUser.email,
        password: 'spotify_oauth_user',
        spotifyId: spotifyUser.id,
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        profilePic: spotifyUser.images?.[0]?.url || ''
      })
    } else {
      user.spotifyAccessToken = access_token
      user.spotifyRefreshToken = refresh_token
      user.spotifyId = spotifyUser.id
      await user.save()
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/spotify-callback?token=${token}&name=${encodeURIComponent(user.name)}&id=${user._id}`)

  } catch (err) {
    console.error('Spotify callback error:', err.message)
    console.error('Error details:', err.response?.data)
    res.redirect(`${FRONTEND_URL}/login?error=spotify_failed`)
  }
})

module.exports = router