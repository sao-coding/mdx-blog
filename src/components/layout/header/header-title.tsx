'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useHeaderStore } from '@/store/header-store'

type Props = {
  showBackground: boolean
}

/**
 * HeaderTitle
 * - 負責從 store 取得 post/note 的 title 並顯示
 * - 在切換至非 detail page 時呼叫 clearAll() 清除狀態
 */
const HeaderTitle: React.FC<Props> = ({ showBackground }) => {
  const pathname = usePathname()
  const { postState, noteState, clearAll } = useHeaderStore()

  // 當路由變動且不在 detail page 時，清除 store 狀態
  useEffect(() => {
    if (!pathname?.startsWith('/posts/') && !pathname?.startsWith('/notes/')) {
      clearAll()
    }
  }, [pathname, clearAll])

  const title = postState?.title ?? noteState?.title

  if (!title || !showBackground) return null

  return (
    <div className={cn('absolute w-full lg:px-16')}>
      <small className="flex gap-0.5 text-gray-500">
        {postState.title && (
          <>
            {postState.category}
            <span>/</span>
            {postState.tags.join(', ')}
          </>
        )}
        {noteState.title && (
          <>
            日記<span>/</span>
            {noteState.topic}
          </>
        )}
      </small>
      <div className="text-xl leading-normal truncate">{title}</div>
    </div>
  )
}

export default HeaderTitle
