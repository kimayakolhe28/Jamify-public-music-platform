# 🎵 Jamify — Public Music Collaboration Platform

> Listen together. Publicly.

Jamify is a full-stack real-time music collaboration platform where users can create public jam rooms, discover active sessions, search and play YouTube songs, and chat with other music lovers — all synchronized in real-time.

---

## 🚀 Live Demo

> Run locally following the setup instructions below.

---

## ✨ Features

- 🔐 **User Authentication** — Register and login with JWT-based auth
- 🎙 **Create Jam Rooms** — Create public rooms with title and genre
- 🔍 **Discover Jams** — Browse all active jam rooms
- 🎵 **YouTube Music Search** — Search and play any song via YouTube API
- 🔄 **Synchronized Playback** — Everyone in the room hears the same song
- 💬 **Real-time Chat** — Chat with other listeners using Socket.IO
- 🎧 **Live Listener Count** — See how many people are in the room
- 🟢 **Spotify OAuth** — Login with Spotify (requires Spotify Premium)
- ⚡ **Redis Caching** — Active jams cached for fast response times
- 🔒 **Protected Routes** — Auth required for creating and joining jams

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js + Vite | Frontend framework |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Socket.IO Client | Real-time communication |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| Redis + ioredis | Caching layer |
| Socket.IO | WebSocket server |
| JWT + bcryptjs | Authentication |
| YouTube Data API v3 | Music search |
| Spotify OAuth 2.0 | Social login |

---

## 📁 Project Structure

jamify/

├── jamify-frontend/

│   └── src/

│       ├── pages/

│       │   ├── Home.jsx

│       │   ├── Register.jsx

│       │   ├── Login.jsx

│       │   ├── BrowseJams.jsx

│       │   ├── CreateJam.jsx

│       │   ├── JamRoom.jsx

│       │   └── SpotifyCallback.jsx

│       ├── components/

│       │   ├── Navbar.jsx

│       │   └── ProtectedRoute.jsx

│       └── services/

│           └── api.js

│

└── jamify-backend/

├── config/

│   └── redis.js

├── models/

│   ├── User.js

│   └── Jam.js

├── routes/

│   ├── auth.js

│   ├── jams.js

│   ├── music.js

│   └── spotify.js

├── middleware/

│   └── authMiddleware.js

└── server.js

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas
- Redis
- YouTube Data API v3 key
- Spotify Developer account (optional)

### 1. Clone the repository
```bash
git clone https://github.com/kimayakolhe28/Jamify-public-music-platform.git
cd Jamify-public-music-platform
```

### 2. Backend Setup
```bash
cd jamify-backend
npm install
```

Create `.env` file in `jamify-backend/`:
MONGO_URI=mongodb://localhost:27017/jamify

JWT_SECRET=your_jwt_secret

PORT=5000

YOUTUBE_API_KEY=your_youtube_api_key

SPOTIFY_CLIENT_ID=your_spotify_client_id

SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

FRONTEND_URL=http://localhost:5173

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd jamify-frontend
npm install
npm run dev
```

### 4. Make sure Redis is running
```bash
redis-cli ping
# Should return PONG
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/spotify/login | Spotify OAuth login | No |
| GET | /api/jams | Get all active jams | No |
| GET | /api/jams/:id | Get jam by ID | No |
| POST | /api/jams/create | Create a new jam | Yes |
| POST | /api/jams/join/:id | Join a jam | Yes |
| GET | /api/music/search | Search YouTube songs | No |

---

## 🏗 Architecture
React Frontend (localhost:5173)

↓

Node.js + Express (localhost:5000)

↓

┌────┴────┐

↓         ↓

MongoDB     Redis

(persistent) (cache)

↓

Socket.IO

(real-time events)

↓

YouTube API

(music search)

### Real-time Events (Socket.IO)

| Event | Direction | Purpose |
|---|---|---|
| `join_room` | Client → Server | Join a jam room |
| `room_users` | Server → Client | Update listener count |
| `send_message` | Client → Server | Send chat message |
| `receive_message` | Server → Client | Receive chat message |
| `play_song` | Client → Server | Play a song |
| `song_changed` | Server → Client | Sync song to all users |
| `pause_song` | Client → Server | Pause playback |
| `resume_song` | Client → Server | Resume playback |

### Redis Caching Strategy

| Key | TTL | Purpose |
|---|---|---|
| `active_jams` | 60s | Cache all active jams |
| `jam:{id}` | 120s | Cache individual jam |

Cache is invalidated when a new jam is created or a user joins.

---

## 🔮 Future Improvements

- Spotify currently playing track sync (requires Premium)
- Save jam playlist to Spotify after session
- User profile page with jam history
- Queue system for upcoming songs
- Mobile responsive design improvements

---

## 👩‍💻 Author

**Kimaya Kolhe**
- GitHub: [@kimayakolhe28](https://github.com/kimayakolhe28)

---

