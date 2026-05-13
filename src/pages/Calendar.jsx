import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { races } from '../data/races'
import { useFavorites } from '../hooks/useFavorites'
import { useWatched } from '../hooks/useWatched'
import RaceCard from '../components/ui/RaceCard'
import FilterBar from '../components/sections/FilterBar'
import styles from './Calendar.module.css'

gsap.registerPlugin(Flip)

const CONTINENTS = [...new Set(races.map((r) => r.continent))].sort()

export default function Calendar() {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()
  const [filters, setFilters] = useState({ continent: 'all', type: 'all' })

  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const prevFiltersRef = useRef(filters)

  const filtered = races.filter((r) => {
    if (filters.continent !== 'all' && r.continent !== filters.continent) return false
    if (filters.type !== 'all' && r.type !== filters.type) return false
    return true
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // GSAP Flip on filter change
  useEffect(() => {
    if (prefersReducedMotion) return
    if (!cardRefs.current.length) return

    const validCards = cardRefs.current.filter(Boolean)
    if (!validCards.length) return

    const state = Flip.getState(validCards)
    prevFiltersRef.current = filters

    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.inOut',
      stagger: 0.04,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
    })
  }, [filters, prefersReducedMotion])

  // Page entry animation
  const titleRef = useRef(null)
  const filterRef = useRef(null)
  useGSAP(() => {
    if (prefersReducedMotion) return
    gsap.fromTo(
      [titleRef.current, filterRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
    )
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div ref={titleRef}>
            <span className={styles.tag}>2026 SEASON</span>
            <h1 className={styles.title}>Calendrier 2026</h1>
            <p className={styles.count}>
              {filtered.length} of {races.length} races
            </p>
          </div>
        </div>

        <div ref={filterRef}>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            continentOptions={CONTINENTS}
          />
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No races match your filters.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((race, i) => (
              <div
                key={race.id}
                ref={(el) => { cardRefs.current[i] = el }}
                data-flip-id={`race-${race.id}`}
              >
                <RaceCard
                  race={race}
                  isFavorite={isFavorite(race.id)}
                  isWatched={isWatched(race.id)}
                  onToggleFavorite={toggleFavorite}
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
