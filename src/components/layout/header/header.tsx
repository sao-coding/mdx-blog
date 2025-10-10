'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import DevicesStatus from './devices-status'
import Nav from './nav'
import SiteOwnerAvatar from './site-owner-avatar'
import { useHeaderStore } from '@/store/header-store'

const Header = () => {
  const pathname = usePathname()
  const { postState, noteState, clearAll } = useHeaderStore()

  // 合併為單一狀態對象,確保狀態同步更新
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    showPinnedNav: false,
  })

  // 滾動相關的 refs
  const lastScrollYRef = useRef(0)
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    // 若是切換到其他非posts/[slug]或notes/[id]頁面，清除標題狀態
    if (!pathname?.startsWith('/posts/') && !pathname?.startsWith('/notes/')) {
      clearAll()
    }
  }, [pathname, clearAll])

  // 常量配置
  const SCROLL_THRESHOLD = 50 // 判斷是否滾動的閾值
  const DIRECTION_THRESHOLD = 10 // 判斷滾動方向的閾值(減小以提高響應速度)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        const scrollDiff = currentY - lastScrollYRef.current

        // 計算新的滾動狀態
        const newIsScrolled = currentY > SCROLL_THRESHOLD

        // 更新滾動方向(只在滾動距離超過閾值時更新)
        if (Math.abs(scrollDiff) > DIRECTION_THRESHOLD) {
          scrollDirectionRef.current = scrollDiff > 0 ? 'down' : 'up'
          lastScrollYRef.current = currentY
        }

        // 判斷是否為文章/筆記詳情頁
        const isDetailPage =
          pathname?.startsWith('/posts/') || pathname?.startsWith('/notes/')

        // 計算是否顯示固定導航
        const newShowPinnedNav =
          isDetailPage && newIsScrolled && scrollDirectionRef.current === 'up'

        // 只在狀態真正改變時才更新(避免不必要的重渲染)
        setScrollState((prev) => {
          if (
            prev.isScrolled === newIsScrolled &&
            prev.showPinnedNav === newShowPinnedNav
          ) {
            return prev
          }
          return {
            isScrolled: newIsScrolled,
            showPinnedNav: newShowPinnedNav,
          }
        })

        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  // 派生狀態計算
  const isTargetPage =
    pathname === '/' ||
    pathname?.startsWith('/posts') ||
    pathname?.startsWith('/notes')

  const showBackground = isTargetPage && scrollState.isScrolled

  const isDetailPage =
    pathname?.startsWith('/posts/') || pathname?.startsWith('/notes/')

  // 中央導航的樣式
  const centralNavClass = cn(
    'transition-all duration-300 ease-in-out',
    isDetailPage && scrollState.isScrolled
      ? 'opacity-0 -translate-y-1 pointer-events-none'
      : 'opacity-100 translate-y-0'
  )

  // 固定導航的樣式
  const pinnedNavClass = cn(
    'fixed top-[3.375rem] left-1/2 -translate-x-1/2 z-50',
    'bg-background/80 backdrop-blur-md',
    'transition-all duration-300 ease-in-out',
    scrollState.showPinnedNav
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-4 pointer-events-none'
  )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[4.5rem] border-b transition-colors duration-300',
        showBackground
          ? 'border-gray-700/50 bg-background/80 backdrop-blur-md'
          : 'border-transparent'
      )}
    >
      <div className="grid grid-cols-[4.5rem_auto_4.5rem] max-w-7xl mx-auto h-full">
        <div className="flex items-center space-x-4">
          <SiteOwnerAvatar />
          <DevicesStatus />
        </div>

        <div className="relative flex grow justify-center items-center">
          <Nav
            id="central"
            variant={showBackground ? 'integrated' : 'default'}
            className={centralNavClass}
          />
          {postState && showBackground && (
            <div className="absolute w-full lg:px-16">
              <div className="text-lg truncate">{postState.title}</div>
            </div>
          )}
          {noteState && showBackground && (
            <div className="absolute w-full lg:px-16">
              <div className="text-lg truncate">{noteState.title}</div>
            </div>
          )}
        </div>

        <div className=""></div>
      </div>

      {/* 固定導航 - 使用條件渲染配合 CSS 過渡 */}

      <Nav
        id="pinned"
        className={pinnedNavClass}
        variant={showBackground ? 'integrated' : 'default'}
      />
    </header>
  )
}

export default Header
