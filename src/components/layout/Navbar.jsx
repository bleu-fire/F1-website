import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/calendrier', label: 'Calendar' },
  { to: '/mongarage', label: 'My Garage' },
  { to: '/masaison', label: 'My Season' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label="Pitlane home">
          PITLANE
        </Link>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {links.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Live pill */}
        <span className={styles.live} aria-hidden="true">
          <span className={styles.liveDot} />
          2026
        </span>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <ul className={styles.drawerLinks} role="list">
          {links.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${styles.drawerLink} ${isActive ? styles.drawerActive : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
