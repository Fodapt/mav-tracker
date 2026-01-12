import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export function useWorkouts(userId) {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadWorkouts()
      loadExercises()
    }
  }, [userId])

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises(
            *,
            exercise:exercises(*),
            sets:workout_sets(*)
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setWorkouts(data || [])
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name')

      if (error) throw error
      setExercises(data || [])
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  const saveWorkout = async (workoutData, isEdit = false, workoutId = null) => {
    try {
      let finalWorkoutId = workoutId

      if (isEdit) {
        // Update existing workout
        const { error: updateError } = await supabase
          .from('workouts')
          .update({
            date: workoutData.date,
            notes: workoutData.notes
          })
          .eq('id', workoutId)

        if (updateError) throw updateError

        // Delete old exercises (cascade will delete sets)
        await supabase
          .from('workout_exercises')
          .delete()
          .eq('workout_id', workoutId)
      } else {
        // Create new workout
        const { data, error } = await supabase
          .from('workouts')
          .insert({
            user_id: userId,
            date: workoutData.date,
            notes: workoutData.notes
          })
          .select()
          .single()

        if (error) throw error
        finalWorkoutId = data.id
      }

      // Insert exercises and sets
      for (const ex of workoutData.exercises) {
        if (ex.sets.length === 0) continue

        // Find or create exercise
        let exerciseId
        const { data: existingEx } = await supabase
          .from('exercises')
          .select('id')
          .eq('name', ex.name)
          .single()

        if (existingEx) {
          exerciseId = existingEx.id
        } else {
          const { data: newEx } = await supabase
            .from('exercises')
            .insert({ name: ex.name })
            .select()
            .single()
          exerciseId = newEx.id
        }

        // Link to workout
        const { data: workoutExercise, error: weError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: finalWorkoutId,
            exercise_id: exerciseId
          })
          .select()
          .single()

        if (weError) throw weError

        // Insert sets
        const setsToInsert = ex.sets.map(s => ({
          workout_exercise_id: workoutExercise.id,
          weight: s.weight,
          reps: s.reps,
          type: s.type
        }))

        if (setsToInsert.length > 0) {
          const { error: setsError } = await supabase
            .from('workout_sets')
            .insert(setsToInsert)

          if (setsError) throw setsError
        }
      }

      await loadWorkouts()
      return true
    } catch (error) {
      console.error('Error saving workout:', error)
      throw error
    }
  }

  const deleteWorkout = async (workoutId) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)

      if (error) throw error
      await loadWorkouts()
      return true
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw error
    }
  }

  return {
    workouts,
    exercises,
    loading,
    loadWorkouts,
    saveWorkout,
    deleteWorkout
  }
}
