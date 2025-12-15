import { useState } from 'react'

export default function WorkoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    weightUnit: 'kg',
    notes: '',
    date: new Date().toISOString().split('T')[0],
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

    onSubmit({
      ...formData,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: parseFloat(formData.weight),
    })

    // Reset form
    setFormData({
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      weightUnit: 'kg',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Exercise Name</label>
        <input
          type="text"
          name="exercise"
          value={formData.exercise}
          onChange={handleChange}
          placeholder="e.g., Bench Press"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
        {errors.exercise && <span className="text-red-400 text-sm">{errors.exercise}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sets</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            placeholder="3"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          />
          {errors.sets && <span className="text-red-400 text-sm">{errors.sets}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reps</label>
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            placeholder="10"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          />
          {errors.reps && <span className="text-red-400 text-sm">{errors.reps}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="100"
            step="0.5"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          />
          <select
            name="weightUnit"
            value={formData.weightUnit}
            onChange={handleChange}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        {errors.weight && <span className="text-red-400 text-sm">{errors.weight}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="How did it feel? Any observations?"
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded transition-colors"
      >
        Log Workout
      </button>
    </form>
  )
}
