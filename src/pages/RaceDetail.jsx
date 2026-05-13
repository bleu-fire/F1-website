import { useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { races } from '../data/races'
import { useFavorites } from '../hooks/useFavorites'
import { useWatched } from '../hooks/useWatched'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import styles from './RaceDetail.module.css'

export default function RaceDetail() {
  const { raceId } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()

  const race = races.find((r) => r.id === raceId)

  const containerRef = useRef(null)
  const backRef = useRef(null)
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const descRef = useRef(null)
  const actionsRef = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (prefersReducedMotion || !race) return
    const els = [
      backRef.current,
      heroRef.current,
      statsRef.current,
      descRef.current,
      actionsRef.current,
    ].filter(Boolean)
    gsap.fromTo(
      els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, { scope: containerRef })

  if (!race) {
    return (
      <main style={{ padding: 'var(--space-10) 0' }}>
        <div className="container">
          <EmptyState
            icon="🚫"
            title="Race Not Found"
            subtitle="That race doesn't exist in our calendar."
            action={{ label: 'Back to Calendar', to: '/calendrier' }}
          />
        </div>
      </main>
    )
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main ref={containerRef} className={styles.page}>
      <div className="container">
        {/* Back */}
        <div ref={backRef} className={styles.back}>
          <Link to="/calendrier" className={styles.backLink}>
            ← CALENDRIER
          </Link>
        </div>

        {/* Hero */}
        <div ref={heroRef} className={styles.hero}>
          <div className={styles.heroTop}>
            <span className={styles.flag} aria-label={race.country}>{race.flag}</span>
            <div>
              <p className={styles.countryLabel}>{race.country}</p>
              <div className={styles.badges}>
                <Badge label={`Round ${String(race.round).padStart(2, '0')}`} variant="new" />
                {race.type === 'sprint' && <Badge label="Sprint Weekend" variant="sprint" />}
                {race.isNew && <Badge label="New Circuit" variant="new" />}
              </div>
            </div>
          </div>
          <h1 className={styles.raceName}>{race.name}</h1>
          <p className={styles.circuit}>{race.circuit} · {race.city}</p>
        </div>

        {/* Stats grid */}
        <div ref={statsRef} className={styles.statsGrid}>
          {[
            { label: 'Race Start', value: formatDate(race.dateStart) },
            { label: 'Race End', value: formatDate(race.dateEnd) },
            { label: 'Laps', value: race.laps },
            { label: 'Circuit Length', value: `${race.circuitLengthKm} km` },
            { label: 'Format', value: race.type.charAt(0).toUpperCase() + race.type.slice(1) },
            { label: 'Continent', value: race.continent },
          ].map(({ label, value }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statValue}>{value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div ref={descRef} className={styles.descriptionBlock}>
          <p className={styles.description}>{race.description}</p>
        </div>

        {/* Actions */}
        <div ref={actionsRef} className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isFavorite(race.id) ? styles.favorited : ''}`}
            onClick={() => toggleFavorite(race.id)}
            aria-pressed={isFavorite(race.id)}
          >
            <span aria-hidden="true">{isFavorite(race.id) ? '★' : '☆'}</span>
            {isFavorite(race.id) ? 'In Garage' : 'Add to Garage'}
          </button>
          <button
            className={`${styles.actionBtn} ${isWatched(race.id) ? styles.watchedBtn : ''}`}
            onClick={() => toggleWatched(race.id)}
            aria-pressed={isWatched(race.id)}
          >
            <span aria-hidden="true">👁</span>
            {isWatched(race.id) ? 'Watched' : 'Mark as Watched'}
          </button>
          <button
            className={styles.actionBtnSecondary}
            onClick={() => navigate('/calendrier')}
          >
            ← Back to Calendar
          </button>
        </div>
      </div>
    </main>
  )
}
