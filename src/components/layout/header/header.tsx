'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import DevicesStatus from './devices-status'
import Nav from './nav'
import SiteOwnerAvatar from './site-owner-avatar'
import HeaderTitle from './header-title'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from 'radix-ui'
import { NAV_LINKS } from '@/config/menu'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'

const Header = () => {
  const pathname = usePathname()

  // 合併為單一狀態對象,確保狀態同步更新
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    showPinnedNav: false,
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 滾動相關的 refs
  const lastScrollYRef = useRef(0)
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null)
  const tickingRef = useRef(false)
  const isMobile = useIsMobile(1024) // 以 1024px 作為行動裝置斷點

  // 常量配置
  const SCROLL_THRESHOLD = 50 // 判斷是否滾動的閾值
  const DIRECTION_THRESHOLD = 10 // 判斷滾動方向的閾值(減小以提高響應速度)

  useEffect(() => {
    // lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      // 當 Drawer 開啟時忽略由 overlay/portal 導致的滾動或 layout 變化
      if (drawerOpen) return
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
        // 特別排除 /notes/topics（topics 列表）不要被視為 note detail
        const isDetailPage =
          pathname?.startsWith('/posts/') ||
          (pathname?.startsWith('/notes/') &&
            !pathname?.startsWith('/notes/topics'))

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
  }, [pathname, drawerOpen])

  // 派生狀態計算
  const isTargetPage =
    pathname === '/' ||
    pathname?.startsWith('/posts') ||
    // 將 /notes/topics 視為列表而非目標頁（不顯示背景）
    (pathname?.startsWith('/notes') && !pathname?.startsWith('/notes/topics'))

  const showBackground = isTargetPage && scrollState.isScrolled

  const isDetailPage =
    pathname?.startsWith('/posts/') ||
    (pathname?.startsWith('/notes/') && !pathname?.startsWith('/notes/topics'))

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
    'bg-background',
    'transition-all duration-300 ease-in-out',
    scrollState.showPinnedNav
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-4 pointer-events-none'
  )

  useEffect(() => {
    console.log('Header State:', {
      isScrolled: scrollState.isScrolled,
      showPinnedNav: scrollState.showPinnedNav,
      scrollDirection: scrollDirectionRef.current,
      pathname,
    })
  }, [scrollState, pathname])

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-[4.5rem] border-b transition-colors duration-300',
          showBackground
            ? 'border-gray-700/50 bg-background/40 backdrop-blur-md'
            : 'border-transparent'
        )}
      >
        <div className="grid grid-cols-[4.5rem_auto_4.5rem] max-w-7xl mx-auto h-full">
          {isMobile && (
            <div className="relative flex size-full items-center justify-center lg:hidden">
              <DrawerTrigger>
                <MenuIcon />
              </DrawerTrigger>
              <DrawerContent>
                <VisuallyHidden.Root>
                  <DrawerHeader>
                    <DrawerTitle>Site Navigation</DrawerTitle>
                    <DrawerDescription>
                      Navigate through the site
                    </DrawerDescription>
                  </DrawerHeader>
                </VisuallyHidden.Root>
                {/* 主導航選單 */}
                <div className="flex flex-col p-4">
                  {NAV_LINKS.map((link, index) => (
                    <div key={index} className="py-2">
                      {link.href ? (
                        <div className="flex items-center">
                          {link.icon && <link.icon className="size-5 mr-2" />}
                          <DrawerClose asChild>
                            <Link
                              href={link.href}
                              className="text-lg font-medium leading-none"
                            >
                              <h2>{link.text}</h2>
                            </Link>
                          </DrawerClose>
                        </div>
                      ) : (
                        <p className="text-lg font-medium leading-none">
                          {link.text}
                        </p>
                      )}
                      {link.children && (
                        <div className="pl-4 p-2 flex flex-col space-y-2">
                          {link.children
                            .filter((child) => child.show)
                            .map((child, childIndex) => (
                              <DrawerClose asChild key={childIndex}>
                                <Link href={child.href}>{child.text}</Link>
                              </DrawerClose>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DrawerContent>
            </div>
          )}
          <div>
            <div className="relative flex justify-center items-center space-x-4 h-full">
              {/* <SiteOwnerAvatar />
              <DevicesStatus /> */}
              {/* 如果是手機模式 並且 showBackground 就顯示標題 不然就顯示 SiteOwnerAvatar DevicesStatus */}
              {showBackground && isMobile ? (
                <HeaderTitle showBackground={showBackground} />
              ) : (
                <>
                  <SiteOwnerAvatar />
                  <DevicesStatus />
                </>
              )}
            </div>
          </div>
          {!isMobile && (
            <div className="relative flex grow justify-center items-center">
              <Nav
                id="central"
                variant={showBackground ? 'integrated' : 'default'}
                className={centralNavClass}
              />
              <HeaderTitle showBackground={showBackground} />
            </div>
          )}

          <div className=""></div>
        </div>

        {/* 固定導航 - 使用條件渲染配合 CSS 過渡 */}

        <Nav
          id="pinned"
          className={pinnedNavClass}
          variant={showBackground ? 'integrated' : 'default'}
        />
      </header>
    </Drawer>
  )
}

export default Header
