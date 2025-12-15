import { useState, useEffect } from 'react'
import WorkoutForm from '../components/WorkoutForm'
import WorkoutList from '../components/WorkoutList'
import PerformanceGraph from '../components/PerformanceGraph'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSkipDay, setShowSkipDay] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')

  // Fetch all workouts
  const fetchWorkouts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch workouts')
      const data = await response.json()
      setWorkouts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add a new workout
  const handleAddWorkout = async (workout) => {
    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workout),
      })
      if (!response.ok) throw new Error('Failed to add workout')
      const newWorkout = await response.json()
      setWorkouts([newWorkout, ...workouts])
    } catch (err) {
      setError(err.message)
    }
  }

  // Skip a day
  const handleSkipDay = async () => {
    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skipDay: true,
          date: new Date(),
        }),
      })
      if (!response.ok) throw new Error('Failed to skip day')
      const newSkip = await response.json()
      setWorkouts([newSkip, ...workouts])
      setShowSkipDay(false)
    } catch (err) {
      setError(err.message)
    }
  }

  // Update a workout
  const handleUpdateWorkout = async (id, updatedWorkout) => {
    try {
      const response = await fetch(`${API_URL}/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedWorkout),
      })
      if (!response.ok) throw new Error('Failed to update workout')
      const data = await response.json()
      setWorkouts(workouts.map(w => w._id === id ? data : w))
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete a workout
  const handleDeleteWorkout = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete workout')
      setWorkouts(workouts.filter(w => w._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💪 Gym Logger</h1>
          <div className="user-section">
            <div className="user-info">
              {user.profilePicture && (
                <img src={user.profilePicture} alt={user.name} className="user-avatar" />
              )}
              <span className="user-name">{user.name}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {/* Top Section: Form and Graph */}
        <div className="top-section">
          <div className="form-section">
            <div className="card">
              <h2>Log Workout</h2>
              <WorkoutForm onSubmit={handleAddWorkout} />
              <button 
                className="skip-day-btn"
                onClick={() => setShowSkipDay(!showSkipDay)}
              >
                ⏭️ Skip This Day
              </button>
              {showSkipDay && (
                <div className="skip-confirmation">
                  <p>Mark this day as skipped?</p>
                  <div className="skip-actions">
                    <button className="btn-confirm" onClick={handleSkipDay}>Confirm</button>
                    <button className="btn-cancel" onClick={() => setShowSkipDay(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="graph-section">
            <div className="card">
              <h2>Performance Overview</h2>
              <PerformanceGraph workouts={workouts} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Workout History */}
        <div className="history-section">
          <div className="card">
            <h2>
              Workout History
              {workouts.length > 0 && (
                <span className="workout-count">({workouts.length})</span>
              )}
            </h2>
            {loading ? (
              <div className="loading">Loading workouts...</div>
            ) : workouts.length === 0 ? (
              <div className="empty-state">
                <p>No workouts yet. Start logging your exercises!</p>
              </div>
            ) : (
              <WorkoutList
                workouts={workouts}
                onUpdate={handleUpdateWorkout}
                onDelete={handleDeleteWorkout}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
