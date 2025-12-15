export default function WorkoutCard({ workout, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      onDelete()
    }
  }

  // If it's a skip day
  if (workout.skipDay) {
    return (
      <div className="workout-card skip-day-card">
        <div className="skip-day-container">
          <div className="skip-day-content">
            <span className="skip-icon">⏭️</span>
            <div className="skip-info">
              <h3>Rest Day</h3>
              <p className="skip-date">{workout.displayDate}</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="delete-btn-skip"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // Generate set rows
  const setRows = Array.from({ length: workout.sets }, (_, i) => ({
    setNumber: i + 1,
    reps: workout.reps,
    weight: workout.weight,
    unit: workout.weightUnit
  }))

  return (
    <div className="workout-card">
      <div className="workout-header">
        <div className="workout-title-section">
          <h3 className="exercise-name">{workout.exercise}</h3>
          <p className="workout-date">{workout.displayDate}</p>
        </div>
        <div className="workout-actions">
          <button
            onClick={onEdit}
            className="action-btn edit-btn"
            title="Edit workout"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            className="action-btn delete-btn"
            title="Delete workout"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="workout-sets-table">
        <div className="table-header-row">
          <div className="table-cell set-header">SET</div>
          <div className="table-cell previous-header">PREVIOUS</div>
          <div className="table-cell weight-header">WEIGHT</div>
          <div className="table-cell reps-header">REPS</div>
          <div className="table-cell done-header">✓</div>
        </div>

        {setRows.map((set, index) => (
          <div key={index} className={`table-data-row ${index % 2 === 0 ? 'row-light' : 'row-dark'}`}>
            <div className="table-cell set-cell">
              <span className="set-number">{set.setNumber}</span>
            </div>
            <div className="table-cell previous-cell">
              <span className="previous-text">{workout.weight}{set.unit} × {set.reps}</span>
            </div>
            <div className="table-cell weight-cell">
              <span className="weight-text">{set.weight}</span>
            </div>
            <div className="table-cell reps-cell">
              <span className="reps-text">{set.reps}</span>
            </div>
            <div className="table-cell done-cell">
              <span className="done-check">✓</span>
            </div>
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="notes-section">
          <p className="notes-label">📝 Notes</p>
          <p className="notes-text">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
