import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { races } from '../data/races'
import { useFavorites } from '../hooks/useFavorites'
import { useWatched } from '../hooks/useWatched'
import RaceCard from '../components/ui/RaceCard'
import EmptyState from '../components/ui/EmptyState'
import styles from './MyGarage.module.css'

gsap.registerPlugin(Flip)

export default function MyGarage() {
  const navigate = useNavigate()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()

  const containerRef = useRef(null)
  const cardRefs = useRef([])

  const savedRaces = races
    .filter((r) => favorites.includes(r.id))
    .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleRemove = (raceId) => {
    if (prefersReducedMotion) {
      toggleFavorite(raceId)
      return
    }
    const validCards = cardRefs.current.filter(Boolean)
    if (!validCards.length) {
      toggleFavorite(raceId)
      return
    }
    const state = Flip.getState(validCards)
    toggleFavorite(raceId)
    Flip.from(state, {
      duration: 0.45,
      ease: 'power2.out',
      stagger: 0.03,
      absolute: true,
      onLeave: (el) => gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.3 }),
    })
  }

  // Page entry
  const titleRef = useRef(null)
  useGSAP(() => {
    if (prefersReducedMotion) return
    if (!titleRef.current) return
    gsap.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className={styles.page}>
      <div className="container">
        <div ref={titleRef} className={styles.header}>
          <span className={styles.tag}>SAVED RACES</span>
          <h1 className={styles.title}>Mon Garage</h1>
          <p className={styles.count}>
            {savedRaces.length} race{savedRaces.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {savedRaces.length === 0 ? (
          <EmptyState
            icon="🏎️"
            title="Garage Empty"
            subtitle="Star races on the calendar to save them here"
            action={{ label: 'Browse Calendar', to: '/calendrier' }}
          />
        ) : (
          <div className={styles.grid}>
            {savedRaces.map((race, i) => (
              <div
                key={race.id}
                ref={(el) => { cardRefs.current[i] = el }}
                data-flip-id={`garage-${race.id}`}
              >
                <RaceCard
                  race={race}
                  isFavorite={isFavorite(race.id)}
                  isWatched={isWatched(race.id)}
                  onToggleFavorite={handleRemove}
                  onToggleWatched={toggleWatched}
                  onClick={() => navigate(`/calendrier/${race.id}`)}
                  variant="default"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
