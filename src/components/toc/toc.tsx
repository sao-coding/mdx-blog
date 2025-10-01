'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TocItem } from '@/types/toc'
import TocList from './toc-list'
import useScrollspy from '@/hooks/use-scrollspy'

/**
 * Recursively extracts IDs from TOC items.
 * @param items - The array of TOC items.
 * @returns An array of IDs.
 */
const getIds = (items: TocItem[]): string[] => {
  return items.reduce((acc: string[], item) => {
    if (item.href) {
      // remove '#' from href
      acc.push(item.href.slice(1))
    }
    if (item.children) {
      acc.push(...getIds(item.children))
    }
    return acc
  }, [])
}

/**
 * TableOfContent 元件
 * - 顯示文章目錄，支援多層縮排與分級字級
 */
export const TableOfContent = ({ toc }: { toc: TocItem[] }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    const newIds = getIds(toc)
    setIds(newIds)
  }, [toc])

  const activeId = useScrollspy(ids, {
    rootMargin: '0% 0% -85% 0%',
  })

  useEffect(() => {
    const setMaxWidth = () => {
      if (containerRef.current) {
        containerRef.current.style.maxWidth = `${
          window.innerWidth -
          containerRef.current.getBoundingClientRect().x -
          30
        }px`
      }
    }

    setMaxWidth()

    window.addEventListener('resize', setMaxWidth)
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [])
  if (!toc || toc.length === 0) return null

  return (
    // 這裡加入 sticky 與 top 偏移，讓目錄在滾動時固定顯示
    <aside className="sticky top-20 self-start">
      <div className="relative h-full" aria-label="Table of contents">
        <div className="max-h-[60vh] overflow-auto absolute">
          <ul ref={containerRef} className="toc-list space-y-2 relative">
            <TocList items={toc} activeId={activeId} />
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default TableOfContent
