// Calcola tonnellaggio totale di un workout
export const calculateWorkoutTonnage = (workoutExercises) => {
  if (!workoutExercises) return 0
  
  return workoutExercises.reduce((total, we) => {
    const exerciseTonnage = (we.sets || []).reduce((sum, set) => {
      return sum + (set.weight * set.reps)
    }, 0)
    return total + exerciseTonnage
  }, 0)
}

// Calcola tonnellaggio di un singolo esercizio
export const calculateExerciseTonnage = (sets) => {
  if (!sets) return 0
  return sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
}

// Genera sequenza MAV automatica
export const generateMAVSequence = (targetWeight) => {
  if (!targetWeight || targetWeight <= 0) return []
  
  return [
    { weight: Math.round(targetWeight * 0.58), reps: 4, type: 'WARMUP' },
    { weight: Math.round(targetWeight * 0.67), reps: 2, type: 'WARMUP' },
    { weight: Math.round(targetWeight * 0.75), reps: 1, type: 'RAMP' },
    { weight: Math.round(targetWeight * 0.83), reps: 1, type: 'RAMP' },
    { weight: Math.round(targetWeight * 0.92), reps: 1, type: 'RAMP' },
    { weight: targetWeight, reps: 1, type: 'MAV' },
    { weight: Math.round(targetWeight * 0.92), reps: 2, type: 'BACKOFF' }
  ]
}

// Estrae PR (Personal Records) dai workouts
export const extractPersonalRecords = (workouts) => {
  const records = {}
  
  workouts.forEach(workout => {
    (workout.workout_exercises || []).forEach(we => {
      const recordSets = (we.sets || []).filter(s => s.type === 'MAV' || s.type === 'MAX')
      
      if (recordSets.length > 0) {
        const maxWeight = Math.max(...recordSets.map(s => s.weight))
        const exerciseName = we.exercise?.name
        
        if (exerciseName && (!records[exerciseName] || maxWeight > records[exerciseName])) {
          records[exerciseName] = maxWeight
        }
      }
    })
  })
  
  return Object.entries(records)
    .sort((a, b) => b[1] - a[1])
    .map(([name, weight]) => ({ name, weight }))
}

// Estrae dati per grafici di progressione
export const extractProgressData = (workouts, exerciseName) => {
  const dataPoints = []
  
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )
  
  sortedWorkouts.forEach(workout => {
    (workout.workout_exercises || []).forEach(we => {
      if (we.exercise?.name === exerciseName && we.sets?.length > 0) {
        const maxWeight = Math.max(...we.sets.map(s => s.weight))
        dataPoints.push({
          date: new Date(workout.date),
          weight: maxWeight
        })
      }
    })
  })
  
  return dataPoints
}

// Formatta data in italiano
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  const defaultOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  
  return date.toLocaleDateString('it-IT', { ...defaultOptions, ...options })
}

// Formatta tonnellaggio in tonnellate
export const formatTonnage = (kg) => {
  return (kg / 1000).toFixed(1) + 't'
}
