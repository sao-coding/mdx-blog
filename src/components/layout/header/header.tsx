'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import DevicesStatus from './devices-status'
import Nav from './nav'
import SiteOwnerAvatar from './site-owner-avatar'

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTargetPage = pathname === '/' || pathname.startsWith('/posts')
  const showBackground = isTargetPage && isScrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-300',
        showBackground
          ? 'border-gray-700/50 bg-background/80 backdrop-blur-md'
          : 'border-transparent'
      )}
    >
      <div className="grid grid-cols-3 max-w-7xl mx-auto h-full">
        <div className="flex items-center space-x-4">
          <SiteOwnerAvatar />
          <DevicesStatus />
        </div>
        <div className="flex justify-center items-center">
          <Nav variant={showBackground ? 'integrated' : 'default'} />
        </div>
        <div className=""></div>
      </div>
    </header>
  )
}

export default Header
