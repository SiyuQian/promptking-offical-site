# Explore 功能迁移实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 Explore 功能从主应用迁移到宣传站，提供首页板块和独立页面

**Architecture:** Server Component 构建时获取全量数据，客户端组件处理搜索/筛选/分页。首页展示 12 条精选，/explore 页面提供完整功能。

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS

---

## Task 1: 创建类型定义

**Files:**
- Create: `components/explore/types/explore.ts`
- Create: `components/explore/types/index.ts`

**Step 1: 创建 explore.ts 类型文件**

```typescript
// components/explore/types/explore.ts
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
```

**Step 2: 创建 index.ts 导出**

```typescript
// components/explore/types/index.ts
export * from './explore'
```

**Step 3: 提交**

```bash
git add components/explore/types/
git commit -m "feat(explore): add type definitions"
```

---

## Task 2: 创建工具函数

**Files:**
- Create: `components/explore/utils/fetch.ts`
- Create: `components/explore/utils/search.ts`
- Create: `components/explore/utils/index.ts`

**Step 1: 创建 fetch.ts**

```typescript
// components/explore/utils/fetch.ts
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
```

**Step 2: 创建 search.ts**

```typescript
// components/explore/utils/search.ts
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
```

**Step 3: 创建 index.ts 导出**

```typescript
// components/explore/utils/index.ts
export * from './fetch'
export * from './search'
```

**Step 4: 提交**

```bash
git add components/explore/utils/
git commit -m "feat(explore): add utility functions for fetch and search"
```

---

## Task 3: 创建 ExploreCard 组件

**Files:**
- Create: `components/explore/card.tsx`

**Step 1: 创建卡片组件**

