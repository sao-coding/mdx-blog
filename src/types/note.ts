export interface NoteItem {
  id: string
  title: string
  mood: string
  weather: string
  bookmark: boolean
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Note extends NoteItem {
  content: string
  coordinates?: string
  location?: string
  topicId?: string | null
}
