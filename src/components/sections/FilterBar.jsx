import styles from './FilterBar.module.css'

export default function FilterBar({ filters, onChange, continentOptions }) {
  const types = ['all', 'standard', 'sprint']

  const setContinent = (val) => onChange({ ...filters, continent: val })
  const setType = (val) => onChange({ ...filters, type: val })

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <span className={styles.groupLabel}>Region</span>
        <div className={styles.pills}>
          {['all', ...continentOptions].map((c) => (
            <button
              key={c}
              className={`${styles.pill} ${filters.continent === c ? styles.active : ''}`}
              onClick={() => setContinent(c)}
              aria-pressed={filters.continent === c}
            >
              {c === 'all' ? 'All Regions' : c}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.group}>
        <span className={styles.groupLabel}>Format</span>
        <div className={styles.pills}>
          {types.map((t) => (
            <button
              key={t}
              className={`${styles.pill} ${filters.type === t ? styles.active : ''}`}
              onClick={() => setType(t)}
              aria-pressed={filters.type === t}
            >
              {t === 'all' ? 'All Formats' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
