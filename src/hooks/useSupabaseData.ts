import { useState, useEffect } from 'react'
import { challengesApi, miniGamesApi, rewardsApi, Challenge, MiniGame, Reward } from '@/lib/supabase'

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true)
        const data = await challengesApi.getActive()
        setChallenges(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch challenges')
        console.error('Error fetching challenges:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  const updateChallengeProgress = async (id: string, progress: number) => {
    try {
      await challengesApi.updateProgress(id, progress)
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === id 
            ? { ...challenge, progress, updated_at: new Date().toISOString() }
            : challenge
        )
      )
    } catch (err) {
      console.error('Error updating challenge progress:', err)
      throw err
    }
  }

  return { challenges, loading, error, updateChallengeProgress }
}

export function useMiniGames() {
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMiniGames() {
      try {
        setLoading(true)
        const data = await miniGamesApi.getActive()
        setMiniGames(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch mini games')
        console.error('Error fetching mini games:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMiniGames()
  }, [])

  return { miniGames, loading, error }
}

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRewards() {
      try {
        setLoading(true)
        const data = await rewardsApi.getAvailable()
        setRewards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rewards')
        console.error('Error fetching rewards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  return { rewards, loading, error }
}