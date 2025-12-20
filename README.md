# Gym Logger 💪

A MERN stack web application to track gym workouts, exercises, and fitness progress.

**Status:** ✅ Production Ready

---

## 🎯 Features

- ✅ **Google OAuth 2.0 Authentication** - Secure sign-in with Google
- ✅ **Log Workouts** - Track exercise name, sets, reps, weight
- ✅ **Comprehensive History** - View all past workouts
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete workouts
- ✅ **Multiple Units Support** - Both kg and lbs weight units
- ✅ **Skip Day Tracking** - Mark rest/skip days
- ✅ **Smart Date Formatting** - India timezone (+05:30) with 12-hour format
- ✅ **Notes & Details** - Add personal notes to each workout
- ✅ **Dark Mode UI** - Modern dark interface with Tailwind CSS
- ✅ **Fully Responsive** - Works on desktop, tablet, and mobile

---

## 🚀 Tech Stack

| Layer        | Technology                   | Purpose               |
| ------------ | ---------------------------- | --------------------- |
| **Frontend** | React 18, Vite, Tailwind CSS | UI & State Management |
| **Backend**  | Node.js, Express.js          | API & Server          |
| **Database** | MongoDB                      | Data Storage          |
| **Auth**     | Google OAuth 2.0, JWT        | Secure Authentication |

---

## 📋 Prerequisites

- Node.js v14+ (v18 recommended)
- MongoDB 4.4+ (local or Atlas cloud)
- npm or yarn
- Google OAuth 2.0 Client ID

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

**Create `.env` in root directory:**

```bash
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/gym_logger
PORT=5000
```

**Create `.env.local` in root directory:**

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### 3. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemctl
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Run the Application

```bash
npm run dev
```

This starts:

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

### 5. Sign In

Visit `http://localhost:5173` and click "Sign in with Google"

---

## 📁 Project Structure

```
gym_logger/
├── server/                 # Backend (Express.js)
│   ├── index.js           # Main server file
│   ├── models/            # Database models
│   │   ├── User.js
│   │   └── Workout.js
│   └── routes/            # API routes
│       ├── auth.js
│       └── workouts.js
├── src/                   # Frontend (React)
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/        # React components
│   │   ├── WorkoutForm.jsx
│   │   ├── WorkoutList.jsx
│   │   ├── WorkoutCard.jsx
│   │   └── PerformanceGraph.jsx
│   └── pages/            # Page components
│       ├── Dashboard.jsx
│       └── LandingPage.jsx
├── package.json
├── README.md
└── .env (create this)
```

---

## 🔐 API Endpoints

### Authentication

```
POST /api/auth/google
  - Google OAuth sign-in
  - Body: { googleId, email, name, profilePicture }
  - Returns: { success, token, user }

GET /api/auth/me
  - Get current user
  - Headers: Authorization: Bearer <token>
```

### Workouts

```
GET /api/workouts
  - Get all user's workouts
  - Headers: Authorization: Bearer <token>

POST /api/workouts
  - Create new workout
  - Headers: Authorization: Bearer <token>
  - Body: { exercise, sets, reps, weight, weightUnit, rest, notes, date }

GET /api/workouts/:id
  - Get single workout
  - Headers: Authorization: Bearer <token>

PUT /api/workouts/:id
  - Update workout
  - Headers: Authorization: Bearer <token>
  - Body: { updated fields }

DELETE /api/workouts/:id
  - Delete workout
  - Headers: Authorization: Bearer <token>
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development servers (backend + frontend)
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Workout Data Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  exercise: String,       // e.g., "Bench Press"
  sets: Number,          // e.g., 3
  reps: Number,          // e.g., 10
  weight: Number,        // e.g., 80
  weightUnit: String,    // "kg" or "lbs"
  rest: Number,          // Rest time in seconds
  notes: String,         // Optional notes
  date: Date,            // ISO 8601 format
  skipDay: Boolean,      // Mark as rest day
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Google OAuth Setup

### Get Your Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to **APIs & Services > Credentials**
4. Create **OAuth 2.0 Client ID** (Web Application)
5. Add authorized origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Add authorized redirect URIs:
   - `http://localhost:5173/callback`
7. Copy the **Client ID**

### Add to `.env.local`

```
VITE_GOOGLE_CLIENT_ID=<your-client-id>
VITE_API_URL=http://localhost:5000
```

---

## 🚢 Deployment

### Environment Variables for Production

```
JWT_SECRET=secure-random-string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gym_logger
PORT=5000
NODE_ENV=production
```

### Frontend

```
VITE_GOOGLE_CLIENT_ID=your-production-client-id
VITE_API_URL=https://api.yourdomain.com
```

---

## 📞 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
docker start mongodb                   # Docker
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173 | kill -9 <PID>
```

### Google Sign-In Not Working

1. Check Client ID is correct in `.env.local`
2. Verify origin URL is added to Google Cloud Console
3. Clear browser cookies and cache
4. Try in incognito mode

### CORS Errors

- Ensure backend is running on port 5000
- Check `.env` and `.env.local` are configured correctly
- Verify `VITE_API_URL` points to correct backend

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Contributing

Feel free to fork, create a branch, make changes, and submit a pull request.

---

**Last Updated:** December 20, 2025
**Version:** 1.0.0
