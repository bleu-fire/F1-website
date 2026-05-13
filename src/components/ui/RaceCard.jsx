import { useRef } from 'react'
import Badge from './Badge'
import styles from './RaceCard.module.css'

export default function RaceCard({
  race,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched,
  onClick,
  variant = 'default',
}) {
  const starRef = useRef(null)

  const handleFavorite = (e) => {
    e.stopPropagation()
    if (starRef.current) {
      starRef.current.classList.remove(styles.starPop)
      void starRef.current.offsetWidth // reflow
      starRef.current.classList.add(styles.starPop)
    }
    onToggleFavorite(race.id)
  }

  const handleWatched = (e) => {
    e.stopPropagation()
    onToggleWatched(race.id)
  }

  const formatDate = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    const opts = { month: 'short', day: 'numeric' }
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
  }

  return (
    <article
      className={`${styles.card} ${styles[variant]} ${race.type === 'sprint' ? styles.sprint : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${race.name} — Round ${race.round}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className={styles.accentBar} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.flag} aria-label={race.country}>{race.flag}</span>
          <div className={styles.meta}>
            <span className={styles.round}>Round {String(race.round).padStart(2, '0')}</span>
            <span className={styles.country}>{race.city}, {race.country}</span>
          </div>
        </div>

        <h3 className={styles.name}>{race.name}</h3>
        <p className={styles.circuit}>{race.circuit}</p>

        <p className={styles.date}>{formatDate(race.dateStart, race.dateEnd)}</p>

        {variant === 'default' && race.description && (
          <p className={styles.description}>{race.description.slice(0, 100)}…</p>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.badges}>
          {race.type === 'sprint' && <Badge label="Sprint" variant="sprint" />}
          {race.isNew && <Badge label="New Circuit" variant="new" />}
          <Badge label={race.continent} variant="continent" />
          {isWatched && <Badge label="Watched" variant="watched" />}
        </div>
        <div className={styles.actions}>
          <button
            ref={starRef}
            className={`${styles.actionBtn} ${isFavorite ? styles.favorited : ''}`}
            onClick={handleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <button
            className={`${styles.actionBtn} ${isWatched ? styles.watched : ''}`}
            onClick={handleWatched}
            aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
            title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
          >
            {isWatched ? '👁' : '👁‍🗨'}
          </button>
        </div>
      </div>
    </article>
  )
}
