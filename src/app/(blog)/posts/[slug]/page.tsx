import { Suspense } from 'react'
import { evaluate } from 'next-mdx-remote-client/rsc'
import type { EvaluateOptions, MDXComponents } from 'next-mdx-remote-client/rsc'
import { Metadata } from 'next'
import { calculateSomeHow, getSourceSomeHow } from '@/utils/index'
import { ErrorComponent, LoadingComponent } from '@/components/index'
import TableOfContent from '@/components/toc'
import { Test, Echarts } from '@/components/mdx/index'
import Mermaid from '@/components/mdx/Mermaid'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkFlexibleToc, { TocItem } from 'remark-flexible-toc'
import rehypeSlug from 'rehype-slug'

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
  Test,
  wrapper: function Wrapper({
    children,
  }: React.ComponentPropsWithoutRef<'div'>) {
    return <div className="mdx-wrapper">{children}</div>
  },
  /* 為所有標題加上 scroll-margin-top（對應 sticky top-20） */
  h1: (props) => <h1 className="scroll-mt-20" {...props} />,
  h2: (props) => <h2 className="scroll-mt-20" {...props} />,
  h3: (props) => <h3 className="scroll-mt-20" {...props} />,
  h4: (props) => <h4 className="scroll-mt-20" {...props} />,
  h5: (props) => <h5 className="scroll-mt-20" {...props} />,
  h6: (props) => <h6 className="scroll-mt-20" {...props} />,
  code: ({ className, children }) => {
    if (className === 'language-mermaid') {
      return <Mermaid>{String(children).trim()}</Mermaid>
    }
    if (className === 'language-echarts') {
      return <Echarts>{String(children).trim()}</Echarts>
    }
    return <code className={className}>{children}</code>
  },
}

// SEO metadata（可依需求調整）
export const metadata: Metadata = {
  title: 'MDX Blog | Home',
  description: 'A modern MDX-powered blog built with Next.js',
}

const getPostData = async (slug: string) => {
  console.log(
    `post url: ${process.env.NEXT_PUBLIC_API_URL}/public/posts/${slug}`
  )
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/posts/${slug}`
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  return data.data.content as string
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log('Fetching post data for slug:', slug)
  let source: string | null = null
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    source = await getPostData(slug)
    // console.log('MDX source:', source)
  } catch (err) {
    return <ErrorComponent error="讀取內容時發生錯誤！" />
  }

  if (!source || typeof source !== 'string') {
    return <ErrorComponent error="找不到內容來源或內容格式錯誤！" />
  }

  const options: EvaluateOptions<Scope> = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath, remarkFlexibleToc],
      rehypePlugins: [rehypeKatex, rehypeSlug],
    },
    parseFrontmatter: true,
    scope: {
      readingTime: calculateSomeHow(source),
    },
    vfileDataIntoScope: 'toc', // 這行會把 toc 注入 scope.toc
  }

  const { content, frontmatter, scope, error } = await evaluate<
    Frontmatter,
    Scope
  >({
    source,
    options,
    components,
  })

  console.log('Frontmatter:', frontmatter)
  console.log('Scope:', scope)

  if (error) {
    return <ErrorComponent error={error.message} />
  }
  console.log('TOC:', scope.toc)
  const showToc = frontmatter.showToc !== false

  return (
    <main className="mt-20 mx-auto py-8 max-w-7xl flex space-x-4">
      <article className="prose dark:prose-invert flex-1 ">
        <Suspense fallback={<LoadingComponent />}>{content}</Suspense>
      </article>
      {showToc && <TableOfContent toc={scope.toc} />}
    </main>
  )
}
