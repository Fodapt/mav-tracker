import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const Timer = forwardRef((props, ref) => {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Expose start method to parent via ref
  useImperativeHandle(ref, () => ({
    start: () => {
      setSeconds(0)
      setIsRunning(true)
    }
  }))

  const stop = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isRunning) return null

  return (
    <div className="timer-float">
      <span className="timer-display">{formatTime(seconds)}</span>
      <button 
        onClick={stop}
        style={{
          background: 'none',
          border: 'none',
          color: '#ef4444',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        ⬛
      </button>
    </div>
  )
})

Timer.displayName = 'Timer'

export default Timer
