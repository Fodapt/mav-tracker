import { useState } from 'react'
import { calculateExerciseTonnage, generateMAVSequence } from '../../utils/calculations'

const getTypeAbbr = (type) => {
  const abbr = {
    'WARMUP': 'W',
    'RAMP': 'R',
    'MAV': 'M',
    'BACKOFF': 'B',
    'STANDARD': 'S',
    'MAX': 'MAX',
    'AMRAP': 'AMRAP'
  }
  return abbr[type] || type.substr(0, 1)
}

export default function ExerciseBlock({ 
  exercise, 
  onRemove, 
  onSetAdd, 
  onSetRemove,
  onSetEdit,
  onStartTimer,
  editingSetKey 
}) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [type, setType] = useState('STANDARD')
  
  // Quick add multi-sets
  const [quickSets, setQuickSets] = useState('')
  const [quickReps, setQuickReps] = useState('')
  const [quickWeight, setQuickWeight] = useState('')
  const [quickType, setQuickType] = useState('STANDARD')
  
  const [editWeight, setEditWeight] = useState('')
  const [editReps, setEditReps] = useState('')
  const [editType, setEditType] = useState('')

  const totalLoad = calculateExerciseTonnage(exercise.sets)

  const handleAddSet = () => {
    const w = parseFloat(weight)
    const r = parseInt(reps)
    
    if (!w || !r || w <= 0 || r <= 0) {
      alert('Inserisci peso e ripetizioni validi')
      return
    }
    
    onSetAdd(exercise.id, { weight: w, reps: r, type })
    setWeight('')
    setReps('')
  }

  const handleAddMultipleSets = () => {
    const numSets = parseInt(quickSets)
    const r = parseInt(quickReps)
    const w = parseFloat(quickWeight)
    
    if (!numSets || !r || !w || numSets <= 0 || r <= 0 || w <= 0) {
      alert('Inserisci valori validi per serie multiple')
      return
    }
    
    if (numSets > 10) {
      alert('Massimo 10 serie alla volta')
      return
    }
    
    for (let i = 0; i < numSets; i++) {
      onSetAdd(exercise.id, { weight: w, reps: r, type: quickType })
    }
    
    setQuickSets('')
    setQuickReps('')
    setQuickWeight('')
  }

  const handleMAVSequence = () => {
    const target = parseFloat(prompt('Target MAV (kg)?', '100'))
    if (!target || target <= 0) return
    
    const sequence = generateMAVSequence(target)
    sequence.forEach(set => onSetAdd(exercise.id, set))
  }

  const handleEditStart = (setIndex) => {
    const set = exercise.sets[setIndex]
    setEditWeight(set.weight)
    setEditReps(set.reps)
    setEditType(set.type)
    onSetEdit(`${exercise.id}-${setIndex}`, 'start')
  }

  const handleEditSave = (setIndex) => {
    const w = parseFloat(editWeight)
    const r = parseInt(editReps)
    
    if (!w || !r || w <= 0 || r <= 0) {
      alert('Inserisci valori validi')
      return
    }
    
    onSetEdit(`${exercise.id}-${setIndex}`, 'save', {
      weight: w,
      reps: r,
      type: editType
    })
  }

  const handleEditCancel = () => {
    onSetEdit(null, 'cancel')
  }

  return (
    <div className="exercise-block">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
        <strong>{exercise.name}</strong>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--primary)' }}>
            {totalLoad} kg
          </span>
          <button 
            onClick={() => onRemove(exercise.id)} 
            className="icon-btn" 
            style={{ color: '#ef4444' }}
            title="Elimina esercizio"
          >
            🗑️
          </button>
        </div>
      </div>

      <button 
        className="btn btn-primary btn-full" 
        style={{ marginBottom: '8px', fontSize: '12px', padding: '6px' }}
        onClick={handleMAVSequence}
      >
        ⚡ Sequenza MAV Auto
      </button>

      {/* Quick Add Multi-Sets */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px'
      }}>
        <h4 style={{
          fontSize: '12px',
          color: '#0c4a6e',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ⚡ Serie Multiple
        </h4>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="number"
            value={quickSets}
            onChange={(e) => setQuickSets(e.target.value)}
            placeholder="Serie"
            style={{ width: '50px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>×</span>
          <input
            type="number"
            value={quickReps}
            onChange={(e) => setQuickReps(e.target.value)}
            placeholder="Reps"
            style={{ width: '60px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>@</span>
          <input
            type="number"
            value={quickWeight}
            onChange={(e) => setQuickWeight(e.target.value)}
            placeholder="Kg"
            style={{ width: '70px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px' }}
          />
          <select
            value={quickType}
            onChange={(e) => setQuickType(e.target.value)}
            style={{ width: '100px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px' }}
          >
            <option value="STANDARD">STD</option>
            <option value="WARMUP">WARM</option>
            <option value="RAMP">RAMP</option>
            <option value="MAV">MAV</option>
            <option value="BACKOFF">BACK</option>
            <option value="MAX">MAX</option>
            <option value="AMRAP">AMRAP</option>
          </select>
          <button 
            className="btn btn-success btn-small" 
            onClick={handleAddMultipleSets}
            style={{ padding: '6px 10px' }}
          >
            +
          </button>
        </div>
      </div>

      <div>
        {exercise.sets.map((set, setIdx) => {
          const setKey = `${exercise.id}-${setIdx}`
          const isEditing = editingSetKey === setKey

          if (isEditing) {
            return (
              <div key={setIdx} className="set-row editing">
                <div className="inline-edit" style={{ flex: 1 }}>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    placeholder="Kg"
                    style={{ width: '70px' }}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                    placeholder="Reps"
                    style={{ width: '50px' }}
                  />
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    style={{ width: '70px' }}
                  >
                    <option value="WARMUP">WARMUP</option>
                    <option value="RAMP">RAMP</option>
                    <option value="MAV">MAV</option>
                    <option value="BACKOFF">BACKOFF</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="MAX">MAX</option>
                    <option value="AMRAP">AMRAP</option>
                  </select>
                </div>
                <div className="set-actions">
                  <button
                    onClick={() => handleEditSave(setIdx)}
                    className="icon-btn"
                    style={{ color: 'var(--success)' }}
                    title="Salva"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="icon-btn"
                    style={{ color: 'var(--danger)' }}
                    title="Annulla"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div key={setIdx} className="set-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={`set-type ${set.type.toLowerCase()}`}>
                  {getTypeAbbr(set.type)}
                </span>
                <strong>{set.weight}kg × {set.reps}</strong>
              </div>
              <div className="set-actions">
                <button
                  onClick={() => handleEditStart(setIdx)}
                  className="icon-btn"
                  style={{ color: 'var(--primary)' }}
                  title="Modifica"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onSetRemove(exercise.id, setIdx)}
                  className="icon-btn"
                  style={{ color: '#ef4444' }}
                  title="Elimina"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {!editingSetKey && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Kg"
            className="form-input"
            style={{ flex: 1 }}
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="form-input"
            style={{ width: '50px' }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
            style={{ width: '80px', padding: '4px' }}
          >
            <option value="STANDARD">STD</option>
            <option value="WARMUP">W</option>
            <option value="RAMP">R</option>
            <option value="MAV">M</option>
            <option value="BACKOFF">B</option>
            <option value="MAX">MAX</option>
            <option value="AMRAP">AMRAP</option>
          </select>
          <button className="btn btn-primary btn-small" onClick={handleAddSet}>
            +
          </button>
          <button className="btn btn-secondary btn-small" onClick={onStartTimer}>
            ⏱️
          </button>
        </div>
      )}
    </div>
  )
}
