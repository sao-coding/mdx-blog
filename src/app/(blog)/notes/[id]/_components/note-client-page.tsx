'use client'

import { useRef, type ReactNode } from 'react'
import { format } from 'date-fns'
import { ClockIcon } from 'lucide-react'
import { NoteMainContainer } from './note-main-container'
import TableOfContent from '@/components/toc'
import { NoteItem } from '@/types/note'
import { TocItem } from '@/types/toc'

interface NoteClientPageProps {
  note: NoteItem
  toc: TocItem[]
  children: ReactNode
}

export function NoteClientPage({ note, toc, children }: NoteClientPageProps) {
  const targetRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        ref={targetRef}
        className="lg:p-[30px_45px] p-[2rem_1rem] bg-white dark:bg-zinc-900 border-zinc-200/70 dark:border-neutral-800 border"
      >
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
            {children}
          </article>
        </NoteMainContainer>
      </div>
      <div className="relative hidden min-w-0 xl:block">
        <TableOfContent toc={toc} targetRef={targetRef} />
      </div>
    </>
  )
}
