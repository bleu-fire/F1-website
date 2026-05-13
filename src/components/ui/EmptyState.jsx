import { Link } from 'react-router-dom'
import styles from './EmptyState.module.css'

export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className={styles.wrapper} role="status">
      <div className={styles.icon} aria-hidden="true">{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {action && (
        <Link to={action.to} className={styles.action}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
