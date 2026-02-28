'use client'

import { useEffect, useState } from 'react'
import { staticCards, type CardEntry } from '@/data/cards'

interface UseCardsResult {
  cards: CardEntry[]
  loading: boolean
  error: string | null
}

/**
 * Fetches cards from /api/cards.
 * Falls back to the static seed array if the API is unreachable.
 */
export function useCards(): UseCardsResult {
  const [cards, setCards] = useState<CardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/cards', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) {
          setCards(Array.isArray(json.data) ? json.data : staticCards)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          // silently fall back to static data
          setCards(staticCards)
          setError(err instanceof Error ? err.message : 'Failed to fetch cards')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { cards, loading, error }
}
