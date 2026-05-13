import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pitlane_watched'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useWatched() {
  const [watched, setWatched] = useState(loadFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watched))
    } catch {
      // storage unavailable — silent fail
    }
  }, [watched])

  const toggleWatched = (raceId) => {
    setWatched((prev) =>
      prev.includes(raceId)
        ? prev.filter((id) => id !== raceId)
        : [...prev, raceId]
    )
  }

  const isWatched = (raceId) => watched.includes(raceId)

  return { watched, toggleWatched, isWatched }
}
