import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function PerformanceGraph({ workouts }) {
  // Filter out skip days and calculate data
  const actualWorkouts = workouts.filter(w => !w.skipDay)

  // Prepare data for volume over time
  const volumeData = actualWorkouts
    .slice()
    .reverse()
    .map((workout) => ({
      date: new Date(workout.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      volume: workout.sets * workout.reps * workout.weight,
      exercise: workout.exercise,
    }))
    .slice(-30) // Last 30 workouts

  // Prepare data for exercise distribution
  const exerciseStats = {}
  actualWorkouts.forEach((workout) => {
    if (!exerciseStats[workout.exercise]) {
      exerciseStats[workout.exercise] = {
        name: workout.exercise,
        count: 0,
        totalVolume: 0,
      }
    }
    exerciseStats[workout.exercise].count += 1
    exerciseStats[workout.exercise].totalVolume +=
      workout.sets * workout.reps * workout.weight
  })

  const exerciseData = Object.values(exerciseStats).slice(0, 10) // Top 10 exercises

  // Calculate stats
  const totalWorkouts = actualWorkouts.length
  const totalVolume = actualWorkouts.reduce(
    (sum, w) => sum + w.sets * w.reps * w.weight,
    0
  )
  const avgVolume = totalWorkouts > 0 ? (totalVolume / totalWorkouts).toFixed(0) : 0

  return (
    <div className="performance-graph">
      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <p className="stat-label">Total Workouts</p>
          <p className="stat-value">{totalWorkouts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Volume</p>
          <p className="stat-value">{totalVolume.toFixed(0)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Average Volume</p>
          <p className="stat-value">{avgVolume}</p>
        </div>
      </div>

      {/* Charts */}
      {volumeData.length > 0 ? (
        <>
          {/* Volume Over Time */}
          <div className="chart-container">
            <h3>Volume Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#667eea"
                  dot={{ fill: '#667eea', r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Volume (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Exercise Distribution */}
          {exerciseData.length > 0 && (
            <div className="chart-container">
              <h3>Top Exercises</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exerciseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#764ba2" name="Times Done" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="no-data">
          <p>Start logging workouts to see your performance graphs!</p>
        </div>
      )}
    </div>
  )
}
