export default function WorkoutCard({ workout, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      onDelete()
    }
  }

  // If it's a skip day
  if (workout.skipDay) {
    return (
      <div className="workout-card skip-day-card">
        <div className="skip-day-content">
          <span className="skip-icon">⏭️</span>
          <div className="skip-info">
            <h3>Rest Day</h3>
            <p className="skip-date">{formatDate(workout.date)}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <div className="workout-card">
      <div className="card-header">
        <div>
          <h3 className="exercise-name">{workout.exercise}</h3>
          <p className="workout-date">{formatDate(workout.date)}</p>
        </div>
        <div className="card-actions">
          <button
            onClick={onEdit}
            className="edit-btn"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <p className="stat-label">Sets</p>
          <p className="stat-value">{workout.sets}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Reps</p>
          <p className="stat-value">{workout.reps}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Weight</p>
          <p className="stat-value">{workout.weight} {workout.weightUnit}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Volume</p>
          <p className="stat-value">{(workout.sets * workout.reps * workout.weight).toFixed(0)}</p>
        </div>
      </div>

      {workout.notes && (
        <div className="notes-section">
          <p className="notes-label">Notes</p>
          <p className="notes-text">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
