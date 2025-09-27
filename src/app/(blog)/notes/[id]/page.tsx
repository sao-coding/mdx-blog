// src/app/(blog)/notes/[id]/page.tsx
import { Suspense } from 'react'
import { evaluate } from 'next-mdx-remote-client/rsc'
import type { EvaluateOptions, MDXComponents } from 'next-mdx-remote-client/rsc'
import { Metadata } from 'next'
import { ErrorComponent, LoadingComponent } from '@/components/index' // 假設這些元件存在
import { NoteItem } from '@/types/note'
import { ApiResponse } from '@/types/api'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { format } from 'date-fns'

// 這裡可以放日記特有的 MDX 元件
const components: MDXComponents = {
  // 沿用文章的標題樣式
  h1: (props) => <h1 className="scroll-mt-20" {...props} />,
  h2: (props) => <h2 className="scroll-mt-20" {...props} />,
  h3: (props) => <h3 className="scroll-mt-20" {...props} />,
}

// 獲取日記資料的函式
const getNoteData = async (id: string): Promise<ApiResponse<NoteItem>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/notes/${id}`
  )
  if (!res.ok) {
    // 這裡可以根據 status code 做更細緻的錯誤處理，例如 404
    throw new Error('Failed to fetch note data')
  }
  return res.json()
}

// 動態生成頁面標題
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const { data: note } = await getNoteData(id)
    return {
      title: note.title,
      description: note.content.substring(0, 150), // 簡單取前 150 字當描述
    }
  } catch {
    return {
      title: '日記',
      description: '一篇日記',
    }
  }
}

// 日記頁眉，顯示心情、天氣等資訊
const NoteHeader = ({ note }: { note: NoteItem }) => (
  <header className="mb-8 border-b pb-4">
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
      {note.title}
    </h1>
    <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
      <span>{format(new Date(note.createdAt), 'yyyy-MM-dd')}</span>
      {note.mood && <span>心情: {note.mood}</span>}
      {note.weather && <span>天氣: {note.weather}</span>}
      {note.location && <span>於 {note.location}</span>}
    </div>
  </header>
)

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let noteData: ApiResponse<NoteItem>

  try {
    noteData = await getNoteData(id)
  } catch {
    return <ErrorComponent error="讀取日記時發生錯誤！" />
  }

  const note = noteData.data
  const source = note.content

  if (!source || typeof source !== 'string') {
    return <ErrorComponent error="找不到日記內容或格式錯誤！" />
  }

  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    },
    parseFrontmatter: true,
  }

  const { content, error } = await evaluate({
    source,
    options,
    components,
  })

  if (error) {
    return <ErrorComponent error={error.message} />
  }

  return (
    <div className="container m-auto mt-[120px] max-w-4xl px-4">
      <NoteHeader note={note} />
      <article className="prose dark:prose-invert max-w-full">
        <Suspense fallback={<LoadingComponent />}>{content}</Suspense>
      </article>
    </div>
  )
}
