export type ExplorePromptType = 'skill' | 'command' | 'prompt' | 'rule'

export interface ExplorePrompt {
  id: string
  name: string
  description?: string
  type: ExplorePromptType
  platform: string
  author: string
  authorAvatar?: string
  stars: number
  repoUrl: string
  filePath?: string
  source: 'cursor' | 'claude'
  content: string
  tags?: string[]
  language?: string
  githubUpdatedAt?: string
  syncedAt: string
  createdAt: string
  updatedAt: string
}

export interface ExplorePromptGroup extends ExplorePrompt {
  versions?: ExplorePrompt[]
  versionCount: number
}

export interface TypeCounts {
  all: number
  skill: number
  command: number
  prompt: number
  rule: number
}

export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface ExploreApiResponse {
  success: boolean
  data: ExplorePromptGroup[]
  count: number
  pagination?: PaginationMeta
  typeCounts?: TypeCounts
}
