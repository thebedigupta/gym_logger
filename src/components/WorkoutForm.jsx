import { useState } from 'react'
import './WorkoutForm.css'

// Convert 24h time to 12h format
const convertTo12Hour = (time24) => {
  if (!time24) return ''
  const [hours, minutes] = time24.split(':')
  let hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`
}

export default function WorkoutForm({ onSubmit }) {
  // Get today's date in LOCAL timezone (not UTC)
  const getLocalDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getLocalTimeString = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    weightUnit: 'kg',
    rest: '60',
    notes: '',
    date: getLocalDateString(),
    time: getLocalTimeString(),
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.exercise.trim()) newErrors.exercise = 'Exercise is required'
    if (!formData.sets || formData.sets <= 0) newErrors.sets = 'Sets must be greater than 0'
    if (!formData.reps || formData.reps <= 0) newErrors.reps = 'Reps must be greater than 0'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Send date and time as ISO string with India timezone offset (+05:30)
    // This ensures the exact local time the user selected is preserved
    const isoString = `${formData.date}T${formData.time}:00+05:30`
    
    onSubmit({
      ...formData,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: parseFloat(formData.weight),
      rest: parseInt(formData.rest),
      date: isoString,
    })

    // Reset form
    setFormData({
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      weightUnit: 'kg',
      rest: '60',
      notes: '',
      date: getLocalDateString(),
      time: getLocalTimeString(),
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <div className="form-group">
        <label className="form-label">Exercise Name</label>
        <input
          type="text"
          name="exercise"
          value={formData.exercise}
          onChange={handleChange}
          placeholder="e.g., Bench Press"
          className="form-input"
        />
        {errors.exercise && <span className="form-error">{errors.exercise}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Sets</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            placeholder="3"
            min="1"
            className="form-input"
          />
          {errors.sets && <span className="form-error">{errors.sets}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Reps</label>
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            placeholder="10"
            min="1"
            className="form-input"
          />
          {errors.reps && <span className="form-error">{errors.reps}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Weight</label>
        <div className="weight-input-group">
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="100"
            step="0.5"
            min="0"
            className="form-input"
          />
          <select
            name="weightUnit"
            value={formData.weightUnit}
            onChange={handleChange}
            className="form-select"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        {errors.weight && <span className="form-error">{errors.weight}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Rest Between Sets (seconds)</label>
        <input
          type="number"
          name="rest"
          value={formData.rest}
          onChange={handleChange}
          placeholder="60"
          min="0"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Time (12-hour format)</label>
          <div className="time-input-display">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
            />
            <span className="time-12h-display">{convertTo12Hour(formData.time)}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="How did it feel? Any observations?"
          className="form-textarea"
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
      >
        Log Workout
      </button>
    </form>
  )
}
