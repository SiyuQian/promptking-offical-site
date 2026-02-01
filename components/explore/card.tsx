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
