import { useState, useEffect } from 'react'
import ExerciseBlock from './UI/ExerciseBlock'

export default function Workout({ 
  exercises, 
  onSaveWorkout, 
  editingWorkout, 
  onCancelEdit,
  onToast,
  timerRef
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [currentExercises, setCurrentExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState('')
  const [manualExercise, setManualExercise] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [editingSetKey, setEditingSetKey] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingWorkout) {
      setDate(editingWorkout.date)
      setNotes(editingWorkout.notes || '')
      
      setCurrentExercises(
        editingWorkout.workout_exercises.map(we => ({
          id: Date.now() + Math.random(),
          name: we.exercise.name,
          sets: we.sets.map(s => ({
            weight: s.weight,
            reps: s.reps,
            type: s.type
          }))
        }))
      )
    } else {
      setDate(new Date().toISOString().split('T')[0])
      setNotes('')
      setCurrentExercises([])
    }
    setEditingSetKey(null)
  }, [editingWorkout])

  const handleAddExercise = () => {
    const name = showManualInput && manualExercise ? manualExercise : selectedExercise
    
    if (!name) {
      onToast('Inserisci nome esercizio')
      return
    }

    setCurrentExercises([
      ...currentExercises,
      { id: Date.now(), name, sets: [] }
    ])

    setSelectedExercise('')
    setManualExercise('')
    setShowManualInput(false)
    onToast('Esercizio aggiunto')
  }

  const handleRemoveExercise = (exId) => {
    if (confirm('Rimuovere esercizio?')) {
      setCurrentExercises(currentExercises.filter(ex => ex.id !== exId))
      onToast('Esercizio rimosso')
    }
  }

  const handleSetAdd = (exId, setData) => {
    setCurrentExercises(
      currentExercises.map(ex =>
        ex.id === exId
          ? { ...ex, sets: [...ex.sets, setData] }
          : ex
      )
    )
    onToast('Set aggiunto')
  }

  const handleSetRemove = (exId, setIdx) => {
    if (confirm('Eliminare questo set?')) {
      setCurrentExercises(
        currentExercises.map(ex =>
          ex.id === exId
            ? { ...ex, sets: ex.sets.filter((_, idx) => idx !== setIdx) }
            : ex
        )
      )
      onToast('Set eliminato')
    }
  }

  const handleSetEdit = (setKey, action, newData) => {
    if (action === 'start') {
      setEditingSetKey(setKey)
    } else if (action === 'cancel') {
      setEditingSetKey(null)
    } else if (action === 'save') {
      const [exId, setIdx] = setKey.split('-')
      setCurrentExercises(
        currentExercises.map(ex =>
          ex.id === parseInt(exId)
            ? {
                ...ex,
                sets: ex.sets.map((s, idx) =>
                  idx === parseInt(setIdx) ? newData : s
                )
              }
            : ex
        )
      )
      setEditingSetKey(null)
      onToast('Set modificato')
    }
  }

  const handleSave = async () => {
    if (editingSetKey) {
      onToast('Salva o annulla prima la modifica del set')
      return
    }

    if (currentExercises.length === 0) {
      onToast('Aggiungi almeno un esercizio')
      return
    }

    const hasValidExercises = currentExercises.some(ex => ex.sets.length > 0)
    if (!hasValidExercises) {
      onToast('Aggiungi almeno un set ad un esercizio')
      return
    }

    setSaving(true)
    
    try {
      await onSaveWorkout({
        date,
        notes,
        exercises: currentExercises
      }, !!editingWorkout, editingWorkout?.id)
      
      onToast('✓ Allenamento salvato con successo!')
      
      setDate(new Date().toISOString().split('T')[0])
      setNotes('')
      setCurrentExercises([])
    } catch (error) {
      onToast('❌ Errore durante il salvataggio')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (editingSetKey) {
      onToast('Salva o annulla prima la modifica del set')
      return
    }

    if (currentExercises.length > 0 && !confirm('Annullare tutte le modifiche?')) {
      return
    }

    onCancelEdit()
    setDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setCurrentExercises([])
    setEditingSetKey(null)
    onToast('Modifiche annullate')
  }

  const handleStartTimer = () => {
    if (timerRef.current) {
      timerRef.current.start()
    }
  }

  return (
    <>
      <div className="header">
        <h1>{editingWorkout ? 'Modifica Workout' : 'Nuovo Workout'}</h1>
        <p>Registra sessione</p>
      </div>

      <div className="content">
        {editingWorkout && (
          <div className="edit-banner">
            ⚠️ MODALITÀ MODIFICA ATTIVA
            <button onClick={handleCancel} style={{ marginLeft: '10px', padding: '2px 8px', borderRadius: '4px', border: 'none', background: 'white', color: 'var(--warning)', cursor: 'pointer' }}>
              Annulla
            </button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Data</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input" rows="2" placeholder="Sensazioni..." />
        </div>

        <h3 style={{ marginBottom: '12px' }}>Esercizi</h3>

        <div>
          {currentExercises.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', marginBottom: '16px' }}>
              Nessun esercizio aggiunto
            </div>
          ) : (
            currentExercises.map(ex => (
              <ExerciseBlock key={ex.id} exercise={ex} onRemove={handleRemoveExercise} onSetAdd={handleSetAdd} onSetRemove={handleSetRemove} onSetEdit={handleSetEdit} onStartTimer={handleStartTimer} editingSetKey={editingSetKey} />
            ))
          )}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          {!showManualInput ? (
            <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} className="form-select" style={{ marginBottom: '8px' }}>
              <option value="">-- Seleziona Esercizio --</option>
              {exercises.map(ex => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={manualExercise} onChange={(e) => setManualExercise(e.target.value)} className="form-input" placeholder="Nome esercizio..." style={{ marginBottom: '8px' }} />
          )}

          <div style={{ textAlign: 'right', marginBottom: '8px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowManualInput(!showManualInput); setManualExercise(''); setSelectedExercise(''); }} style={{ fontSize: '12px', color: 'var(--primary)' }}>
              {showManualInput ? 'Seleziona dalla lista' : 'Non in lista?'}
            </a>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleAddExercise}>
            + Aggiungi Esercizio
          </button>
        </div>

        {currentExercises.length > 0 && (
          <button className="btn btn-success btn-full" style={{ marginTop: '20px' }} onClick={handleSave} disabled={saving}>
            {saving ? 'Salvataggio...' : '💾 Salva Allenamento'}
          </button>
        )}
      </div>
    </>
  )
}
