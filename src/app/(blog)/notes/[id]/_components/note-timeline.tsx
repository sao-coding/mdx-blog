'use client'

import { ApiResponse } from '@/types/api'
import { NoteItem } from '@/types/note'
import { CircleArrowRightIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const NoteTimeline = () => {
  // 獲取目前筆記id
  const { id } = useParams()

  const { data } = useQuery<ApiResponse<NoteItem[]>>({
    queryKey: ['note-timeline', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/notes?id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) {
        throw new Error('Failed to fetch note timeline')
      }
      return res.json()
    },
    enabled: !!id, // 確保 id 存在時才執行查詢
  })

  return (
    <div>
      <ul>
        {data?.data.map((note) => {
          const isCurrent = note.id?.toString() === id
          return (
            <li
              key={note.id}
              className={`flex items-center gap-2 ${
                isCurrent ? 'font-semibold' : ''
              }`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              {isCurrent ? <CircleArrowRightIcon className="h-4 w-4" /> : null}
              <Link href={`/notes/${note.id}`}>{note.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NoteTimeline
