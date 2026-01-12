import { calculateWorkoutTonnage, formatDate } from '../utils/calculations'

export default function History({ workouts, onEdit, onDuplicate, onDelete }) {
  if (workouts.length === 0) {
    return (
      <>
        <div className="header">
          <h1>Storico</h1>
          <p>Allenamenti passati</p>
        </div>
        <div className="content">
          <div className="loading">Nessun allenamento registrato</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="header">
        <h1>Storico</h1>
        <p>Allenamenti passati</p>
      </div>

      <div className="content">
        {workouts.map(workout => {
          const exerciseNames = (workout.workout_exercises || [])
            .map(we => we.exercise?.name)
            .filter(Boolean)
            .join(', ')
          
          const tonnage = calculateWorkoutTonnage(workout.workout_exercises)

          return (
            <div key={workout.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <strong>{formatDate(workout.date)}</strong>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {exerciseNames || 'Nessun esercizio'}
                  </div>
                  {workout.notes && (
                    <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '2px', color: '#888' }}>
                      "{workout.notes}"
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                    {Math.round(tonnage)} kg
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-warning btn-small"
                      onClick={() => onEdit(workout)}
                      title="Modifica"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => onDuplicate(workout)}
                      title="Duplica"
                    >
                      📋
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => onDelete(workout.id)}
                      title="Elimina"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
