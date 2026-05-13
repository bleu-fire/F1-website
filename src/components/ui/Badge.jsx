import styles from './Badge.module.css'

export default function Badge({ label, variant }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  )
}
