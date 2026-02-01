import { ExploreApiResponse } from '../types'

const API_URL = 'https://app.promptking.online/api/explore'

export async function fetchExploreData(): Promise<ExploreApiResponse> {
  const res = await fetch(`${API_URL}?limit=500&include_counts=true&group_by_name=true`, {
    cache: 'force-cache',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch explore data: ${res.status}`)
  }

  return res.json()
}
