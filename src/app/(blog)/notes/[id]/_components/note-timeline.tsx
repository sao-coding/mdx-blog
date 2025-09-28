'use client'

import { ApiResponse } from '@/types/api'
import { NoteItem } from '@/types/note'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { NoteTimelineItem } from './note-timeline-item'

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
    <motion.ul
      className="space-y-1"
      initial="initial"
      animate="animate"
      transition={{
        staggerChildren: 0.05,
      }}
    >
      <AnimatePresence>
        {data?.data.map((note) => {
          const isCurrent = note.id?.toString() === id
          return (
            <NoteTimelineItem
              key={note.id}
              active={isCurrent}
              title={note.title}
              id={note.id}
            />
          )
        })}
      </AnimatePresence>
    </motion.ul>
  )
}

export default NoteTimeline
