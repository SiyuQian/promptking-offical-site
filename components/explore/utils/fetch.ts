import { ExploreApiResponse } from '../types'

const API_URL = 'https://app.promptking.online/api/explore'

export async function fetchExploreData(): Promise<ExploreApiResponse> {
  try {
    const res = await fetch(`${API_URL}?limit=500&include_counts=true&group_by_name=true`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      console.warn(`API returned ${res.status}, using fallback data`)
      return getFallbackData()
    }

    return res.json()
  } catch (error) {
    console.warn('Failed to fetch explore data, using fallback:', error)
    return getFallbackData()
  }
}

function getFallbackData(): ExploreApiResponse {
  return {
    success: true,
    data: [],
    count: 0,
    typeCounts: {
      all: 0,
      skill: 0,
      command: 0,
      prompt: 0,
      rule: 0,
    },
  }
}
