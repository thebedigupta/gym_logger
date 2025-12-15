# Gym Logger 💪

A MERN stack web application to track your gym workouts, exercises, and fitness progress.

## Features

- ✅ Log workouts with exercise name, sets, reps, and weight
- ✅ Track workout history with dates
- ✅ Add notes to your workouts
- ✅ Edit and delete previous workouts
- ✅ Calculate total volume for each workout
- ✅ Support for both kg and lbs weight units
- ✅ Dark mode UI with Tailwind CSS
- ✅ Responsive design

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Language**: JavaScript (No TypeScript)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd gym_logger
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure your MongoDB URI:

```
MONGODB_URI=mongodb://localhost:27017/gym_logger
PORT=5000
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start both the backend server (port 5000) and the React development server (port 3000).

### Individual Development

**Start the backend server:**

```bash
npm run server
```

**Start the React frontend (in another terminal):**

```bash
npm run client
```

### Production Build

```bash
npm run build
```

## Project Structure

```
gym_logger/
├── server/
│   ├── models/
│   │   └── Workout.js          # MongoDB Workout schema
│   ├── routes/
│   │   └── workouts.js         # API routes
│   └── index.js                # Express server setup
├── src/
│   ├── components/
│   │   ├── WorkoutForm.jsx     # Form to log new workouts
│   │   ├── WorkoutList.jsx     # Display all workouts
│   │   └── WorkoutCard.jsx     # Individual workout card
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies

```

## API Endpoints

All endpoints are prefixed with `/api/workouts`

- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get a single workout
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

## Usage

1. Fill in the workout form with:

   - Exercise name (e.g., Bench Press)
   - Number of sets
   - Number of reps
   - Weight lifted
   - Weight unit (kg or lbs)
   - Workout date
   - Optional notes

2. Click "Log Workout" to save it to the database

3. View your workout history on the right side

4. Click "Edit" to modify a workout or "Delete" to remove it

## Features Explanation

- **Volume Calculation**: Automatically calculates total volume (Sets × Reps × Weight)
- **Date Tracking**: All workouts are timestamped
- **Edit Mode**: Switch any workout to edit mode to update its details
- **Responsive Design**: Works on desktop and mobile devices

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Workout statistics and charts
- [ ] Progress tracking over time
- [ ] Exercise categories and templates
- [ ] Mobile app version
- [ ] Social features (share workouts)
- [ ] AI-powered workout recommendations

## Troubleshooting

**MongoDB Connection Error**

- Ensure MongoDB is running locally or update `MONGODB_URI` with your Atlas connection string

**Port Already in Use**

- Change the port in `.env` or kill the process using the port

**CORS Errors**

- Ensure the backend server is running on port 5000
- Check that `VITE_API_URL` is correctly set

## Contributing

Feel free to fork, modify, and improve this project!

## License

MIT License - feel free to use this for personal or commercial projects.
