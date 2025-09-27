// src/types/note.ts
export interface NoteItem {
  id: string
  title: string
  content: string
  mood: string | null
  weather: string | null
  bookmark: boolean
  status: 'published' | 'draft'
  coordinates: string | null
  location: string | null
  createdAt: string
  updatedAt: string
  topic: {
    id: string
    name: string
  } | null
}
