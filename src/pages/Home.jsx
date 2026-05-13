import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { races } from '../data/races'
import { useFavorites } from '../hooks/useFavorites'
import { useWatched } from '../hooks/useWatched'
import CountdownTimer from '../components/ui/CountdownTimer'
import RaceCard from '../components/ui/RaceCard'
import styles from './Home.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()

  const heroTitleRef = useRef(null)
  const heroSubRef = useRef(null)
  const heroTimerRef = useRef(null)
  const heroNextRef = useRef(null)
  const cardRef = useRef(null)
  const containerRef = useRef(null)

  const now = new Date('2026-05-13T19:00:00Z')
  const nextRace = races
    .filter((r) => new Date(r.dateStart) > now)
    .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))[0]

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(() => {
    if (prefersReducedMotion) return

    const els = [
      heroTitleRef.current,
      heroSubRef.current,
      heroTimerRef.current,
      heroNextRef.current,
    ].filter(Boolean)

    gsap.fromTo(
      els,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1,
      }
    )

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
          },
        }
      )
    }
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className={styles.page}>
      {/* ── HERO ── */}
      <section className={styles.hero} aria-label="Season hero">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`${styles.heroContent} container`}>
          <h1 ref={heroTitleRef} className={styles.heroTitle}>
            Season<br />2026
          </h1>
          <p ref={heroSubRef} className={styles.heroSub}>
            24 GRANDS PRIX · 11 TEAMS · 22 DRIVERS
          </p>
          {nextRace && (
            <div ref={heroTimerRef} className={styles.heroTimer}>
              <CountdownTimer
                targetDate={nextRace.dateStart}
                label={`Next: ${nextRace.name}`}
                size="hero"
              />
            </div>
          )}
          <div ref={heroNextRef} className={styles.heroMeta}>
            {nextRace && (
              <button
                className={styles.heroBtn}
                onClick={() => navigate(`/calendrier/${nextRace.id}`)}
              >
                <span>{nextRace.flag}</span>
                <span>Round {nextRace.round} — {nextRace.city}</span>
                <span className={styles.heroBtnArrow}>→</span>
              </button>
            )}
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>SCROLL</span>
        </div>
      </section>

      {/* ── FEATURED CARD ── */}
      {nextRace && (
        <section className={styles.featured}>
          <div className="container">
            <div className={styles.featuredHeader}>
              <span className={styles.sectionTag}>UPCOMING RACE</span>
              <h2 className={styles.sectionTitle}>Next on the Grid</h2>
            </div>
            <div ref={cardRef} className={styles.featuredCard}>
              <RaceCard
                race={nextRace}
                isFavorite={isFavorite(nextRace.id)}
                isWatched={isWatched(nextRace.id)}
                onToggleFavorite={toggleFavorite}
                onToggleWatched={toggleWatched}
                onClick={() => navigate(`/calendrier/${nextRace.id}`)}
                variant="default"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── SEASON STATS ── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: '24', label: 'Grands Prix' },
              { value: '6', label: 'Sprint Weekends' },
              { value: '1', label: 'New Circuit' },
              { value: '5', label: 'Continents' },
            ].map(({ value, label }) => (
              <div key={label} className={styles.statItem}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
