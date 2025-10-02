import React from 'react'
import { TocItem } from '@/types/toc'
import { cn } from '@/lib/utils'
import { m } from 'motion/react'

const getTextClass = (depth?: number, isActive?: boolean) => {
  if (isActive) {
    return 'text-primary'
  }
  switch (depth) {
    case 1:
      return 'font-medium text-slate-900 dark:text-slate-100'
    case 2:
      return 'text-slate-700 dark:text-slate-300'
    case 3:
      return 'text-slate-600 dark:text-slate-400'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
}

export const TocList: React.FC<{
  items?: TocItem[]
  activeId?: string
}> = ({ items = [], activeId }) => {
  if (!items || items.length === 0) return null

  return (
    <>
      {items.map((item) => {
        const depth = item.depth ?? 1
        const paddingLeft = Math.max(depth - 1, 0) * 12 // px
        const isActive = activeId === item.href?.slice(1)
        return (
          <li
            key={item.href || item.value}
            className={`toc-item relative`}
            style={{ paddingLeft }}
          >
            {isActive && (
              <m.span
                layoutId="active-toc-item"
                className="absolute inset-y-0 left-0 w-0.5 rounded-r-lg bg-primary"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            )}
            <a
              href={item.href}
              className={cn(
                'flex items-start gap-2 group leading-normal truncate transition-all duration-200',
                getTextClass(depth, isActive),
                { 'ml-2': isActive }
              )}
            >
              <span className="truncate group-hover:text-primary transition-colors">
                {item.value}
              </span>
            </a>

            {item.children && item.children.length > 0 && (
              <div className="mt-2">
                <TocList items={item.children} activeId={activeId} />
              </div>
            )}
          </li>
        )
      })}
    </>
  )
}

export default TocList
