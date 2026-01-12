import { useState } from 'react'

export default function Login({ onSignIn, onShowRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSignIn(email, password)
    } catch (err) {
      setError(err.message || 'Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💪</div>
          <h1 className="auth-title">MAV Tracker</h1>
          <p className="auth-subtitle">Accedi al tuo account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="form-error" style={{ marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>

          <button
            type="button"
            onClick={onShowRegister}
            className="btn btn-secondary btn-full"
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            Registrati
          </button>
        </form>
      </div>
    </div>
  )
}
