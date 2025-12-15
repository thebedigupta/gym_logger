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
    <div className="space-y-4">
      {workouts.map(workout => (
        <div key={workout._id}>
          {editingId === workout._id ? (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exercise</label>
                  <input
                    type="text"
                    value={editData.exercise}
                    onChange={(e) => handleEditChange('exercise', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sets</label>
                  <input
                    type="number"
                    value={editData.sets}
                    onChange={(e) => handleEditChange('sets', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reps</label>
                  <input
                    type="number"
                    value={editData.reps}
                    onChange={(e) => handleEditChange('reps', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editData.weight}
                    onChange={(e) => handleEditChange('weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => handleEditChange('notes', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-2 px-4 rounded transition-colors"
                >
                  Cancel
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
      ))}
    </div>
  )
}
