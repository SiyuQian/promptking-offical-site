import { ExplorePromptGroup, ExplorePromptType, TypeCounts } from '../types'

export function searchPrompts(
  items: ExplorePromptGroup[],
  query: string
): ExplorePromptGroup[] {
  if (!query.trim()) return items

  const lowerQuery = query.toLowerCase()

  return items.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(lowerQuery)
    const descMatch = item.description?.toLowerCase().includes(lowerQuery)
    const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))

    return nameMatch || descMatch || tagMatch
  })
}

export function filterByType(
  items: ExplorePromptGroup[],
  type: ExplorePromptType | 'all'
): ExplorePromptGroup[] {
  if (type === 'all') return items
  return items.filter(item => item.type === type)
}

export function calculateTypeCounts(items: ExplorePromptGroup[]): TypeCounts {
  return {
    all: items.length,
    skill: items.filter(i => i.type === 'skill').length,
    command: items.filter(i => i.type === 'command').length,
    prompt: items.filter(i => i.type === 'prompt').length,
    rule: items.filter(i => i.type === 'rule').length,
  }
}

export function paginateItems<T>(
  items: T[],
  offset: number,
  limit: number
): { items: T[]; hasMore: boolean } {
  const paginated = items.slice(offset, offset + limit)
  return {
    items: paginated,
    hasMore: offset + limit < items.length,
  }
}
