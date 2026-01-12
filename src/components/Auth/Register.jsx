import { useState } from 'react'

export default function Register({ onSignUp, onShowLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri')
      setLoading(false)
      return
    }

    try {
      await onSignUp(email, password)
      setSuccess(true)
      setTimeout(() => {
        onShowLogin()
      }, 3000)
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✅</div>
            <h1 className="auth-title">Registrazione completata!</h1>
            <p className="auth-subtitle">
              Controlla la tua email per confermare l'account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h1 className="auth-title">Crea Account</h1>
          <p className="auth-subtitle">Inizia il tuo percorso</p>
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
              placeholder="Password (min 6 caratteri)"
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
            className="btn btn-success btn-full"
            disabled={loading}
          >
            {loading ? 'Creazione...' : 'Crea Account'}
          </button>

          <button
            type="button"
            onClick={onShowLogin}
            className="btn btn-secondary btn-full"
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            Indietro
          </button>
        </form>
      </div>
    </div>
  )
}
