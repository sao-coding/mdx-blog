import React, { Suspense } from 'react'
import type { MDXComponents } from 'next-mdx-remote-client/rsc'
import type { TocItem } from 'remark-flexible-toc'

import { ErrorComponent, LoadingComponent } from '..'
import { Count, Mermaid, Echarts } from './renderers'

type Scope = {
  readingTime: string
  toc?: TocItem[]
}

type Frontmatter = {
  title: string
  description?: string
  keywords?: string
  author: string
  date?: string
  showToc?: boolean
}

// 可擴充的 MDX 元件映射
const components: MDXComponents = {
  wrapper: function Wrapper({
    children,
  }: React.ComponentPropsWithoutRef<'div'>) {
    return <div className="mdx-wrapper">{children}</div>
  },
  /* 為所有標題加上 scroll-margin-top（對應 sticky top-20） */
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="scroll-mt-20" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="scroll-mt-20" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="scroll-mt-20" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="scroll-mt-20" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="scroll-mt-20" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="scroll-mt-20" {...props} />
  ),
  code: ({
    className,
    children,
  }: {
    className?: string
    children: React.ReactNode
  }) => {
    const text = String(children ?? '').trim()
    if (className === 'language-mermaid') {
      return <Mermaid>{text}</Mermaid>
    }
    if (className === 'language-echarts') {
      return <Echarts>{text}</Echarts>
    }
    return <code className={className}>{children}</code>
  },
  Count,
}

const MdxRenderer = async ({
  content,
  error,
}: {
  content: React.ReactNode
  error?: Error
}) => {
  if (error) {
    return <ErrorComponent error={error.message} />
  }

  return <Suspense fallback={<LoadingComponent />}>{content}</Suspense>
}

export { MdxRenderer, components }
