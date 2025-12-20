import { useState, useEffect } from 'react'
import WorkoutForm from '../components/WorkoutForm'
import WorkoutList from '../components/WorkoutList'
import PerformanceGraph from '../components/PerformanceGraph'
import './Dashboard.css'

// Helper function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Dashboard({ user, onLogout }) {
  const [allWorkouts, setAllWorkouts] = useState([])
  const [displayedWorkouts, setDisplayedWorkouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSkipDay, setShowSkipDay] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const WORKOUTS_PER_PAGE = 10

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')

  // Fetch all workouts (only once on mount)
  const fetchWorkouts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.status === 401) {
        setError('Session expired. Please sign in again.')
        onLogout()
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const apiMessage = errorData.message || 'Failed to fetch workouts'
        throw new Error(apiMessage)
      }

      const data = await response.json()
      setAllWorkouts(data)
      setCurrentPage(1)
      updateDisplayedWorkouts(data, 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update displayed workouts based on current page
  const updateDisplayedWorkouts = (workoutsList, page) => {
    const startIndex = (page - 1) * WORKOUTS_PER_PAGE
    const endIndex = startIndex + WORKOUTS_PER_PAGE
    setDisplayedWorkouts(workoutsList.slice(0, endIndex))
  }

  // Load more workouts
  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    updateDisplayedWorkouts(allWorkouts, nextPage)
  }

  // Check if there are more workouts to load
  const hasMore = displayedWorkouts.length < allWorkouts.length

  // Export workouts to CSV
  const exportToCsv = () => {
    if (!allWorkouts.length) {
      setError('No workouts to export yet')
      return
    }

    const headers = [
      'Exercise',
      'Sets',
      'Reps',
      'Weight',
      'Weight Unit',
      'Rest (sec)',
      'Date',
      'Notes',
      'Skip Day',
    ]

    const rows = allWorkouts.map((w) => {
      const volumeDate = w.date ? new Date(w.date).toISOString() : ''
      return [
        w.exercise || 'N/A',
        w.sets ?? '',
        w.reps ?? '',
        w.weight ?? '',
        w.weightUnit || '',
        w.rest ?? '',
        volumeDate,
        w.notes || '',
        w.skipDay ? 'Yes' : 'No',
      ]
    })

    const escapeField = (field) => `"${String(field ?? '').replace(/"/g, '""')}"`
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeField).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'workouts-export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export workouts to PDF (uses dynamic import to avoid bundling unless clicked)
  const exportToPdf = async () => {
    if (!allWorkouts.length) {
      setError('No workouts to export yet')
      return
    }

    setError('')

    try {
      const getJsPdf = () => new Promise((resolve, reject) => {
        if (window.jspdf?.jsPDF) {
          resolve(window.jspdf.jsPDF)
          return
        }

        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
        script.async = true
        script.onload = () => {
          if (window.jspdf?.jsPDF) {
            resolve(window.jspdf.jsPDF)
          } else {
            reject(new Error('jsPDF failed to load'))
          }
        }
        script.onerror = () => reject(new Error('Failed to load jsPDF'))
        document.body.appendChild(script)
      })

      const JsPdfCtor = await getJsPdf()

      const doc = new JsPdfCtor({ unit: 'pt', format: 'a4' })
      const margin = 40
      let y = margin
      const lineHeight = 18
      const maxY = doc.internal.pageSize.getHeight() - margin

      const addLine = (text, isHeader = false) => {
        if (y > maxY) {
          doc.addPage()
          y = margin
        }
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal')
        doc.text(text, margin, y)
        y += lineHeight
      }

      addLine('Localhost Gym — Workouts Export', true)
      addLine(`Exported: ${new Date().toLocaleString()}`)
      addLine('')
      addLine('Exercise | Sets | Reps | Weight | Unit | Rest(s) | Date | Notes | Skip', true)

      allWorkouts.forEach((w) => {
        const dateStr = w.date ? new Date(w.date).toLocaleString() : ''
        const row = [
          w.exercise || 'N/A',
          w.sets ?? '',
          w.reps ?? '',
          w.weight ?? '',
          w.weightUnit || '',
          w.rest ?? '',
          dateStr,
          (w.notes || '').slice(0, 80),
          w.skipDay ? 'Yes' : 'No',
        ].join(' | ')
        addLine(row)
      })

      doc.save('workouts-export.pdf')
    } catch (err) {
      setError(err.message || 'Failed to export PDF')
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
      const updated = [newWorkout, ...allWorkouts]
      setAllWorkouts(updated)
      setCurrentPage(1)
      updateDisplayedWorkouts(updated, 1)
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
      const updated = [newSkip, ...allWorkouts]
      setAllWorkouts(updated)
      setCurrentPage(1)
      updateDisplayedWorkouts(updated, 1)
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
      const updated = allWorkouts.map(w => w._id === id ? data : w)
      setAllWorkouts(updated)
      setCurrentPage(1)
      updateDisplayedWorkouts(updated, 1)
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
      const updated = allWorkouts.filter(w => w._id !== id)
      setAllWorkouts(updated)
      setCurrentPage(1)
      updateDisplayedWorkouts(updated, 1)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  // Close mobile menu when resizing to desktop widths
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="dashboard">
      {/* Minimal Mobile Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏋️ Localhost Gym</h1>
          </div>
          
          {/* Desktop User Section */}
          <div className="user-section desktop-only">
            <div className="user-info">
              <div className="user-avatar-initials">
                {getInitials(user.name)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
              <button onClick={exportToPdf} className="export-btn secondary">Export PDF</button>
            <button onClick={exportToCsv} className="export-btn">Export CSV</button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-user-info">
              <div className="user-avatar-initials">
                {getInitials(user.name)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                exportToCsv()
                setMobileMenuOpen(false)
              }}
              className="export-btn mobile-export"
            >
              Export CSV
            </button>
            <button 
              onClick={() => {
                exportToPdf()
                setMobileMenuOpen(false)
              }}
              className="export-btn mobile-export secondary"
            >
              Export PDF
            </button>
            <button 
              onClick={() => {
                onLogout()
                setMobileMenuOpen(false)
              }} 
              className="logout-btn mobile-logout"
            >
              Logout
            </button>
          </div>
        )}
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
              <PerformanceGraph workouts={allWorkouts} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Workout History */}
        <div className="history-section">
          <div className="card">
            <h2>
              Workout History
              {allWorkouts.length > 0 && (
                <span className="workout-count">({allWorkouts.length})</span>
              )}
            </h2>
            {loading ? (
              <div className="loading">Loading workouts...</div>
            ) : allWorkouts.length === 0 ? (
              <div className="empty-state">
                <p>No workouts yet. Start logging your exercises!</p>
              </div>
            ) : (
              <>
                <WorkoutList
                  workouts={displayedWorkouts}
                  onUpdate={handleUpdateWorkout}
                  onDelete={handleDeleteWorkout}
                />
                {hasMore && (
                  <button className="load-more-btn" onClick={loadMore}>
                    Load More ({displayedWorkouts.length}/{allWorkouts.length})
                  </button>
                )}
                {!hasMore && allWorkouts.length > 0 && (
                  <div className="all-loaded">
                    ✓ All {allWorkouts.length} workouts loaded
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
