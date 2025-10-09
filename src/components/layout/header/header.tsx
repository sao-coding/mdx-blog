'use client'
// FIXME:卷軸滾動會閃爍
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import DevicesStatus from './devices-status'
import Nav from './nav'
import SiteOwnerAvatar from './site-owner-avatar'
import { useHeaderStore } from '@/store/header-store'

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const { postState, noteState } = useHeaderStore()

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY

        // Only update state if the value has changed to prevent unnecessary re-renders
        setIsScrolled((prev) => {
          const next = currentY > 80
          return prev === next ? prev : next
        })

        setIsScrollingUp((prev) => {
          // Scrolling up
          if (currentY < lastScrollY) {
            return prev ? prev : true
          }
          // Scrolling down
          if (currentY > lastScrollY) {
            return !prev ? prev : false
          }
          return prev
        })

        lastScrollY = currentY
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isScrolled, isScrollingUp])

  // Treat home, posts and notes pages as target pages that show the header background when scrolled
  const isTargetPage =
    pathname === '/' ||
    pathname?.startsWith('/posts') ||
    pathname?.startsWith('/notes')
  const showBackground = isTargetPage && isScrolled

  // When on a single post or note (e.g. '/posts/[slug]' or '/notes/[id]') and scrolled, hide the central Nav.
  // Do NOT hide for list pages like '/posts' or '/notes'. We detect single pages by checking the trailing '/'.
  const isPostsOrNotes =
    pathname?.startsWith('/posts/') || pathname?.startsWith('/notes/')

  // central Nav should be hidden on single post/note when header background is shown
  const centralNavClass = cn(
    isPostsOrNotes && isScrolled ? 'invisible' : 'visible'
  )

  // pinned Nav appears on single post/note when background is shown and user scrolls up
  const showPinnedNav = isPostsOrNotes && isScrolled && isScrollingUp
  const pinnedNavClass = cn(
    'fixed top-[3.375rem] left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur-md',
    // disable transitions that cause jitter when fixed
    'transition-none'
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
            variant={showBackground ? 'integrated' : 'default'}
            className={centralNavClass}
          />
          {postState && showBackground && (
            <div className="absolute w-full lg:px-16">
              <div className="text-lg">{postState.title}</div>
            </div>
          )}
        </div>
        <div className=""></div>
      </div>
      {showPinnedNav && (
        <Nav
          variant={showBackground ? 'integrated' : 'default'}
          className={pinnedNavClass}
        />
      )}
    </header>
  )
}

export default Header
