import { calculateWorkoutTonnage, formatDate, formatTonnage } from '../utils/calculations'

export default function Dashboard({ workouts, user, onShowSettings }) {
  const totalWorkouts = workouts.length
  const totalTonnage = workouts.reduce((sum, w) => 
    sum + calculateWorkoutTonnage(w.workout_exercises), 0
  )

  const recentWorkouts = workouts.slice(0, 3)

  return (
    <>
      <div className="header">
        <h1>MAV Tracker</h1>
        <p>{user?.email || '-'}</p>
        <button className="config-btn" onClick={onShowSettings}>
          ⚙️
        </button>
      </div>

      <div className="content">
        <div className="stat-grid">
          <div className="stat-card">
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
              ALLENAMENTI
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)' }}>
              {totalWorkouts}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
              TONNELLAGGIO
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--success)' }}>
              {formatTonnage(totalTonnage)}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>📊 Recenti</h3>
          <div>
            {recentWorkouts.length === 0 ? (
              <div className="loading">Nessun allenamento registrato</div>
            ) : (
              recentWorkouts.map(workout => (
                <div
                  key={workout.id}
                  style={{
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                >
                  <strong>{formatDate(workout.date)}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {(workout.workout_exercises || []).length} Esercizi
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
