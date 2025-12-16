import { useState } from 'react'
import './WorkoutList.css'

export default function WorkoutList({ workouts, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [swipedId, setSwipedId] = useState(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleEditClick = (workout) => {
    setEditingId(workout._id)
    setEditData(workout)
  }

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveEdit = () => {
    onUpdate(editingId, editData)
    setEditingId(null)
    setEditData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e, workoutId) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe(workoutId)
  }

  const handleSwipe = (workoutId) => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setSwipedId(workoutId)
    } else if (isRightSwipe) {
      setSwipedId(null)
    }
  }

  const formatDate = (dateString) => {
    // dateString comes as 2025-12-17T14:30:00+05:30 from backend
    // Extract just the date part (YYYY-MM-DD)
    const datePart = dateString.split('T')[0]
    const [year, month, day] = datePart.split('-').map(Number)
    
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const groupByDate = (workouts) => {
    const grouped = {}
    workouts.forEach(workout => {
      const dateKey = formatDate(workout.date)
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(workout)
    })
    return grouped
  }

  const groupedWorkouts = groupByDate(workouts)

  return (
    <div className="workout-list-container">
      {workouts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">📝 No workouts yet. Start logging to see your history!</p>
        </div>
      ) : (
        <div className="date-groups">
          {Object.entries(groupedWorkouts).reverse().map(([date, dayWorkouts]) => (
            <div key={date} className="date-group">
              <div className="date-header">
                <h3 className="date-title">{date}</h3>
                <span className="workout-count">({dayWorkouts.length} exercise{dayWorkouts.length !== 1 ? 's' : ''})</span>
              </div>
              
              <div className="table-wrapper">
                <table className="workout-table">
                  <thead>
                    <tr>
                      <th className="col-exercise">Exercise</th>
                      <th className="col-sets">Sets</th>
                      <th className="col-reps">Reps</th>
                      <th className="col-weight">Weight (kg)</th>
                      <th className="col-rest">Rest (sec)</th>
                      <th className="col-notes">Notes</th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayWorkouts.map((workout) => (
                      <tr 
                        key={workout._id} 
                        className={`${editingId === workout._id ? 'editing-row' : ''} ${swipedId === workout._id ? 'swiped-row' : ''}`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={(e) => handleTouchEnd(e, workout._id)}
                      >
                        {editingId === workout._id ? (
                          <>
                            <td className="col-exercise">
                              <input
                                type="text"
                                value={editData.exercise || ''}
                                onChange={(e) => handleEditChange('exercise', e.target.value)}
                                className="edit-input"
                              />
                            </td>
                            <td className="col-sets">
                              <input
                                type="number"
                                value={editData.sets || ''}
                                onChange={(e) => handleEditChange('sets', parseInt(e.target.value))}
                                className="edit-input"
                              />
                            </td>
                            <td className="col-reps">
                              <input
                                type="number"
                                value={editData.reps || ''}
                                onChange={(e) => handleEditChange('reps', parseInt(e.target.value))}
                                className="edit-input"
                              />
                            </td>
                            <td className="col-weight">
                              <input
                                type="number"
                                step="0.5"
                                value={editData.weight || ''}
                                onChange={(e) => handleEditChange('weight', parseFloat(e.target.value))}
                                className="edit-input"
                              />
                            </td>
                            <td className="col-rest">
                              <input
                                type="number"
                                value={editData.rest || ''}
                                onChange={(e) => handleEditChange('rest', parseInt(e.target.value))}
                                className="edit-input"
                              />
                            </td>
                            <td className="col-notes">
                              <input
                                type="text"
                                value={editData.notes || ''}
                                onChange={(e) => handleEditChange('notes', e.target.value)}
                                className="edit-input"
                                placeholder="Notes..."
                              />
                            </td>
                            <td className="col-actions">
                              <button
                                onClick={handleSaveEdit}
                                className="btn-save"
                                title="Save"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="btn-cancel"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="col-exercise">
                              <span className="exercise-name">{workout.exerciseName || workout.exercise}</span>
                            </td>
                            <td className="col-sets">
                              <span className="badge badge-sets">{workout.sets}</span>
                            </td>
                            <td className="col-reps">
                              <span className="badge badge-reps">{workout.reps}</span>
                            </td>
                            <td className="col-weight">
                              <span className="badge badge-weight">{workout.weight}</span>
                            </td>
                            <td className="col-rest">
                              <span className="badge badge-rest">{workout.rest || 60}s</span>
                            </td>
                            <td className="col-notes">
                              <span className="notes-text">{workout.notes || '-'}</span>
                            </td>
                            <td className="col-actions">
                              <button
                                onClick={() => handleEditClick(workout)}
                                className="btn-edit"
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => onDelete(workout._id)}
                                className="btn-delete"
                                title="Delete"
                              >
                                🗑
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
