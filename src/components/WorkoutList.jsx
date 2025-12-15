import { useState } from 'react'
import WorkoutCard from './WorkoutCard'
import './WorkoutList.css'

export default function WorkoutList({ workouts, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

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

  return (
    <div className="workout-list">
      {workouts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No workouts yet. Start logging to see your history!</p>
        </div>
      ) : (
        workouts.map(workout => (
          <div key={workout._id}>
            {editingId === workout._id ? (
              <div className="edit-form-container">
                <h3 className="edit-form-title">Edit Workout</h3>
                <div className="edit-form-grid">
                  <div className="edit-form-group">
                    <label>Exercise</label>
                    <input
                      type="text"
                      value={editData.exercise}
                      onChange={(e) => handleEditChange('exercise', e.target.value)}
                      className="edit-form-input"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Sets</label>
                    <input
                      type="number"
                      value={editData.sets}
                      onChange={(e) => handleEditChange('sets', parseInt(e.target.value))}
                      className="edit-form-input"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Reps</label>
                    <input
                      type="number"
                      value={editData.reps}
                      onChange={(e) => handleEditChange('reps', parseInt(e.target.value))}
                      className="edit-form-input"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Weight</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editData.weight}
                      onChange={(e) => handleEditChange('weight', parseFloat(e.target.value))}
                      className="edit-form-input"
                    />
                  </div>
                </div>
                <div className="edit-form-group">
                  <label>Notes</label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => handleEditChange('notes', e.target.value)}
                    rows="2"
                    className="edit-form-input"
                  />
                </div>
                <div className="edit-form-actions">
                  <button
                    onClick={handleSaveEdit}
                    className="edit-btn-save"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="edit-btn-cancel"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <WorkoutCard
                workout={workout}
                onEdit={() => handleEditClick(workout)}
                onDelete={() => onDelete(workout._id)}
              />
            )}
          </div>
        ))
      )}
    </div>
  )
}
