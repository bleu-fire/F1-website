import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <span className={styles.logo}>PITLANE</span>
          <span className={styles.tagline}>F1 2026 Season Companion</span>
        </div>
        <p className={styles.copy}>
          © 2026 Pitlane. Data for demonstration purposes.
        </p>
      </div>
    </footer>
  )
}