```typescript
// components/explore/card.tsx
'use client'

import { useState } from 'react'
import { ExplorePromptGroup } from './types'

const typeConfig = {
  skill: {
    label: 'Skill',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  command: {
    label: 'Command',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  prompt: {
    label: 'Prompt',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
  },
  rule: {
    label: 'Rule',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
}

interface ExploreCardProps {
  item: ExplorePromptGroup
  searchQuery?: string
}

export function ExploreCard({ item, searchQuery = '' }: ExploreCardProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const typeInfo = typeConfig[item.type]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncate = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-inherit rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Type accent bar */}
      <div className={`h-1 ${typeInfo.bgColor.replace('100', '500')}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Type badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${typeInfo.bgColor} ${typeInfo.textColor} border ${typeInfo.borderColor} mb-2`}>
              {typeInfo.label}
            </span>
            <h3 className="text-lg font-semibold text-navy leading-tight">
              {highlightText(item.name, searchQuery)}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              @{item.author} · {item.stars.toLocaleString()} ★
            </p>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className={`text-sm text-gray-600 leading-relaxed mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {highlightText(item.description, searchQuery)}
          </p>
        )}

        {/* Content preview */}
        <div className="relative rounded-lg bg-gray-50 p-3 border border-gray-100 mb-3">
          <pre className={`text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {isExpanded ? item.content : truncate(item.content, 300)}
          </pre>
          {!isExpanded && item.content.length > 300 && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent rounded-b-lg" />
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, isExpanded ? undefined : 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200"
              >
                #{highlightText(tag, searchQuery)}
              </span>
            ))}
            {!isExpanded && item.tags.length > 4 && (
              <span className="text-[10px] text-gray-400 px-1 self-center">
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-3 py-1.5 text-gray-600 hover:text-navy transition-colors"
          >
            {isExpanded ? '↑ Collapse' : '↓ Expand'}
          </button>
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <a
            href={item.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add components/explore/card.tsx
git commit -m "feat(explore): add ExploreCard component"
```

---

## Task 4: 创建 ExploreFilters 组件

**Files:**
- Create: `components/explore/filters.tsx`

**Step 1: 创建筛选组件**

```typescript
// components/explore/filters.tsx
'use client'

import { ExplorePromptType, TypeCounts } from './types'

interface ExploreFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: ExplorePromptType | 'all'
  onFilterChange: (filter: ExplorePromptType | 'all') => void
  typeCounts: TypeCounts
  isSearching?: boolean
}

const filterOptions: { value: ExplorePromptType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'skill', label: 'Skills' },
  { value: 'command', label: 'Commands' },
  { value: 'prompt', label: 'Prompts' },
  { value: 'rule', label: 'Rules' },
]

export function ExploreFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  typeCounts,
  isSearching = false,
}: ExploreFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-2xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder="Search skills, commands, prompts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-gray-200 text-navy placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((option) => {
          const count = typeCounts[option.value]
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === option.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-navy hover:bg-gray-100'
              }`}
            >
              {option.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeFilter === option.value
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add components/explore/filters.tsx
git commit -m "feat(explore): add ExploreFilters component"
```

---

## Task 5: 创建 ExplorePage 客户端组件

**Files:**
- Create: `components/explore/page.tsx`

**Step 1: 创建页面组件**

```typescript
// components/explore/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ExplorePromptGroup, ExplorePromptType, TypeCounts } from './types'
import { searchPrompts, filterByType, calculateTypeCounts, paginateItems } from './utils'
import { ExploreCard } from './card'
import { ExploreFilters } from './filters'

const PAGE_SIZE = 20

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

interface ExplorePageProps {
  initialData: ExplorePromptGroup[]
  initialTypeCounts: TypeCounts
}

export function ExplorePage({ initialData, initialTypeCounts }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ExplorePromptType | 'all'>('all')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [isSearching, setIsSearching] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Show searching indicator while debouncing
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery, debouncedSearchQuery])

  // Reset display count when filter or search changes
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [debouncedSearchQuery, activeFilter])

  // Filter and search
  const filteredItems = filterByType(
    searchPrompts(initialData, debouncedSearchQuery),
    activeFilter
  )

  const typeCounts = debouncedSearchQuery
    ? calculateTypeCounts(searchPrompts(initialData, debouncedSearchQuery))
    : initialTypeCounts

  const { items: displayedItems, hasMore } = paginateItems(filteredItems, 0, displayCount)

  // Load more
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => prev + PAGE_SIZE)
    }
  }, [hasMore])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Discover</span>
          </div>
          <h1 className="text-4xl font-bold text-navy mb-2">Explore</h1>
          <p className="text-gray-600">
            Curated skills, commands, and prompts from the community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ExploreFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            typeCounts={typeCounts}
            isSearching={isSearching}
          />
        </div>

        {/* Empty state */}
        {displayedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">No prompts found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Cards grid */}
        {displayedItems.length > 0 && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {displayedItems.map((item) => (
              <ExploreCard key={item.id} item={item} searchQuery={debouncedSearchQuery} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {displayedItems.length > 0 && (
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500 mb-4">
              Showing {displayedItems.length} of {filteredItems.length} resources
            </p>
            <div ref={sentinelRef} className="h-4" />
            {hasMore && (
              <button
                onClick={loadMore}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Load More
              </button>
            )}
            {!hasMore && displayedItems.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">You've reached the end</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add components/explore/page.tsx
git commit -m "feat(explore): add ExplorePage client component"
```

---

## Task 6: 创建 ExploreSection 首页板块组件

**Files:**
- Create: `components/explore/section.tsx`

**Step 1: 创建首页板块组件**

```typescript
// components/explore/section.tsx
import Link from 'next/link'
import { ExplorePromptGroup } from './types'
import { ExploreCard } from './card'

interface ExploreSectionProps {
  items: ExplorePromptGroup[]
}

export function ExploreSection({ items }: ExploreSectionProps) {
  // Take top 12 items by stars
  const topItems = items.slice(0, 12)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Community</span>
            <div className="h-1 w-6 bg-blue-600 rounded-full" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy mb-4 text-balance">
            Explore Community
            <br />
            <span className="text-blue-600">Prompts</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover curated skills, commands, and prompts shared by the community.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-12">
          {topItems.map((item) => (
            <ExploreCard key={item.id} item={item} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Prompts
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: 提交**

```bash
git add components/explore/section.tsx
git commit -m "feat(explore): add ExploreSection homepage component"
```

---

## Task 7: 创建独立 /explore 页面

**Files:**
- Create: `app/explore/page.tsx`

**Step 1: 创建路由页面**

```typescript
// app/explore/page.tsx
import { ExplorePage } from '@/components/explore/page'
import { fetchExploreData } from '@/components/explore/utils'
import { calculateTypeCounts } from '@/components/explore/utils/search'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Explore Community Prompts | PromptKing',
  description: 'Discover curated skills, commands, and prompts shared by the community.',
}

export default async function ExploreRoute() {
  const response = await fetchExploreData()
  const typeCounts = response.typeCounts || calculateTypeCounts(response.data)

  return (
    <main className="min-h-screen">
      <Navigation />
      <ExplorePage initialData={response.data} initialTypeCounts={typeCounts} />
      <Footer />
    </main>
  )
}
```

**Step 2: 提交**

```bash
git add app/explore/
git commit -m "feat(explore): add /explore route page"
```

---

## Task 8: 集成首页 ExploreSection

**Files:**
- Modify: `app/page.tsx`

**Step 1: 更新首页**

```typescript
// app/page.tsx
import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import Features from '@/components/features'
import { ExploreSection } from '@/components/explore/section'
import { fetchExploreData } from '@/components/explore/utils'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default async function Home() {
  const response = await fetchExploreData()

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <ExploreSection items={response.data} />
      <CTASection />
      <Footer />
    </main>
  )
}
```

**Step 2: 提交**

```bash
git add app/page.tsx
git commit -m "feat(explore): integrate ExploreSection into homepage"
```

---

## Task 9: 更新导航栏添加 Explore 链接

**Files:**
- Modify: `components/navigation.tsx`

**Step 1: 添加 Explore 链接到导航**

在导航栏中添加指向 /explore 的链接。

**Step 2: 提交**

```bash
git add components/navigation.tsx
git commit -m "feat(navigation): add Explore link"
```

---

## Task 10: 验证与清理

**Step 1: 本地运行验证**

Run: `pnpm dev`

验证:
- 首页显示 12 条 prompts
- "View All Prompts" 按钮跳转到 /explore
- /explore 页面搜索、筛选、无限滚动正常工作
- 复制按钮正常

**Step 2: 构建测试**

Run: `pnpm build`

确保构建成功，静态生成正常。

**Step 3: 最终提交**

```bash
git add .
git commit -m "feat(explore): complete explore feature migration"
```

---

## 数据更新策略

- 每次 `pnpm build` 会重新获取最新数据
- 可配置 CI/CD 定时触发构建（如 GitHub Actions cron job）
