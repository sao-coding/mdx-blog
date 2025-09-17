// ...existing code...
import React from 'react'

export interface TocItem {
  value: string
  href?: string
  depth?: number
  numbering?: number[]
  parent?: string
  children?: TocItem[]
}

export interface TableOfContentProps {
  toc?: TocItem[]
}

/**
 * 產生目錄列表的遞迴渲染。
 * - 以 depth 決定縮排與文字樣式，numbering 顯示章節編號。
 * @param items 要渲染的 TocItem 陣列
 */
function renderToc(items: TocItem[] = []) {
  const getTextClass = (depth?: number) => {
    switch (depth) {
      case 1:
        return 'text-sm font-medium text-slate-900 dark:text-slate-100'
      case 2:
        return 'text-sm text-slate-700 dark:text-slate-300'
      case 3:
        return 'text-xs text-slate-600 dark:text-slate-400'
      default:
        return 'text-xs text-slate-600 dark:text-slate-400'
    }
  }

  return (
    <ul className="toc-list space-y-2">
      {items.map((item) => {
        const depth = item.depth ?? 1
        const paddingLeft = Math.max(depth - 1, 0) * 12 // px
        return (
          <li
            key={item.href || item.value}
            className={`toc-item`}
            style={{ paddingLeft }}
          >
            <a
              href={item.href}
              className={`flex items-start gap-2 group ${getTextClass(depth)}`}
            >
              {item.numbering ? (
                <span className="flex-none tabular-nums text-slate-500 dark:text-slate-400 text-[0.85em]">
                  {item.numbering.join('.')}.
                </span>
              ) : null}
              <span className="truncate group-hover:text-primary transition-colors">
                {item.value}
              </span>
            </a>

            {item.children && item.children.length > 0 && (
              <div className="mt-2">{renderToc(item.children)}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * TableOfContent 元件
 * - 顯示文章目錄，支援多層縮排與分級字級
 */
export const TableOfContent: React.FC<TableOfContentProps> = ({ toc }) => {
  if (!toc || toc.length === 0) return null
  return (
    // 這裡加入 sticky 與 top 偏移，讓目錄在滾動時固定顯示
    <aside className="flex-shrink-0 sticky top-20 self-start">
      <nav
        className="toc-container border p-4 rounded-2xl w-80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
        aria-label="Table of contents"
      >
        <h2 className="toc-title text-sm font-semibold mb-3">目錄</h2>
        <div className="max-h-[60vh] overflow-auto">{renderToc(toc)}</div>
      </nav>
    </aside>
  )
}

export default TableOfContent
// ...existing code...
