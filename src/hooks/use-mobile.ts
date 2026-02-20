import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  // undefined 表示尚未在 client-side 初始化（避免 SSR 與 hydration 矛盾）
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    mql.addEventListener('change', onChange)
    // 立刻同步目前尺寸到狀態
    setIsMobile(window.innerWidth < breakpoint)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  // 回傳可能為 undefined，呼叫端應該對 undefined 做出合理處理
  return isMobile
}
