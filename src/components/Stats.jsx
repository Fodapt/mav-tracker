import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { extractPersonalRecords, extractProgressData, formatDate } from '../utils/calculations'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Stats({ workouts }) {
  const [selectedExercise, setSelectedExercise] = useState('')
  const [exercises, setExercises] = useState([])
  const [personalRecords, setPersonalRecords] = useState([])

  useEffect(() => {
    // Estrai lista esercizi unici
    const uniqueExercises = new Set()
    workouts.forEach(w => {
      (w.workout_exercises || []).forEach(we => {
        if (we.exercise?.name) {
          uniqueExercises.add(we.exercise.name)
        }
      })
    })
    setExercises([...uniqueExercises].sort())

    // Estrai PR
    setPersonalRecords(extractPersonalRecords(workouts))
  }, [workouts])

  const getChartData = () => {
    if (!selectedExercise) return null

    const dataPoints = extractProgressData(workouts, selectedExercise)
    
    if (dataPoints.length === 0) return null

    return {
      labels: dataPoints.map(d => formatDate(d.date, { day: 'numeric', month: 'short' })),
      datasets: [
        {
          label: `Max Kg ${selectedExercise}`,
          data: dataPoints.map(d => d.weight),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Peso (kg)'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  }

  const chartData = getChartData()

  return (
    <>
      <div className="header">
        <h1>Statistiche</h1>
        <p>Progressi</p>
      </div>

      <div className="content">
        <div className="form-group">
          <label className="form-label">Grafico (Max/MAV)</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="form-select"
            disabled={exercises.length === 0}
          >
            <option value="">
              {exercises.length === 0 ? 'Nessun dato' : 'Seleziona...'}
            </option>
            {exercises.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {chartData && (
          <div className="card">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>🏆 Record (MAV/MAX)</h3>
          {personalRecords.length === 0 ? (
            <div className="loading">Nessun PR registrato</div>
          ) : (
            personalRecords.map(pr => (
              <div
                key={pr.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: '#f5f5f5',
                  marginBottom: '6px',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontWeight: '500' }}>{pr.name}</span>
                <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>
                  {pr.weight} kg
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
