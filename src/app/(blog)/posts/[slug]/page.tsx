import { Suspense } from 'react'
import { evaluate } from 'next-mdx-remote-client/rsc'
import type { EvaluateOptions } from 'next-mdx-remote-client/rsc'
import type { Metadata, ResolvingMetadata } from 'next'
import { ErrorComponent, LoadingComponent } from '@/components/index'
import TableOfContent from '@/components/toc'
import { MdxRenderer, components } from '@/components/mdx/mdx-renderer'
import getMdxOptions from '@/components/mdx/parsers'
import type { TocItem } from 'remark-flexible-toc'
import { ApiResponse } from '@/types/api'
import { PostItem } from '@/types/post'

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

type MetadataProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata
) {
  const slug = (await params).slug
  const post = await getPostData(slug)

  // console.log('Generating metadata for post:', parent, 'post', post)

  return {
    title: post.title,
    description: post.summary || 'MDX Blog Post',
    keywords: post.tags.map((tag) => tag.name).join(', '),
    author: post.author,
    date: post.content,
  }
}

const getPostData = async (slug: string) => {
  console.log(
    `post url: ${process.env.NEXT_PUBLIC_API_URL}/public/posts/${slug}`
  )
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/posts/${slug}`
  )

  const data: ApiResponse<PostItem> = await res.json()

  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  return data.data
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // console.log('Fetching post data for slug:', slug)
  let source: string | null = null
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await getPostData(slug)
    source = data.content
    // console.log('MDX source:', source)
  } catch (err) {
    return <ErrorComponent error="讀取內容時發生錯誤！" />
  }

  if (!source || typeof source !== 'string') {
    return <ErrorComponent error="找不到內容來源或內容格式錯誤！" />
  }

  const { content, frontmatter, scope, error } = await evaluate<
    Frontmatter,
    Scope
  >({
    source,
    options: getMdxOptions(source),
    components: components,
  })

  // console.log('Frontmatter:', frontmatter)
  // console.log('Scope:', scope)

  if (error) {
    return <ErrorComponent error={error.message} />
  }
  // console.log('TOC:', scope.toc)
  const showToc = frontmatter.showToc !== false
  return (
    <div className="container m-auto mt-[120px] max-w-7xl px-2 md:px-6 lg:px-4 xl:px-0">
      <div className="relative flex min-h-[120px] grid-cols-[auto_200px] lg:grid">
        <div className="min-w-0">
          <article className="prose dark:prose-invert max-w-full">
            <MdxRenderer content={content} error={error} />
          </article>
        </div>
        <div className="relative hidden lg:block">
          {showToc && <TableOfContent toc={scope.toc || []} />}
        </div>
      </div>
    </div>
  )
}
