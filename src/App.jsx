import { useState, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useWorkouts } from './hooks/useWorkouts'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard'
import Workout from './components/Workout'
import History from './components/History'
import Stats from './components/Stats'
import TabBar from './components/UI/TabBar'
import Toast from './components/UI/Toast'
import Timer from './components/UI/Timer'
import './styles/global.css'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { workouts, exercises, loading: workoutsLoading, saveWorkout, deleteWorkout } = useWorkouts(user?.id)
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [authMode, setAuthMode] = useState('login')
  const [showSettings, setShowSettings] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [editingWorkout, setEditingWorkout] = useState(null)
  
  const timerRef = useRef(null)

  const showToast = (message) => {
    setToastMessage(message)
  }

  const handleSaveWorkout = async (workoutData, isEdit, workoutId) => {
    await saveWorkout(workoutData, isEdit, workoutId)
    setEditingWorkout(null)
    setActiveTab('dashboard')
  }

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout)
    setActiveTab('workout')
    showToast('Modalità modifica attivata')
  }

  const handleDuplicateWorkout = (workout) => {
    const duplicated = {
      ...workout,
      date: new Date().toISOString().split('T')[0],
      notes: (workout.notes || '') + ' (copia)'
    }
    setEditingWorkout(duplicated)
    setActiveTab('workout')
    showToast('Workout duplicato - modifica e salva')
  }

  const handleCancelEdit = () => {
    setEditingWorkout(null)
  }

  const handleDeleteWorkout = async (workoutId) => {
    if (!confirm('Eliminare definitivamente questo allenamento? Questa azione non può essere annullata.')) {
      return
    }

    try {
      await deleteWorkout(workoutId)
      showToast('✓ Allenamento eliminato')
    } catch (error) {
      showToast('❌ Errore eliminazione')
    }
  }

  const handleLogout = async () => {
    if (confirm('Vuoi uscire?')) {
      await signOut()
    }
  }

  const handleTabChange = (tab) => {
    if (editingWorkout && tab !== 'workout') {
      if (!confirm('Uscire dalla modalità modifica? Le modifiche non salvate andranno perse.')) {
        return
      }
      setEditingWorkout(null)
    }
    setActiveTab(tab)
  }

  if (authLoading) {
    return (
      <div className="auth-container">
        <div className="loading">Caricamento...</div>
      </div>
    )
  }

  if (!user) {
    if (authMode === 'register') {
      return (
        <Register
          onSignUp={signUp}
          onShowLogin={() => setAuthMode('login')}
        />
      )
    }
    
    return (
      <Login
        onSignIn={signIn}
        onShowRegister={() => setAuthMode('register')}
      />
    )
  }

  return (
    <div className="app-container">
      {activeTab === 'dashboard' && (
        <Dashboard
          workouts={workouts}
          user={user}
          onShowSettings={() => setShowSettings(true)}
        />
      )}

      {activeTab === 'workout' && (
        <Workout
          exercises={exercises}
          onSaveWorkout={handleSaveWorkout}
          editingWorkout={editingWorkout}
          onCancelEdit={handleCancelEdit}
          onToast={showToast}
          timerRef={timerRef}
        />
      )}

      {activeTab === 'history' && (
        <History
          workouts={workouts}
          onEdit={handleEditWorkout}
          onDuplicate={handleDuplicateWorkout}
          onDelete={handleDeleteWorkout}
        />
      )}

      {activeTab === 'stats' && (
        <Stats workouts={workouts} />
      )}

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <Timer ref={timerRef} />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>⚙️ Impostazioni</h3>
            <div style={{ marginBottom: '16px' }}>
              Account: <strong>{user.email}</strong>
            </div>
            <button
              className="btn btn-danger btn-full"
              style={{ marginBottom: '8px' }}
              onClick={handleLogout}
            >
              🚪 Esci
            </button>
            <button
              className="btn btn-primary btn-full"
              onClick={() => setShowSettings(false)}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
