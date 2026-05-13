import { useState, useEffect, useRef } from 'react'
import styles from './CountdownTimer.module.css'

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export default function CountdownTimer({ targetDate, label = 'Next Race In', size = 'hero' }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [targetDate])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div
      className={`${styles.wrapper} ${styles[size]}`}
      aria-live="polite"
      aria-label={label}
    >
      <p className={styles.label}>{label}</p>
      {timeLeft === null ? (
        <div className={styles.raceDay}>
          <span>RACE DAY</span>
          <span aria-hidden="true">🏁</span>
        </div>
      ) : (
        <div className={styles.units}>
          <div className={styles.unit}>
            <span className={styles.number}>{pad(timeLeft.days)}</span>
            <span className={styles.unitLabel}>DAYS</span>
          </div>
          <span className={styles.sep} aria-hidden="true">—</span>
          <div className={styles.unit}>
            <span className={styles.number}>{pad(timeLeft.hours)}</span>
            <span className={styles.unitLabel}>HRS</span>
          </div>
          <span className={styles.sep} aria-hidden="true">—</span>
          <div className={styles.unit}>
            <span className={styles.number}>{pad(timeLeft.minutes)}</span>
            <span className={styles.unitLabel}>MIN</span>
          </div>
          <span className={styles.sep} aria-hidden="true">—</span>
          <div className={styles.unit}>
            <span className={styles.number}>{pad(timeLeft.seconds)}</span>
            <span className={styles.unitLabel}>SEC</span>
          </div>
        </div>
      )}
    </div>
  )
}
