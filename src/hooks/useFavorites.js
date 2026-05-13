import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pitlane_favorites'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage unavailable — silent fail
    }
  }, [favorites])

  const toggleFavorite = (raceId) => {
    setFavorites((prev) =>
      prev.includes(raceId)
        ? prev.filter((id) => id !== raceId)
        : [...prev, raceId]
    )
  }

  const isFavorite = (raceId) => favorites.includes(raceId)

  return { favorites, toggleFavorite, isFavorite }
}
