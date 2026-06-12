const express = require('express')
const router = express.Router()
const axios = require('axios')

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

router.get('/search', async (req, res) => {
  const { query } = req.query
  if (!query) return res.status(400).json({ message: 'Query is required' })

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10',
          maxResults: 5,
          key: YOUTUBE_API_KEY
        }
      }
    )

    const songs = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url
    }))

    res.json(songs)
  } catch (err) {
    console.error('YouTube search error:', err.message)
    res.status(500).json({ message: 'Search failed' })
  }
})

module.exports = router