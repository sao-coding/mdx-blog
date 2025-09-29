// src/app/(blog)/notes/[id]/page.tsx
import { NoteMainContainer } from './_components/note-main-container'
import {
  evaluate,
  type EvaluateOptions,
  type MDXComponents,
} from 'next-mdx-remote-client/rsc'
import { Metadata } from 'next'
import { ErrorComponent, LoadingComponent } from '@/components/index'
import { NoteItem } from '@/types/note'
import { ApiResponse } from '@/types/api'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import { ClockIcon } from 'lucide-react'
import { Suspense } from 'react'
import rehypeSlug from 'rehype-slug'
import { getBasicMdxOptions } from '@/components/mdx/parsers'
import { MdxRenderer, components } from '@/components/mdx/mdx-renderer'

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

  const { content, error } = await evaluate({
    source,
    options: getBasicMdxOptions(source),
    components: components,
  })

  if (error) {
    return <ErrorComponent error={error.message} />
  }

  return (
    <div className="lg:p-[30px_45px] p-[2rem_1rem] bg-white dark:bg-zinc-900 border-zinc-200/70 dark:border-neutral-800 border">
      <div className="">
        <h1 className="my-8 text-balance text-left text-4xl font-bold leading-tight text-base-content/95">
          {note.title}
        </h1>
        <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
          <span className="inline-flex items-center space-x-1">
            <ClockIcon className="size-4" />
            <span>{format(new Date(note.createdAt), 'yyyy-MM-dd')}</span>
          </span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center space-x-1">
            <span>天氣</span>
            <span>{note.weather}</span>
          </span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center space-x-1">
            <span>心情</span>
            <span>{note.mood}</span>
          </span>
        </span>
      </div>
      <NoteMainContainer>
        <article className="prose dark:prose-invert max-w-full mt-10">
          <MdxRenderer content={content} error={error} />
        </article>
      </NoteMainContainer>
    </div>
  )
}
