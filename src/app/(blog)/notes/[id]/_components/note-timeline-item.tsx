'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { CircleArrowRightIcon } from 'lucide-react'

interface NoteTimelineItemProps {
  active: boolean
  title: string
  id: number | string
}

export const NoteTimelineItem = ({
  active,
  title,
  id,
}: NoteTimelineItemProps) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2 transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
      aria-current={active ? 'true' : undefined}
    >
      {active && <CircleArrowRightIcon className="h-4 w-4 flex-shrink-0" />}
      <Link href={`/notes/${id}`} className="truncate" scroll={false}>
        {title}
      </Link>
    </motion.li>
  )
}
