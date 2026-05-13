import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { races } from '../data/races'
import { useWatched } from '../hooks/useWatched'
import Badge from '../components/ui/Badge'
import FilterBar from '../components/sections/FilterBar'
import EmptyState from '../components/ui/EmptyState'
import styles from './MySeason.module.css'

gsap.registerPlugin(ScrollTrigger)

const CONTINENTS = [...new Set(races.map((r) => r.continent))].sort()

export default function MySeason() {
  const { watched, isWatched, toggleWatched } = useWatched()
  const [filters, setFilters] = useState({ continent: 'all', type: 'all' })

  const containerRef = useRef(null)
  const rowRefs = useRef([])
  const titleRef = useRef(null)

  const watchedRaces = races
    .filter((r) => watched.includes(r.id))
    .filter((r) => filters.continent === 'all' || r.continent === filters.continent)
    .filter((r) => filters.type === 'all' || r.type === filters.type)
    .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (prefersReducedMotion) return
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    }
    rowRefs.current.filter(Boolean).forEach((row) => {
      gsap.fromTo(
        row,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
          },
        }
      )
    })
  }, { scope: containerRef, dependencies: [watchedRaces.length] })

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <main ref={containerRef} className={styles.page}>
      <div className="container">
        <div ref={titleRef} className={styles.header}>
          <span className={styles.tag}>SEASON LOG</span>
          <h1 className={styles.title}>Ma Saison</h1>
          <p className={styles.count}>
            <span className={styles.countNum}>{watched.length}</span> races watched
          </p>
        </div>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          continentOptions={CONTINENTS}
        />

        {watchedRaces.length === 0 ? (
          <EmptyState
            icon="📺"
            title="Your Season Log Is Empty"
            subtitle={
              watched.length > 0
                ? 'No watched races match your current filters.'
                : 'Mark races as watched from the calendar to log them here.'
            }
            action={watched.length === 0 ? { label: 'Browse Calendar', to: '/calendrier' } : undefined}
          />
        ) : (
          <div className={styles.log} role="list">
            {watchedRaces.map((race, i) => (
              <div
                key={race.id}
                ref={(el) => { rowRefs.current[i] = el }}
                className={styles.row}
                role="listitem"
              >
                <div className={styles.rowLeft}>
                  <span className={styles.roundNum}>
                    {String(race.round).padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.rowCenter}>
                  <div className={styles.rowName}>
                    <span className={styles.flag} aria-label={race.country}>{race.flag}</span>
                    <span className={styles.raceName}>{race.name}</span>
                  </div>
                  <p className={styles.rowMeta}>
                    {race.circuit} · <span className={styles.rowDate}>{formatDate(race.dateStart)}</span>
                  </p>
                </div>
                <div className={styles.rowRight}>
                  <Badge label={race.continent} variant="continent" />
                  {race.type === 'sprint' && <Badge label="Sprint" variant="sprint" />}
                  <button
                    className={styles.removeBtn}
                    onClick={() => toggleWatched(race.id)}
                    aria-label={`Remove ${race.name} from season log`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
